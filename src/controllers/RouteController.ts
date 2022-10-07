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
    rmdates: string
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
    let queryString: string | undefined = undefined
    // console.log(props)
    //無時段篩選
    if (props.interval_st ===''|| props.interval_et ==='' ){
        // console.log('無時段篩選')
        if(props.weekdays ===''){
          // console.log('無星期篩選')
            if(props.rmdates === ''){
              // console.log('無日期篩選')
              queryString = this.queryStringStorer.fixedSensor.getQueryWithContinueExtent.format(
                [props.startDate,props.startTime,props.endDate,props.endTime,props.extent]
                )

              // )
            }
            else if (props.rmdates !== ''){
              // console.log('有日期篩選')
               queryString = this.queryStringStorer.fixedSensor.getQueryWithContinueExtentRmdates.format(
                [props.startDate,props.startTime,props.endDate,props.endTime,props.rmdates,props.extent]
              )
            }
        }
        else if (props.weekdays !== ''){
            // console.log('有星期篩選')
            if (props.rmdates ===''){
              // console.log('無日期篩選')
              queryString = this.queryStringStorer.fixedSensor.getQueryWithContinueExtentWeekdays.format(
                [props.startDate,props.startTime,props.endDate,props.endTime,props.weekdays,props.extent]
              )

            }
            else if (props.rmdates !== ''){
              // console.log('有日期篩選')
              queryString = this.queryStringStorer.fixedSensor.getQueryWithContinueExtentWeekdaysAndRmdates.format(
                [props.startDate,props.startTime,props.endDate,props.endTime,props.weekdays,props.rmdates,props.extent]
              )
            }
        }
    }
    //有時段篩選
    else if (props.interval_st !== '' && props.interval_et !== ''){
      // console.log('有時段篩選')
        //時段篩選無跨日
        if (props.interval_st < props.interval_et){
          // console.log('無跨日')
            if(props.weekdays ===''){
              // console.log('無星期篩選')
                if(props.rmdates === ''){
                  // console.log('無日期篩選')
                  queryString = this.queryStringStorer.fixedSensor.getQueryWithTimeIntervalExtentNopassDay.format(
                    [props.interval_st,props.interval_et,props.startDate,props.startTime,props.endDate,props.endTime,props.extent]
                  )
                }
                else if (props.rmdates !== ''){
                  // console.log('有日期篩選')
                  queryString = this.queryStringStorer.fixedSensor.getQueryWithTimeIntervalExtentNopassDayRmdates.format(
                    [props.interval_st,props.interval_et,props.startDate,props.startTime,props.endDate,props.endTime,props.rmdates,props.extent]
                  )
                }
            }
            else if (props.weekdays !== ''){
              // console.log('有星期篩選')
                if (props.rmdates ===''){
                  // console.log('無日期篩選')
                  queryString = this.queryStringStorer.fixedSensor.getQueryWithTimeIntervalExtentNopassDayWeekdays.format(
                    [props.interval_st,props.interval_et,props.startDate,props.startTime,props.endDate,props.endTime,props.weekdays,props.extent]
                  )
                }
                else if (props.rmdates !== ''){
                  // console.log('有日期篩選')
                   queryString= this.queryStringStorer.fixedSensor.getQueryWithTimeIntervalExtentNopassDayWeekdaysRmdates.format(
                    [props.interval_st,props.interval_et,props.startDate,props.startTime,props.endDate,props.endTime,props.weekdays,props.rmdates,props.extent]
                   )
                }
            }

        }
        //時段篩選有跨日
        else if (props.interval_st > props.interval_et){
          console.log('有跨日')
            if(props.weekdays ===''){
              console.log('無星期篩選')
                if(props.rmdates === ''){
                  console.log('無日期篩選')
                  queryString =  this.queryStringStorer.fixedSensor.getQueryWithTimeIntervalExtentPassDay.format(
                    [props.interval_st,props.interval_et,props.startDate,props.startTime,props.endDate,props.endTime,props.extent]
                  )
                }
                else if (props.rmdates !== ''){
                  console.log('有日期篩選')
                  queryString = this.queryStringStorer.fixedSensor.getQueryWithTimeIntervalExtentPassDayRmdates.format(
                    [props.interval_st,props.interval_et,props.startDate,props.startTime,props.endDate,props.endTime,props.rmdates,props.extent]
                  )
                }
            }
            else if (props.weekdays !== ''){
              // console.log('有星期篩選')
                if (props.rmdates ===''){
                  // console.log('無日期篩選')
                  queryString = this.queryStringStorer.fixedSensor.getQueryWithTimeIntervalExtentPassDayWeekdays.format(
                    [props.interval_st,props.interval_et,props.startDate,props.startTime,props.endDate,props.endTime,props.weekdays,props.extent]
                  )
                }
                else if (props.rmdates !== ''){
                  // console.log('有日期篩選')
                  queryString = this.queryStringStorer.fixedSensor.getQueryWithTimeIntervalExtentPassDayWeekdaysRmdates.format(
                    [props.interval_st,props.interval_et,props.startDate,props.startTime,props.endDate,props.endTime,props.weekdays,props.rmdates,props.extent]
                  )
                }
            }
        }
    }

    console.log(queryString)
    if(!queryString) return  res.status(403)

    
    const result = await this.dbcontext.connection.query(queryString)
    
    return res.status(OK).json(result[0]['json_build_object'])
  }

}