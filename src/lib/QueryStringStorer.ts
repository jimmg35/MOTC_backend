
interface IStringMap {
  [key: string]: string
}

interface IFixedSensorStringMap extends IStringMap {
  getRealTimeFixed: string
}

export default class QueryStringStorer {
  public fixedSensor: IFixedSensorStringMap

  constructor() {
    this.fixedSensor = {
      getRealTimeFixed: `
        SELECT
          rpm25."deviceId",
          rpm25."updateTime",
          rpm25.value,
          ST_X(rpm25.coordinate::geometry) as longitude,
          ST_Y(rpm25.coordinate::geometry) as latitude 
        FROM
          "RealTime_PM25" rpm25
        WHERE
          ST_MakeEnvelope (
            {0}, {1}, 
            {2}, {3}, 4326
          ) && rpm25.coordinate
      `
    }
  }
}
