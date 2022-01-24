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
const User_1 = require("../entity/authentication/User");
const dbcontext_1 = require("../dbcontext");
const tsyringe_1 = require("tsyringe");
const fast_sha256_1 = __importDefault(require("fast-sha256"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
const JwtAuthenticator_1 = __importDefault(require("../lib/JwtAuthenticator"));
const { BAD_REQUEST, CREATED, OK, CONFLICT, NOT_FOUND, FORBIDDEN, UNAUTHORIZED } = http_status_codes_1.default;
let AuthController = class AuthController extends BaseController_1.BaseController {
    constructor(dbcontext, jwtAuthenticator) {
        super();
        this.routeHttpMethod = {
            "authenticate": "POST",
            "refresh": "POST",
            "validate": "POST"
        };
        this.authenticate = async (req, res) => {
            const params_set = Object.assign({}, req.body);
            const user_repository = this.dbcontext.connection.getRepository(User_1.User);
            const user = await user_repository.findOne({ username: params_set.username });
            if ((user === null || user === void 0 ? void 0 : user.password) == tweetnacl_util_1.default.encodeBase64(fast_sha256_1.default(params_set.password))) {
                const token = this.jwtAuthenticator.signToken({
                    _userId: user.userId,
                    username: user.username
                });
                return res.status(OK).json({
                    "token": token
                });
            }
            return res.status(UNAUTHORIZED).json({
                "status": "login failed"
            });
        };
        this.refresh = async (req, res) => {
            const params_set = Object.assign({}, req.body);
            // if(this.jwtAuthenticator.isTokenExpired(params_set.token)
            return res.status(OK).json({
                "status": "success"
            });
        };
        this.validate = async (req, res) => {
            const params_set = Object.assign({}, req.body);
            const status = this.jwtAuthenticator.isTokenValid(params_set.token);
            if (status) {
                return res.status(OK).json({
                    "status": "token is valid"
                });
            }
            return res.status(UNAUTHORIZED).json({
                "status": "token is not valid"
            });
        };
        this.dbcontext = dbcontext;
        this.dbcontext.connect();
        this.jwtAuthenticator = jwtAuthenticator;
    }
};
AuthController = __decorate([
    tsyringe_1.autoInjectable(),
    __metadata("design:paramtypes", [dbcontext_1.WebApiContext, JwtAuthenticator_1.default])
], AuthController);
exports.default = AuthController;
