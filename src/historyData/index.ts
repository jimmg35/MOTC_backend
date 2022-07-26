

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
    // console.log(err)
    console.log(`${props.deviceId} | ${props.date} | decompress failed`)
    // fs.unlinkSync(props.path)
    // fs.unlinkSync(props.path.replace('.gz', ''))
  }
}

const getHistoryCSV = async (props: { deviceId: string, date: string }) => {
  // console.log(`https://iot.epa.gov.tw/fapi_open/topic-device-daily/topic_save.industry.rawdata.material/device_${props.deviceId}/device_${props.deviceId}_daily_${props.date}.csv.gz`)
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

  // const startDate = new Date('2022-01-01')
  // const connection = await createConnection()
  // const fixedSensorInfoRepo = await connection.getRepository(FixedSensorInfo)
  // const fixedSensorInfos = await fixedSensorInfoRepo.find()

  // for (let i = 0; i < 151; i++) {
  //   const dateString = moment(startDate).add(i, 'days').format('YYYY-MM-DD')
  //   for (let j = 0; j < fixedSensorInfos.length; j++) {
  //     await getHistoryCSV({
  //       deviceId: fixedSensorInfos[j].deviceId,
  //       date: dateString
  //     })
  //   }
  // }


  // 往返
  // const startDate = new Date('2022-06-02')
  // const dateString = moment(startDate).format('YYYY-MM-DD')
  // await getHistoryCSV({
  //   deviceId: '11954942561',
  //   date: dateString
  // })

  // 大台北地區 taipeiDeviceIds
  const taipeiDeviceIds = [
    '11913957916', '11914563346', '11913243605', '11913766175', '11913148504'
  ]

  // 火鳥 fireBirdDeviceIds
  const fireBirdDeviceIds = [
    '11890764360', '11913629180', '11953389447'
  ]

  // 中壢、平鎮工業區 industryDeviceIds
  const industryDeviceIds = [
    '11914648549', '11891040633', '11891278317'
  ]

  // 台南鹽水蜂炮 tainanDeviceIds
  const deviceIds = [
    '11891040633', '11891278317', '11913321910', '11914648549', '11953725576'
  ]

  // 高屏地區
  const pingDeviceIds = [
    '12409791729', '12409680913', '12410023550', '12410378221', '12410907444',
    '12411608778', '12410472588', '12410593820', '12410851468', '12410754186',
    '12410200495', '12411089672', '12411113481', '12411334687', '12407126923',
    '12407674238', '12409180726', '12411218740', '12407869059', '12408763664',
    '12408148923', '11891524424', '11954491464', '11913505644', '11891367361',
    '11890821711', '11954000721', '1954868840', '11890955024'
  ]

  for (let i = 0; i < deviceIds.length; i++) {
    const deviceID = deviceIds[i]
    const startDate = new Date('2022-11-01')
    for (let j = 0; j < 30; j++) {
      const dateString = moment(startDate).add(j, 'days').format('YYYY-MM-DD')
      await getHistoryCSV({
        deviceId: deviceID,
        date: dateString
      })
    }
  }


})()
