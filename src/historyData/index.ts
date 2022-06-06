

import fs from 'fs'
import https from 'https'
import { WebApiContext } from '../dbcontext'
import { FixedSensorInfo } from '../entity/motc/FixedSensorInfo'
import { createConnection } from 'typeorm'
import { gunzip } from 'zlib'
import JSZip from 'jszip'
import util from 'util'
import path from 'path'
import moment from 'moment'

const fetchData = async (props: { path: string, uri: string, deviceId: string, date: string }): Promise<boolean> => {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(props.path)
    const request = https.get(props.uri, function (response) {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on("finish", () => {
          file.close()
          console.log(`${props.deviceId} | ${props.date} | download completed`)
          resolve(true)
        })
        file.on("error", () => {
          console.log(`${props.deviceId} | ${props.date} | download failed`)
          resolve(false)
        })
      }
    })
  })
}

const upzipFile = async (props: { path: string, deviceId: string, date: string }) => {
  const zip = new JSZip()
  const readFile = util.promisify(fs.readFile)
  const gunzipAsync = util.promisify(gunzip)

  const data = await readFile(props.path)
  const writer = fs.createWriteStream(props.path.replace('.gz', ''))
  try {
    const buffer = await gunzipAsync(data)
    writer.write(buffer)
    writer.close()
    fs.unlinkSync(props.path)
  } catch (err) {
    console.log(`${props.deviceId} | ${props.date} | decompress failed`)
  }
}

const getHistoryCSV = async (props: { deviceId: string, date: string }) => {
  const downloadStatus = await fetchData({
    path: `./historyDataRepo/device_${props.deviceId}_daily_${props.date}.csv.gz`,
    uri: `https://iot.epa.gov.tw/fapi_open/topic-device-daily/topic_save.industry.rawdata.material/device_${props.deviceId}/device_${props.deviceId}_daily_${props.date}.csv.gz`,
    deviceId: props.deviceId,
    date: props.date
  })
  if (downloadStatus) {
    await upzipFile({
      path: path.resolve(path.join(__dirname, `../../historyDataRepo/device_${props.deviceId}_daily_${props.date}.csv.gz`)),
      deviceId: props.deviceId,
      date: props.date
    })
  }
}

(async () => {

  const startDate = new Date('2021-01-01')
  const connection = await createConnection()
  const fixedSensorInfoRepo = await connection.getRepository(FixedSensorInfo)
  const fixedSensorInfos = await fixedSensorInfoRepo.find()

  for (let i = 0; i < 151; i++) {
    const dateString = moment(startDate).add(i, 'days').format('YYYY-MM-DD')
    for (let j = 0; j < fixedSensorInfos.length; j++) {
      await getHistoryCSV({
        deviceId: fixedSensorInfos[j].deviceId,
        date: dateString
      })
    }
  }

})()
