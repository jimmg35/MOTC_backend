import csvParser from 'csv-parser'
import fs from 'fs'
import internal from 'stream'
import { createConnection } from 'typeorm'
import { MobileHistory } from '../entity/motc/RealTimeEntity/MobileHistory'

export const readCsvFile = async <T> (filePath: string): Promise<T[]> => {
  return new Promise((resolve) => {
    const stream: fs.ReadStream = fs.createReadStream(filePath)
    const transform: internal.Transform = stream.pipe(csvParser())
    const results: T[] = []
    transform.on('data', (data: T) => {
      results.push(data)
    })
    transform.on('end', () => {
      stream.close()
      resolve(results)
    })
  })
}

interface IMHRaw {
  createTime: string
  deviceId: string
  lat: string
  localTime: string
  lon: string
  sensorId: string
  value: string
}

(async () => {

  const connection = await createConnection()
  const mobileHistory_repository = connection.getRepository(MobileHistory)

  const files = fs.readdirSync('./historyDataRepo')

  for (let j = 0; j < files.length; j++) {
    const data = await readCsvFile<IMHRaw>(`./historyDataRepo/${files[j]}`)
    for (let i = 0; i < data.length; i++) {
      const rawRow = data[i]
      const record = await mobileHistory_repository.find({
        where: {
          updateTime: rawRow.createTime
        }
      })
      if (record.length === 0) { // 新增紀錄
        const newRecord = new MobileHistory()
        newRecord.deviceId = rawRow.deviceId
        newRecord.updateTime = new Date(rawRow.createTime)
        newRecord.coordinate = {
          type: 'Point',
          coordinates: [Number(rawRow.lon), Number(rawRow.lat)]
        }
        if (rawRow.sensorId === 'temperature') {
          newRecord.temperature = Number(rawRow.value)
        } else if (rawRow.sensorId === 'speed') {
          newRecord.speed = Number(rawRow.value)
        } else if (rawRow.sensorId === 'pm2_5_i2c') {
          newRecord.pm25I2cValue = Number(rawRow.value)
        } else if (rawRow.sensorId === 'pm2_5_uart') {
          newRecord.pm25UartValue = Number(rawRow.value)
        } else if (rawRow.sensorId === 'co') {
          newRecord.coValue = Number(rawRow.value)
        } else if (rawRow.sensorId === 'humidity') {
          newRecord.humidity = Number(rawRow.value)
        } else if (rawRow.sensorId === 'sfm_flow') {
          newRecord.flow = Number(rawRow.value)
        } else if (rawRow.sensorId === 'voc') {
          newRecord.vocValue = Number(rawRow.value)
        }
        await mobileHistory_repository.save(newRecord)
        console.log('new')
      }
      else { // 更新紀錄
        const updatedRecord = record[0]
        if (rawRow.sensorId === 'temperature') {
          updatedRecord.temperature = Number(rawRow.value)
        } else if (rawRow.sensorId === 'speed') {
          updatedRecord.speed = Number(rawRow.value)
        } else if (rawRow.sensorId === 'pm2_5_i2c') {
          updatedRecord.pm25I2cValue = Number(rawRow.value)
        } else if (rawRow.sensorId === 'pm2_5_uart') {
          updatedRecord.pm25UartValue = Number(rawRow.value)
        } else if (rawRow.sensorId === 'co') {
          updatedRecord.coValue = Number(rawRow.value)
        } else if (rawRow.sensorId === 'humidity') {
          updatedRecord.humidity = Number(rawRow.value)
        } else if (rawRow.sensorId === 'sfm_flow') {
          updatedRecord.flow = Number(rawRow.value)
        } else if (rawRow.sensorId === 'voc') {
          updatedRecord.vocValue = Number(rawRow.value)
        }
        updatedRecord.updateTime = new Date(rawRow.createTime)
        await mobileHistory_repository.save(updatedRecord)
        console.log('updated')
      }
    }
  }

})()