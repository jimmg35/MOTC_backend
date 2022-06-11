import mqtt, { MqttClient } from 'mqtt'
import { ProjectsInfo } from '../entity/motc/ProjectsInfo'
import util from 'util'
import MQTT from 'async-mqtt'

export interface IMqtter {
  clients: { [key: string]: MqttClient }
}

export class Mqtter implements IMqtter {
  public clients: { [key: string]: MqttClient }

  constructor() {
    this.clients = {}
  }

  public createConnection = async (projectInfo: ProjectsInfo) => {
    let client: MQTT.AsyncMqttClient | undefined
    try {
      client = await MQTT.connectAsync({
        host: process.env.Resident_Mqtt_DOMAIN as string,
        port: process.env.Resident_Mqtt_PORT as unknown as number,
        username: projectInfo.projectKey,
        password: projectInfo.projectKey
      })
    } catch (err) {
      client = undefined
      console.log(err)
    }
    if (client) {
      this.clients[projectInfo.projectId!] = client
    }
  }

  public subscribe = async (
    projectInfo: ProjectsInfo,
    insertData2Db: (topic: string, msg: Buffer) => Promise<void>
  ) => {
    const client = this.clients[projectInfo.projectId!]
    client.subscribe(`/v1/project/${projectInfo.projectId}/#`)
    client.on('message', insertData2Db)
  }

}