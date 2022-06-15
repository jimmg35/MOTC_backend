import BaseResident from './BaseResident'
import { autoInjectable } from 'tsyringe'
import { WebApiContext } from '../dbcontext'
import { Mqtter } from '../lib/Mqtter'
import { ProjectsInfo } from '../entity/motc/ProjectsInfo'
import { RealTimePm25 } from '../entity/motc/RealTimeEntity/RealTimePm25'
import { RealTimeVoc } from '../entity/motc/RealTimeEntity/RealTimeVoc'
import { Repository } from 'typeorm'
import { FixedRealTime } from '../entity/motc/RealTimeEntity/FixedRealTime'

export interface IDeviceResponse {
  lon: number
  id: string
  time: string
  deviceId: string
  value: string[]
  lat: number
}

@autoInjectable()
export default class RealTimeProcess implements BaseResident {
  public dbcontext: WebApiContext
  public mqtter: Mqtter
  public projects: ProjectsInfo[]
  public fixedRepo: Repository<FixedRealTime>

  constructor(dbcontext: WebApiContext, mqtter: Mqtter) {
    this.dbcontext = dbcontext
    this.mqtter = mqtter

  }

  public start = async () => {
    await this.dbcontext.connect()
    await this.getProjectsInfo()
    await this.getRealTimeRepos()
    await this.connectProjectsMqtt()
    await this.subscribeProjectsTopic()

  }

  public getRealTimeRepos = async () => {
    this.fixedRepo = this.dbcontext.connection.getRepository(FixedRealTime)
  }

  public getProjectsInfo = async () => {
    const projectRepo = this.dbcontext.connection.getRepository(ProjectsInfo)
    this.projects = await projectRepo.find()
  }

  public connectProjectsMqtt = async () => {
    for (let i = 0; i < this.projects.length; i++) {
      await this.mqtter.createConnection(this.projects[i])
    }
  }

  public subscribeProjectsTopic = async () => {
    for (let i = 0; i < this.projects.length; i++) {
      await this.mqtter.subscribe(this.projects[i], this.insertData2Db)
    }
  }

  public insertData2Db = async (topic: string, msg: Buffer) => {
    const result: IDeviceResponse = JSON.parse(msg.toString())

    if (result.id === 'pm2_5') {
      const record = await this.fixedRepo.find({
        where: {
          deviceId: result.deviceId
        }
      })
      if (record.length === 0) { // insert row
        const fixedRealTime = new FixedRealTime()
        fixedRealTime.deviceId = result.deviceId
        fixedRealTime.pm25Value = Number(result.value[0])
        fixedRealTime.coordinate = {
          type: 'Point',
          coordinates: [result.lon, result.lat]
        }
        await this.fixedRepo.save(fixedRealTime)
      } else { // update row
        const rowToUpdate = record[0]
        if (rowToUpdate) {
          rowToUpdate.pm25Value = Number(result.value[0])
          rowToUpdate.coordinate = {
            type: 'Point',
            coordinates: [result.lon, result.lat]
          }
          await this.fixedRepo.save(rowToUpdate)
        }
      }

    }
  }
}
