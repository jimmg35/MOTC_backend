import { BaseController, HTTPMETHOD } from "./BaseController"
import { WebApiContext } from "../dbcontext"
import { Request, Response } from 'express'
import { autoInjectable } from "tsyringe"
import StatusCodes from 'http-status-codes'
import QueryStringStorer from "../lib/QueryStringStorer"

const { BAD_REQUEST, CREATED, OK, CONFLICT, NOT_FOUND, FORBIDDEN, UNAUTHORIZED } = StatusCodes

export interface IRouteQueryParams {
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    extent: string
    interval_st: string
    interval_et: string
    weekdays: string
    rmdays: string
  }

@autoInjectable()
export default class RouteController extends BaseController {

  public queryStringStorer: QueryStringStorer
  public dbcontext: WebApiContext
  public routeHttpMethod: { [methodName: string]: HTTPMETHOD; } = {
    "getFixedHistory": "GET"
  }

  constructor(dbcontext: WebApiContext, queryStringStorer: QueryStringStorer) {
    super()
    this.queryStringStorer = queryStringStorer
    this.dbcontext = dbcontext
    this.dbcontext.connect()
  }

  public getFixedHistory = async (req: Request, res: Response) => {
    const props = { ...req.query } as unknown as IRouteQueryParams
    //無時段篩選
    if (props.interval_st ==''|| props.interval_et=='' ){
        if(props.weekdays ==''){
            if(props.rmdays == ''){
              console.log(props)
              // this.queryStringStorer.fixedSensor.getQueryWithContinueExtent.format(

              // )
            }
            else if (props.rmdays != ''){

            }
        }
        else if (props.weekdays != ''){
            if (props.rmdays ==''){

            }
            else if (props.rmdays != ''){

            }
        }
    }
    //有時段篩選
    else if (props.interval_st != '' || props.interval_et != ''){
        //時段篩選無跨日
        if (props.interval_st < props.interval_et){
            if(props.weekdays ==''){
                if(props.rmdays == ''){
    
                }
                else if (props.rmdays != ''){
    
                }
            }
            else if (props.weekdays != ''){
                if (props.rmdays ==''){
    
                }
                else if (props.rmdays != ''){
    
                }
            }

        }
        //時段篩選有跨日
        else if (props.interval_st > props.interval_et){
            if(props.weekdays ==''){
                if(props.rmdays == ''){
    
                }
                else if (props.rmdays != ''){
    
                }
            }
            else if (props.weekdays != ''){
                if (props.rmdays ==''){
    
                }
                else if (props.rmdays != ''){
    
                }
            }
        }
    }
    


    // return res.status(OK).json(result[0]['json_build_object'])
  }

}