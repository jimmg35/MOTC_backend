import { error } from "console"
import { createConnection, Connection, ConnectionOptions } from "typeorm"
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"
import { Role } from "./entity/authentication/Role"
import { User } from "./entity/authentication/User"
import { UserThumbnail } from "./entity/authentication/UserThumbnail"
import { FixedSensorInfo } from "./entity/motc/FixedSensorInfo"
import { ProjectsInfo } from "./entity/motc/ProjectsInfo"
import { RealTimePm25 } from "./entity/motc/RealTimeEntity/RealTimePm25"
import { RealTimeVoc } from "./entity/motc/RealTimeEntity/RealTimeVoc"

export interface IDbConfig {
  type: string
  host: string
  port: number
  username: string
  password: string
  database: string
}

export interface IDbContext {
  dbConfig: IDbConfig
  connection: Connection
  connect (): void
  parseConfig (): void
}

export class DbContext implements IDbContext {
  public dbConfig: IDbConfig
  public connection: Connection
  constructor() {
    this.parseConfig()
  }
  public connect = async () => { }
  public parseConfig = () => {
    this.dbConfig = {
      type: process.env[this.constructor.name + "_TYPE"]!,
      host: process.env[this.constructor.name + "_HOST"]!,
      port: Number(process.env[this.constructor.name + "_PORT"]!),
      username: process.env[this.constructor.name + "_USERNAME"]!,
      password: process.env[this.constructor.name + "_PASSWORD"]!,
      database: process.env[this.constructor.name + "_DATABASE"]!
    }
  }
}


export class WebApiContext extends DbContext {

  constructor() {
    super()
  }

  public connect = async () => {
    try {
      this.connection = await createConnection({
        "type": this.dbConfig.type as PostgresConnectionOptions['type'],
        "host": this.dbConfig.host,
        "port": this.dbConfig.port,
        "username": this.dbConfig.username,
        "password": this.dbConfig.password,
        "database": this.dbConfig.database,
        "entities": [
          Role, User, UserThumbnail, FixedSensorInfo, ProjectsInfo,
          RealTimePm25, RealTimeVoc
        ],
        "migrations": [
          "build/migration/*.js"
        ],
        "logging": false,
        "synchronize": false,
        "cli": {
          "migrationsDir": "src/migration"
        }
      })
    } catch (error: unknown) {
      console.log("database connection failed! ")
      throw error
    }

  }
}

// // 輸入假資料
// (async () => {
//     const dbcontext = new WebApiContext()
//     await dbcontext.connect()
//     console.log(dbcontext.connection.isConnected)
//     // let role_repository = dbcontext.connection.getRepository(Role)
//     // await role_repository.insert({
//     //     name: "admin"
//     // })
// })();



// typeorm migration:run
// typeorm migration:generate -n [migration_name]