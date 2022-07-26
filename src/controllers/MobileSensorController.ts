import { BaseController, HTTPMETHOD } from "./BaseController"
import { WebApiContext } from "../dbcontext"
import { Request, Response } from 'express'
import { autoInjectable } from "tsyringe"
import StatusCodes from 'http-status-codes'
import QueryStringStorer from "../lib/QueryStringStorer"

const { BAD_REQUEST, CREATED, OK, CONFLICT, NOT_FOUND, FORBIDDEN, UNAUTHORIZED } = StatusCodes

@autoInjectable()
export default class MobileSensorController extends BaseController {

  public queryStringStorer: QueryStringStorer
  public dbcontext: WebApiContext
  public routeHttpMethod: { [methodName: string]: HTTPMETHOD; } = {
    "getRealTimeMobile": "GET"
  }

  constructor(dbcontext: WebApiContext, queryStringStorer: QueryStringStorer) {
    super()
    this.queryStringStorer = queryStringStorer
    this.dbcontext = dbcontext
    this.dbcontext.connect()
  }

  public getRealTimeMobile = async (req: Request, res: Response) => {
    // const props = { ...req.query } as unknown as { xmin: number, ymin: number, xmax: number, ymax: number }

    const result = await this.dbcontext.connection.query(
      this.queryStringStorer.mobileSensor.getRealTimeMobile
    )

    return res.status(OK).json(result[0]['json_build_object'])
  }

}
