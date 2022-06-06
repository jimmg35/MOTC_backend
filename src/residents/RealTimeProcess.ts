import BaseResident from './BaseResident'
import { autoInjectable } from 'tsyringe'
import { WebApiContext } from '../dbcontext'
import { Mqtter } from '../lib/Mqtter'
import { ProjectsInfo } from '../entity/motc/ProjectsInfo'

@autoInjectable()
export default class RealTimeProcess implements BaseResident {
  public dbcontext: WebApiContext
  public mqtter: Mqtter

  constructor(dbcontext: WebApiContext, mqtter: Mqtter) {
    this.dbcontext = dbcontext
    this.mqtter = mqtter
  }

  public start = async () => {
    await this.dbcontext.connect()
    if (this.dbcontext.connection) {
      const projectRepo = this.dbcontext.connection.getRepository(ProjectsInfo)
      const projects = await projectRepo.find()

      projects.forEach((project) => {
        this.mqtter.createConnection(project)
      })
    }
  }
}
