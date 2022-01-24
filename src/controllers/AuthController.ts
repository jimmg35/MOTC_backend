import { generateVerificationToken, sendVerifcationEmail } from "./util"
import { BaseController, HTTPMETHOD } from "./BaseController"
import { Role } from "../entity/authentication/Role"
import { User } from "../entity/authentication/User"
import { WebApiContext } from "../dbcontext"
import { Request, Response } from 'express'
import { autoInjectable } from "tsyringe"
import sha256, { Hash, HMAC } from "fast-sha256"
import StatusCodes from 'http-status-codes'
import util from "tweetnacl-util"
import jwt from 'jsonwebtoken'
import JwtAuthenticator from "../lib/JwtAuthenticator"

const { BAD_REQUEST, CREATED, OK, CONFLICT, NOT_FOUND, FORBIDDEN, UNAUTHORIZED } = StatusCodes

@autoInjectable()
export default class AuthController extends BaseController {


    public dbcontext: WebApiContext
    public jwtAuthenticator: JwtAuthenticator
    public routeHttpMethod: { [methodName: string]: HTTPMETHOD; } = {
        "authenticate": "POST",
        "refresh": "POST",
        "validate": "POST"
    }

    constructor(dbcontext: WebApiContext, jwtAuthenticator: JwtAuthenticator) {
        super()
        this.dbcontext = dbcontext
        this.dbcontext.connect()
        this.jwtAuthenticator = jwtAuthenticator
    }

    public authenticate = async (req: Request, res: Response) => {
        const params_set = { ...req.body }

        const user_repository = this.dbcontext.connection.getRepository(User)
        const user = await user_repository.findOne({ username: params_set.username as string })

        if (user?.password == util.encodeBase64(sha256(params_set.password))) {

            const token = this.jwtAuthenticator.signToken({
                _userId: user.userId,
                username: user.username
            })

            return res.status(OK).json({
                "token": token
            })
        }

        return res.status(UNAUTHORIZED).json({
            "status": "login failed"
        })
    }

    public refresh = async (req: Request, res: Response) => {
        const params_set = { ...req.body }



        // if(this.jwtAuthenticator.isTokenExpired(params_set.token)


        return res.status(OK).json({
            "status": "success"
        })

    }

    public validate = async (req: Request, res: Response) => {
        const params_set = { ...req.body }
        const status = this.jwtAuthenticator.isTokenValid(params_set.token)
        if (status) {
            return res.status(OK).json({
                "status": "token is valid"
            })
        }
        return res.status(UNAUTHORIZED).json({
            "status": "token is not valid"
        })
    }
}
