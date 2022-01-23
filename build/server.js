"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
require("./pre-start");
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const express_1 = __importStar(require("express"));
const BaseController_1 = require("./controllers/BaseController");
class Server {
    /**
     * 建構子內的方法須按順序執行
     * @param controllers 要註冊的controller陣列
     */
    constructor(options) {
        /**
         * 註冊middlewares
         */
        this.addMiddlewares = () => {
            this.app.use(express_1.default.urlencoded({ extended: true }));
            this.app.use(express_1.default.json());
            this.app.use(cors_1.default());
        };
        /**
         * 用於註冊router
         */
        this.bindRouter = () => {
            this.app.set('port', process.env.PORT || 5000);
            this.app.use('/api', this.routerBundler);
        };
        /**
         * 註冊controller與其方法至router上
         * @param controllers
         */
        this.registerControllers = (controllers) => {
            // 註冊controller與其方法至router上
            controllers.forEach((controller, index) => {
                BaseController_1.autoInjectSubRoutes(controller);
                this.routerBundler.use(controller.routerName, controller.getRouter());
            });
        };
        this.start = () => {
            if (process.env.PROTOCOL == 'https') {
                https_1.default.createServer({
                    key: fs_1.default.readFileSync(path_1.default.join(__dirname, `../envConfig/https/agent2-key.pem`)),
                    cert: fs_1.default.readFileSync(path_1.default.join(__dirname, `../envConfig/https/agent2-cert.pem`))
                }, this.app).listen(this.app.get("port"), () => {
                    console.log(`server is listening at ${process.env.PROTOCOL}://${process.env.DOMAIN_NAME}:${this.app.get('port')}`);
                });
            }
            else {
                this.app.listen(this.app.get("port"), () => {
                    console.log(`server is listening at ${process.env.PROTOCOL}://${process.env.DOMAIN_NAME}:${this.app.get('port')}`);
                });
            }
        };
        this.app = express_1.default();
        this.addMiddlewares();
        this.routerBundler = express_1.Router();
        this.registerControllers(options.controllers);
        this.bindRouter();
    }
}
exports.Server = Server;
