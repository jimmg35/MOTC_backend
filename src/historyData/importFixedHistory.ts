import csvParser from 'csv-parser'
import fs from 'fs'
import internal from 'stream'
import { createConnection } from 'typeorm'
import { FixedHistory } from '../entity/motc/RouteEntity/FixedHistory'

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

interface IFixedHistory {
  createTime: string
  deviceId: string
  localTime: string
  lat: string
  lon: string
  sensorId: string
  value: string
}

(async () => {

  const connection = await createConnection()
  const fixedHistory_repository = connection.getRepository(FixedHistory)

  const data = await readCsvFile<IFixedHistory>(`./historyDataRepo/device_7478452318_daily_2022-07-01.csv`)
  // console.log(data[0])

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const record = await fixedHistory_repository.find({
      where: {
        updateTime: row.createTime
      }
    })

    if (record.length === 0) { // 新增紀錄
      const newRecord = new FixedHistory()
      newRecord.deviceId = row.deviceId
      newRecord.updateTime = new Date(row.createTime)
      newRecord.coordinate = {
        type: 'Point',
        coordinates: [Number(row.lon), Number(row.lat)]
      }
      if (row.sensorId === 'temperature') {
        newRecord.temperature = Number(row.value)
      } else if (row.sensorId === 'pm2_5') {
        newRecord.pm25Value = Number(row.value)
      } else if (row.sensorId === 'humidity') {
        newRecord.humidity = Number(row.value)
      } else if (row.sensorId === 'voc') {
        newRecord.vocValue = Number(row.value)
      }
      await fixedHistory_repository.save(newRecord)
      console.log('new')
    }
    else { // 更新紀錄
      const updatedRecord = record[0]
      if (row.sensorId === 'temperature') {
        updatedRecord.temperature = Number(row.value)
      } else if (row.sensorId === 'pm2_5') {
        updatedRecord.pm25Value = Number(row.value)
      } else if (row.sensorId === 'humidity') {
        updatedRecord.humidity = Number(row.value)
      } else if (row.sensorId === 'voc') {
        updatedRecord.vocValue = Number(row.value)
      }
      updatedRecord.updateTime = new Date(row.createTime)
      await fixedHistory_repository.save(updatedRecord)
      console.log('updated')
    }


  }

})()