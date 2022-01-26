import { generateVerificationToken, sendVerifcationEmail, sendPasswordResetEmail } from "./util"
import { BaseController, HTTPMETHOD } from './BaseController'
import { Role } from "../entity/authentication/Role"
import { User } from "../entity/authentication/User"
import { WebApiContext } from "../dbcontext"
import { Request, Response } from 'express'
import { autoInjectable } from "tsyringe"
import sha256, { Hash, HMAC } from "fast-sha256"
import StatusCodes from 'http-status-codes'
import util from "tweetnacl-util"
import { NOTFOUND } from "dns"

const { BAD_REQUEST, CREATED, OK, CONFLICT, NOT_FOUND, FORBIDDEN } = StatusCodes

@autoInjectable()
export default class UserController extends BaseController {


    public dbcontext: WebApiContext
    public routeHttpMethod: { [methodName: string]: HTTPMETHOD; } = {
        "register": "POST",
        "isEmailUsed": "GET",
        "isUserExists": "GET",
        "sendVerifyEmail": "GET",
        "verify": "GET",
        "resetPassword": "POST",
        "sendPasswordResetEmail": "GET",
        "verifyPasswordResetEmail": "GET"
    }

    constructor(dbcontext: WebApiContext) {
        super()
        this.dbcontext = dbcontext
        this.dbcontext.connect()
    }


    public register = async (req: Request, res: Response) => {
        const params_set = { ...req.body }

        try {
            const user_repository = this.dbcontext.connection.getRepository(User)
            const role_repository = this.dbcontext.connection.getRepository(Role)
            const user = new User()
            user.username = params_set.username
            user.password = util.encodeBase64(sha256(params_set.password))
            user.roles = await role_repository.findByIds(params_set.roleId)
            user.email = params_set.email
            user.phoneNumber = params_set.phoneNumber
            user.mailConfirmationToken = generateVerificationToken(128)

            await user_repository.save(user)

            return res.status(OK).json({
                "status": "success"
            })
        } catch {
            return res.status(BAD_REQUEST).json({
                "status": "fail"
            })
        }

    }

    public isEmailUsed = async (req: Request, res: Response) => {
        const params_set = { ...req.query }

        const user_repository = this.dbcontext.connection.getRepository(User)
        const user = await user_repository.findOne({ email: params_set.email as string })

        if (user != undefined) {
            return res.status(OK).json({
                "status": "email has been used!"
            })
        }
        return res.status(NOT_FOUND).json({
            "status": "email hasn't been used!"
        })
    }

    public isUserExists = async (req: Request, res: Response) => {
        const params_set = { ...req.query }

        const user_repository = this.dbcontext.connection.getRepository(User)
        const user = await user_repository.findOne({ username: params_set.username as string })

        if (user != undefined) {
            return res.status(OK).json({
                "status": "user exists!"
            })
        }
        return res.status(NOT_FOUND).json({
            "status": "user doesn't exists!"
        })
    }

    public sendVerifyEmail = async (req: Request, res: Response) => {
        const params_set = { ...req.query }

        const user_repository = this.dbcontext.connection.getRepository(User)
        const user = await user_repository.findOne({ username: params_set.username as string })

        if (user != undefined) {
            sendVerifcationEmail(user.email, user.username, user.mailConfirmationToken)
            return res.status(OK).json({
                "status": "verification email sent"
            })
        } else {
            return res.status(NOT_FOUND).json({
                "status": "can't find this user"
            })
        }
    }

    public verify = async (req: Request, res: Response) => {
        const params_set = { ...req.query }

        const user_repository = this.dbcontext.connection.getRepository(User)
        const user = await user_repository.findOne({ username: params_set.username as string })

        if (user == undefined) {
            return res.status(NOT_FOUND).json({
                "status": "can't find this user"
            })
        }

        if (user.mailConfirmationToken == params_set.verificationToken) {
            user.isActive = true
            await user_repository.save(user)

            return res.redirect(process.env.FRONTEND_DOMAIN as string)
        }

        return res.status(BAD_REQUEST).json({
            "status": "wrong verificationToken"
        })
    }

    public resetPassword = async (req: Request, res: Response) => {
        const params_set = { ...req.body }

        const user_repository = this.dbcontext.connection.getRepository(User)

        const user = await user_repository.createQueryBuilder("user")
            .where("user.username = :username", { username: params_set.username })
            .getOne();

        if (user == undefined) {
            return res.status(NOT_FOUND).json({
                "status": "can't find this user"
            })
        }

        if (user.password !== util.encodeBase64(sha256(params_set.originalPassword))) {
            return res.status(FORBIDDEN).json({
                "status": "original password wrong"
            })
        } else {
            user.password = util.encodeBase64(sha256(params_set.newPassword))
            user_repository.save(user)
            return res.status(OK).json({
                "status": "password changed successfully"
            })
        }


    }

    public sendPasswordResetEmail = async (req: Request, res: Response) => {
        const params_set = { ...req.query }

        const user_repository = this.dbcontext.connection.getRepository(User)
        const user = await user_repository.findOne({ email: params_set.email as string })

        if (user === undefined) {
            return res.status(NOT_FOUND).json({
                "status": "user not found!"
            })
        }

        if (user?.isActive === false) {
            return res.status(FORBIDDEN).json({
                "status": "please verify the email!"
            })
        }

        // 更新信箱token
        user.mailConfirmationToken = generateVerificationToken(128)
        await user_repository.save(user)

        // 發信
        sendPasswordResetEmail(user.email, user.mailConfirmationToken)

        return res.status(OK).json({
            "status": "password reset email sent"
        })
    }

    public verifyPasswordResetEmail = async (req: Request, res: Response) => {
        const params_set = { ...req.query }

        return res.redirect(process.env.FRONTEND_DOMAIN as string)
    }

}
