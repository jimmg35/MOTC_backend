"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const controllers_1 = require("./controllers");
const tsyringe_1 = require("tsyringe");
(async () => {
    // 輸入資料
    // const seeder = container.resolve(Seeder)
    // await seeder.dbcontext.connect()
    // await seeder.seedRole()
    // await seeder.dbcontext.connection.close()
    // 註冊controllers
    const homeController = tsyringe_1.container.resolve(controllers_1.HomeController);
    const userController = tsyringe_1.container.resolve(controllers_1.UserController);
    const authController = tsyringe_1.container.resolve(controllers_1.AuthController);
    const server = new server_1.Server({
        controllers: [homeController, userController, authController]
    });
    // 啟動後端伺服器
    server.start();
})();
