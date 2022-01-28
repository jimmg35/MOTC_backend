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
const util_1 = require("./util");
const BaseController_1 = require("./BaseController");
const Role_1 = require("../entity/authentication/Role");
const User_1 = require("../entity/authentication/User");
const dbcontext_1 = require("../dbcontext");
const tsyringe_1 = require("tsyringe");
const fast_sha256_1 = __importDefault(require("fast-sha256"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
const { BAD_REQUEST, CREATED, OK, CONFLICT, NOT_FOUND, FORBIDDEN } = http_status_codes_1.default;
let UserController = class UserController extends BaseController_1.BaseController {
    constructor(dbcontext) {
        super();
        this.routeHttpMethod = {
            "register": "POST",
            "isEmailUsed": "GET",
            "isUserExists": "GET",
            "sendVerifyEmail": "GET",
            "verify": "GET",
            "resetPassword": "POST",
            "sendPasswordResetEmail": "GET",
            "verifyPasswordResetEmail": "GET"
        };
        this.register = async (req, res) => {
            const params_set = Object.assign({}, req.body);
            try {
                const user_repository = this.dbcontext.connection.getRepository(User_1.User);
                const role_repository = this.dbcontext.connection.getRepository(Role_1.Role);
                const user = new User_1.User();
                user.username = params_set.username;
                user.password = tweetnacl_util_1.default.encodeBase64(fast_sha256_1.default(params_set.password));
                user.roles = await role_repository.findByIds(params_set.roleId);
                user.email = params_set.email;
                user.phoneNumber = params_set.phoneNumber;
                user.mailConfirmationToken = util_1.generateVerificationToken(128);
                await user_repository.save(user);
                return res.status(OK).json({
                    "status": "success"
                });
            }
            catch (_a) {
                return res.status(BAD_REQUEST).json({
                    "status": "fail"
                });
            }
        };
        this.isEmailUsed = async (req, res) => {
            const params_set = Object.assign({}, req.query);
            const user_repository = this.dbcontext.connection.getRepository(User_1.User);
            const user = await user_repository.findOne({ email: params_set.email });
            if (user != undefined) {
                return res.status(OK).json({
                    "status": "email has been used!"
                });
            }
            return res.status(NOT_FOUND).json({
                "status": "email hasn't been used!"
            });
        };
        this.isUserExists = async (req, res) => {
            const params_set = Object.assign({}, req.query);
            const user_repository = this.dbcontext.connection.getRepository(User_1.User);
            const user = await user_repository.findOne({ username: params_set.username });
            if (user != undefined) {
                return res.status(OK).json({
                    "status": "user exists!"
                });
            }
            return res.status(NOT_FOUND).json({
                "status": "user doesn't exists!"
            });
        };
        this.sendVerifyEmail = async (req, res) => {
            const params_set = Object.assign({}, req.query);
            const user_repository = this.dbcontext.connection.getRepository(User_1.User);
            const user = await user_repository.findOne({ username: params_set.username });
            if (user != undefined) {
                util_1.sendVerifcationEmail(user.email, user.username, user.mailConfirmationToken);
                return res.status(OK).json({
                    "status": "verification email sent"
                });
            }
            else {
                return res.status(NOT_FOUND).json({
                    "status": "can't find this user"
                });
            }
        };
        this.verify = async (req, res) => {
            const params_set = Object.assign({}, req.query);
            const user_repository = this.dbcontext.connection.getRepository(User_1.User);
            const user = await user_repository.findOne({ username: params_set.username });
            if (user == undefined) {
                return res.status(NOT_FOUND).json({
                    "status": "can't find this user"
                });
            }
            if (user.mailConfirmationToken == params_set.verificationToken) {
                user.isActive = true;
                await user_repository.save(user);
                return res.redirect(process.env.FRONTEND_DOMAIN);
            }
            return res.status(BAD_REQUEST).json({
                "status": "wrong verificationToken"
            });
        };
        this.resetPassword = async (req, res) => {
            const params_set = Object.assign({}, req.body);
            const user_repository = this.dbcontext.connection.getRepository(User_1.User);
            const user = await user_repository.createQueryBuilder("user")
                .where("user.email = :email", { email: params_set.email })
                .getOne();
            if (user == undefined) {
                return res.status(NOT_FOUND).json({
                    "status": "can't find this user"
                });
            }
            if (user.password !== tweetnacl_util_1.default.encodeBase64(fast_sha256_1.default(params_set.originalPassword))) {
                return res.status(FORBIDDEN).json({
                    "status": "original password wrong"
                });
            }
            else {
                user.password = tweetnacl_util_1.default.encodeBase64(fast_sha256_1.default(params_set.newPassword));
                await user_repository.save(user);
                return res.status(OK).json({
                    "status": "password changed successfully"
                });
            }
        };
        this.sendPasswordResetEmail = async (req, res) => {
            const params_set = Object.assign({}, req.query);
            const user_repository = this.dbcontext.connection.getRepository(User_1.User);
            const user = await user_repository.findOne({ email: params_set.email });
            if (user === undefined) {
                return res.status(NOT_FOUND).json({
                    "status": "user not found!"
                });
            }
            if ((user === null || user === void 0 ? void 0 : user.isActive) === false) {
                return res.status(FORBIDDEN).json({
                    "status": "please verify the email!"
                });
            }
            // 更新信箱token
            user.mailConfirmationToken = util_1.generateVerificationToken(128);
            // 重設暫時密碼
            const tempPassword = Math.random().toString(36).slice(-8);
            const encoded_once = tweetnacl_util_1.default.encodeBase64(fast_sha256_1.default(tempPassword));
            const encoded_twice = tweetnacl_util_1.default.encodeBase64(fast_sha256_1.default(encoded_once));
            user.password = encoded_twice;
            await user_repository.save(user);
            // 發信
            util_1.sendPasswordResetEmail(user.email, user.mailConfirmationToken, tempPassword);
            return res.status(OK).json({
                "status": "password reset email sent"
            });
        };
        this.verifyPasswordResetEmail = async (req, res) => {
            const params_set = Object.assign({}, req.query);
            const user_repository = this.dbcontext.connection.getRepository(User_1.User);
            const user = await user_repository.findOne({ email: params_set.email });
            if (user === undefined) {
                return res.status(NOT_FOUND).json({
                    "status": "user not found!"
                });
            }
            if (user.mailConfirmationToken === params_set.verificationToken) {
                let passwordResetURL = process.env.FRONTEND_DOMAIN + '#/passwordreset';
                return res.redirect(passwordResetURL);
            }
            return res.status(FORBIDDEN).json({
                "status": "Wrong verification token!"
            });
        };
        this.dbcontext = dbcontext;
        this.dbcontext.connect();
    }
};
UserController = __decorate([
    tsyringe_1.autoInjectable(),
    __metadata("design:paramtypes", [dbcontext_1.WebApiContext])
], UserController);
exports.default = UserController;
