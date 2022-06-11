import { BaseController, HTTPMETHOD } from "./BaseController"
import { Request, Response } from 'express'
import { WebApiContext } from "../dbcontext"
import { autoInjectable } from "tsyringe"
import StatusCodes from 'http-status-codes'

const { BAD_REQUEST, CREATED, OK, CONFLICT } = StatusCodes

function dataMethod () {
  console.log("wwwwww")
  return (target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<any>) => {

  }
}
@autoInjectable()
export default class HomeController extends BaseController {


  public dbcontext: WebApiContext
  public routeHttpMethod: { [methodName: string]: HTTPMETHOD; } = {
    "get": "GET",
    "post": "POST",
    "tests": "GET"
  }

  // constructor(dbcontext: WebApiContext) {
  //   super()
  //   this.dbcontext = dbcontext
  //   this.dbcontext.connect()
  // }
  constructor() {
    super()
  }

  @dataMethod()
  public tests = async (req: Request, res: Response) => {
    return res.status(OK).json({ status: 'success' })
  }

  public get = async (req: Request, res: Response) => {
    const params_set = { ...req.query }
    return res.status(OK).json({
      ...params_set
    })
  }

  public post = async (req: Request, res: Response) => {
    const params_set = { ...req.body }
    return res.status(OK).json({
      ...params_set
    })
  }

}
