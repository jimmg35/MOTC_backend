import { BaseController, HTTPMETHOD } from "./BaseController"
import { WebApiContext } from "../dbcontext"
import { Request, Response } from 'express'
import { autoInjectable } from "tsyringe"
import StatusCodes from 'http-status-codes'
import QueryStringStorer from "../lib/QueryStringStorer"

const { BAD_REQUEST, CREATED, OK, CONFLICT, NOT_FOUND, FORBIDDEN, UNAUTHORIZED } = StatusCodes

@autoInjectable()
export default class FixedSensorController extends BaseController {

  public queryStringStorer: QueryStringStorer
  public dbcontext: WebApiContext
  public routeHttpMethod: { [methodName: string]: HTTPMETHOD; } = {
    "getRealTimeFixed": "GET"
  }

  constructor(dbcontext: WebApiContext, queryStringStorer: QueryStringStorer) {
    super()
    this.queryStringStorer = queryStringStorer
    this.dbcontext = dbcontext
    this.dbcontext.connect()
  }

  public getRealTimeFixed = async (req: Request, res: Response) => {
    const props = { ...req.query } as unknown as { xmin: number, ymin: number, xmax: number, ymax: number }

    const result = await this.dbcontext.connection.query(
      this.queryStringStorer.fixedSensor.getRealTimeFixed.format(
        [props.xmin, props.ymin, props.xmax, props.ymax]
      )
    )


    return res.status(OK).json(result[0]['json_build_object'])
  }

}
