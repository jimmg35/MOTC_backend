import BaseResident from './BaseResident'
import { autoInjectable } from 'tsyringe'
import { WebApiContext } from '../dbcontext'
import { Mqtter } from '../lib/Mqtter'
import { ProjectsInfo } from '../entity/motc/ProjectsInfo'
import { RealTimePm25 } from '../entity/motc/RealTimeEntity/RealTimePm25'
import { RealTimeVoc } from '../entity/motc/RealTimeEntity/RealTimeVoc'
import { Repository } from 'typeorm'
import { FixedRealTime } from '../entity/motc/RealTimeEntity/FixedRealTime'
import { MobileRealTime } from '../entity/motc/RealTimeEntity/MobileRealTime'

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
  public mobileRepo: Repository<MobileRealTime>

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
    this.mobileRepo = this.dbcontext.connection.getRepository(MobileRealTime)
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
      if (this.projects[i].projectId === '1156') {
        await this.mqtter.subscribe(this.projects[i], this.dumpMobileData2Db)
        continue
      }
      await this.mqtter.subscribe(this.projects[i], this.insertFixedData2Db)
    }
  }

  public insertFixedData2Db = async (topic: string, msg: Buffer) => {
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

  public dumpMobileData2Db = async (topic: string, msg: Buffer) => {
    const result: IDeviceResponse = JSON.parse(msg.toString())

    const record = await this.mobileRepo.find({
      where: {
        deviceId: result.deviceId
      }
    })
    if (record.length === 0) {
      if (result.id === 'pm2_5_uart') {
        this._insertMobileUart(result)
      }
      if (result.id === 'voc') {
        this._insertMobileVoc(result)
      }
      if (result.id === 'pm2_5_i2c') {
        this._insertMobileI2c(result)
      }
      if (result.id === 'co') {
        this._insertMobileCo(result)
      }
      if (result.id === 'temperature') {
        this._insertMobileTemp(result)
      }
      if (result.id === 'humidity') {
        this._insertMobileHum(result)
      }
      if (result.id === 'sfm_flow') {
        this._insertMobileFlow(result)
      }
      if (result.id === 'speed') {
        this._insertMobileSpeed(result)
      }
    } else {
      const rowToUpdate = record[0]
      if (rowToUpdate) {
        if (result.id === 'pm2_5_uart') {
          this._updateMobileUart(rowToUpdate, result)
        }
        if (result.id === 'voc') {
          this._updateMobileVoc(rowToUpdate, result)
        }
        if (result.id === 'pm2_5_i2c') {
          this._updateMobileI2c(rowToUpdate, result)
        }
        if (result.id === 'co') {
          this._updateMobileCo(rowToUpdate, result)
        }
        if (result.id === 'temperature') {
          this._updateMobileTemp(rowToUpdate, result)
        }
        if (result.id === 'humidity') {
          this._updateMobileHum(rowToUpdate, result)
        }
        if (result.id === 'sfm_flow') {
          this._updateMobileFlow(rowToUpdate, result)
        }
        if (result.id === 'speed') {
          this._updateMobileSpeed(rowToUpdate, result)
        }
      }
    }


    // if (result.id === 'pm2_5_uart') {
    //   const record = await this.mobileRepo.find({
    //     where: {
    //       deviceId: result.deviceId
    //     }
    //   })
    //   if (record.length === 0) { // insert row
    //     const mobileRealTime = new MobileRealTime()
    //     mobileRealTime.deviceId = result.deviceId
    //     mobileRealTime.pm25UartValue = Number(result.value[0])
    //     mobileRealTime.coordinate = {
    //       type: 'Point',
    //       coordinates: [result.lon, result.lat]
    //     }
    //     await this.mobileRepo.save(mobileRealTime)
    //   } else { // update row
    //     const rowToUpdate = record[0]
    //     if (rowToUpdate) {
    //       rowToUpdate.pm25UartValue = Number(result.value[0])
    //       rowToUpdate.coordinate = {
    //         type: 'Point',
    //         coordinates: [result.lon, result.lat]
    //       }
    //       await this.mobileRepo.save(rowToUpdate)
    //     }
    //   }
    // }
  }

  private _insertMobileVoc = async (result: IDeviceResponse) => {
    const mobileRealTime = new MobileRealTime()
    mobileRealTime.deviceId = result.deviceId
    mobileRealTime.vocValue = Number(result.value[0])
    mobileRealTime.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(mobileRealTime)
  }

  private _updateMobileVoc = async (rowToUpdate: MobileRealTime, result: IDeviceResponse) => {
    rowToUpdate.vocValue = Number(result.value[0])
    rowToUpdate.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(rowToUpdate)
  }

  private _insertMobileUart = async (result: IDeviceResponse) => {
    const mobileRealTime = new MobileRealTime()
    mobileRealTime.deviceId = result.deviceId
    mobileRealTime.pm25UartValue = Number(result.value[0])
    mobileRealTime.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(mobileRealTime)
  }

  private _updateMobileUart = async (rowToUpdate: MobileRealTime, result: IDeviceResponse) => {
    rowToUpdate.pm25UartValue = Number(result.value[0])
    rowToUpdate.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(rowToUpdate)
  }

  private _insertMobileI2c = async (result: IDeviceResponse) => {
    const mobileRealTime = new MobileRealTime()
    mobileRealTime.deviceId = result.deviceId
    mobileRealTime.pm25I2cValue = Number(result.value[0])
    mobileRealTime.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(mobileRealTime)
  }

  private _updateMobileI2c = async (rowToUpdate: MobileRealTime, result: IDeviceResponse) => {
    rowToUpdate.pm25I2cValue = Number(result.value[0])
    rowToUpdate.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(rowToUpdate)
  }

  private _insertMobileCo = async (result: IDeviceResponse) => {
    const mobileRealTime = new MobileRealTime()
    mobileRealTime.deviceId = result.deviceId
    mobileRealTime.coValue = Number(result.value[0])
    mobileRealTime.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(mobileRealTime)
  }

  private _updateMobileCo = async (rowToUpdate: MobileRealTime, result: IDeviceResponse) => {
    rowToUpdate.coValue = Number(result.value[0])
    rowToUpdate.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(rowToUpdate)
  }

  private _insertMobileTemp = async (result: IDeviceResponse) => {
    const mobileRealTime = new MobileRealTime()
    mobileRealTime.deviceId = result.deviceId
    mobileRealTime.temperature = Number(result.value[0])
    mobileRealTime.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(mobileRealTime)
  }

  private _updateMobileTemp = async (rowToUpdate: MobileRealTime, result: IDeviceResponse) => {
    rowToUpdate.temperature = Number(result.value[0])
    rowToUpdate.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(rowToUpdate)
  }

  private _insertMobileHum = async (result: IDeviceResponse) => {
    const mobileRealTime = new MobileRealTime()
    mobileRealTime.deviceId = result.deviceId
    mobileRealTime.humidity = Number(result.value[0])
    mobileRealTime.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(mobileRealTime)
  }

  private _updateMobileHum = async (rowToUpdate: MobileRealTime, result: IDeviceResponse) => {
    rowToUpdate.humidity = Number(result.value[0])
    rowToUpdate.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(rowToUpdate)
  }

  private _insertMobileFlow = async (result: IDeviceResponse) => {
    const mobileRealTime = new MobileRealTime()
    mobileRealTime.deviceId = result.deviceId
    mobileRealTime.flow = Number(result.value[0])
    mobileRealTime.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(mobileRealTime)
  }

  private _updateMobileFlow = async (rowToUpdate: MobileRealTime, result: IDeviceResponse) => {
    rowToUpdate.flow = Number(result.value[0])
    rowToUpdate.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(rowToUpdate)
  }

  private _insertMobileSpeed = async (result: IDeviceResponse) => {
    const mobileRealTime = new MobileRealTime()
    mobileRealTime.deviceId = result.deviceId
    mobileRealTime.speed = Number(result.value[0])
    mobileRealTime.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(mobileRealTime)
  }

  private _updateMobileSpeed = async (rowToUpdate: MobileRealTime, result: IDeviceResponse) => {
    rowToUpdate.speed = Number(result.value[0])
    rowToUpdate.coordinate = {
      type: 'Point',
      coordinates: [result.lon, result.lat]
    }
    await this.mobileRepo.save(rowToUpdate)
  }
}
