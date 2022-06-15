
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
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM 
          (
            SELECT
              frt."deviceId",
              frt."updateTime",
              frt."pm25Value",
              frt."vocValue",
              frt.coordinate
            FROM 
              "FixedRealTime" frt
            WHERE 
              ST_MakeEnvelope (
                {0}, {1}, 
                {2}, {3}, 4326
              ) && frt.coordinate
          ) AS frt
      `
    }
  }
}
