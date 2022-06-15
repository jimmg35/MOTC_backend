import BaseResident from './BaseResident'
import { autoInjectable } from 'tsyringe'
import { WebApiContext } from '../dbcontext'
import { Mqtter } from '../lib/Mqtter'
import { ProjectsInfo } from '../entity/motc/ProjectsInfo'
import { RealTimePm25 } from '../entity/motc/RealTimeEntity/RealTimePm25'
import { RealTimeVoc } from '../entity/motc/RealTimeEntity/RealTimeVoc'
import { Repository } from 'typeorm'

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
  public pm25Repo: Repository<RealTimePm25>
  public vocRepo: Repository<RealTimePm25>

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
    this.pm25Repo = this.dbcontext.connection.getRepository(RealTimePm25)
    this.vocRepo = this.dbcontext.connection.getRepository(RealTimeVoc)
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

    let repo: Repository<any> | undefined = undefined
    if (result.id === 'pm2_5') {
      const record = await this.pm25Repo.find({
        where: {
          deviceId: result.deviceId
        }
      })
      if (record.length === 0) { // insert row
        const realTimePm25Row = new RealTimePm25()
        realTimePm25Row.deviceId = result.deviceId
        realTimePm25Row.value = Number(result.value[0])
        realTimePm25Row.coordinate = {
          type: 'Point',
          coordinates: [result.lon, result.lat]
        }
        await this.pm25Repo.save(realTimePm25Row)
      } else { // update row
        const rowToUpdate = record[0]
        if (rowToUpdate) {
          rowToUpdate.value = Number(result.value[0])
          rowToUpdate.coordinate = {
            type: 'Point',
            coordinates: [result.lon, result.lat]
          }
          await this.pm25Repo.save(rowToUpdate)
        }
      }

    }
  }
}
