import mqtt, { MqttClient } from 'mqtt'
import { ProjectsInfo } from '../entity/motc/ProjectsInfo'

export interface IMqtter {
  clients: MqttClient[]
}

export interface IDeviceResponse {
  lon: number
  id: string
  time: string
  deviceId: string
  value: string[]
  lat: number
}

export class Mqtter implements IMqtter {
  public clients: MqttClient[]

  constructor() {
    this.clients = []
  }

  public createConnection = (projectInfo: ProjectsInfo) => {
    const client = mqtt.connect({
      host: process.env.Resident_Mqtt_DOMAIN as string,
      port: process.env.Resident_Mqtt_PORT as unknown as number,
      username: projectInfo.projectKey,
      password: projectInfo.projectKey
    })
    client.on('connect', () => {
      client.subscribe(`/v1/project/${projectInfo.projectId}/#`, () => {
        client.on('message', (topic, msg) => {
          const result: IDeviceResponse = JSON.parse(msg.toString())
          console.log(result)
        })
        this.clients.push(client)
      })
    })
    client.on('error', (er) => {
      console.log(er)
    })
  }

}