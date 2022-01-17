"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = require("./BaseController");
const dbcontext_1 = require("../dbcontext");
const tsyringe_1 = require("tsyringe");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const { BAD_REQUEST, CREATED, OK, CONFLICT } = http_status_codes_1.default;
let HomeController = class HomeController extends BaseController_1.BaseController {
    constructor(dbcontext) {
        super();
        this.routeHttpMethod = {
            "get": "GET",
            "post": "POST"
        };
        this.get = async (req, res) => {
            const params_set = Object.assign({}, req.query);
            return res.status(OK).json(Object.assign({}, params_set));
        };
        this.post = async (req, res) => {
            const params_set = Object.assign({}, req.body);
            return res.status(OK).json(Object.assign({}, params_set));
        };
        this.dbcontext = dbcontext;
        this.dbcontext.connect();
    }
};
HomeController = __decorate([
    tsyringe_1.autoInjectable(),
    __metadata("design:paramtypes", [dbcontext_1.WebApiContext])
], HomeController);
exports.default = HomeController;
