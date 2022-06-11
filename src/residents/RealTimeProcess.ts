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
  public RealTimeRepos: { [key: string]: Repository<any> }

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
    this.RealTimeRepos = {
      'pm2_5': this.dbcontext.connection.getRepository(RealTimePm25),
      'voc': this.dbcontext.connection.getRepository(RealTimeVoc)
    }
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
      repo = this.RealTimeRepos[result.id] as Repository<RealTimePm25>
      const record = await repo.find({
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
        await repo.save(realTimePm25Row)
      } else { // upd ate row

      }
    }
  }
}
