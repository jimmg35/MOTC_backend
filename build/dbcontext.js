"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebApiContext = exports.DbContext = void 0;
const typeorm_1 = require("typeorm");
class DbContext {
    constructor() {
        this.connect = async () => { };
        this.parseConfig = () => {
            this.dbConfig = {
                type: process.env[this.constructor.name + "_TYPE"],
                host: process.env[this.constructor.name + "_HOST"],
                port: Number(process.env[this.constructor.name + "_PORT"]),
                username: process.env[this.constructor.name + "_USERNAME"],
                password: process.env[this.constructor.name + "_PASSWORD"],
                database: process.env[this.constructor.name + "_DATABASE"]
            };
        };
        this.parseConfig();
    }
}
exports.DbContext = DbContext;
class WebApiContext extends DbContext {
    constructor() {
        super();
        this.connect = async () => {
            try {
                this.connection = await typeorm_1.createConnection({
                    "type": this.dbConfig.type,
                    "host": this.dbConfig.host,
                    "port": this.dbConfig.port,
                    "username": this.dbConfig.username,
                    "password": this.dbConfig.password,
                    "database": this.dbConfig.database,
                    "entities": [
                        "build/entity/authentication/Role.js",
                        "build/entity/authentication/User.js"
                    ],
                    "migrations": [
                        "build/migration/*.js"
                    ],
                    "logging": false,
                    "synchronize": false,
                    "cli": {
                        "migrationsDir": "src/migration"
                    }
                });
            }
            catch (error) {
                console.log("database connection failed! ");
                throw error;
            }
        };
    }
}
exports.WebApiContext = WebApiContext;
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
