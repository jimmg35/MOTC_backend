import { Server } from "./server"
import {
  UserController,
  AuthController
} from './controllers'
import { container } from "tsyringe"
import sha256 from "fast-sha256"
import util from "tweetnacl-util"
import RealTimeProcess from "./residents/RealTimeProcess"

(async () => {
  // console.log(util.encodeBase64(sha256('jim60308' as any)))

  // 輸入資料
  // const seeder = container.resolve(Seeder)
  // await seeder.dbcontext.connect()
  // await seeder.seedRole()
  // await seeder.dbcontext.connection.close()

  // 註冊controllers
  const userController = container.resolve(UserController)
  const authController = container.resolve(AuthController)
  // 註冊residents
  // const realTimeProcess = container.resolve(RealTimeProcess)
  const server = new Server({
    controllers: [userController, authController],
    residents: []
  })

  // 啟動後端伺服器
  server.start()

})()
