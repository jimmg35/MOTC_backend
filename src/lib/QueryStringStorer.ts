
interface IStringMap {
  [key: string]: string
}

interface IFixedSensorStringMap extends IStringMap {
  getRealTimeFixed: string, 
  getQueryWithContinueExtent: string
}

interface IMobileSensorStringMap extends IStringMap {
  getRealTimeMobile: string
}


export default class QueryStringStorer {
  public fixedSensor: IFixedSensorStringMap
  public mobileSensor: IMobileSensorStringMap
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
      `,
      getQueryWithContinueExtent:`
      SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM 
          (
            SELECT k."deviceId",
 	            AVG(k."pm25Value") as pm25Value,
 	            AVG(k."vocValue") as vocVaue,
 	            AVG(k."temperature") as temperature,
 	            AVG(k."humidity") as humidty,
 	            k."coordinate" as coordiate
	          FROM(
              SELECT  t."deviceId",
                      t."updateTime",
                      t."pm25Value",
                      t."vocValue",
			                t."temperature",
			                t."humidity",
                      t."coordinate"
              FROM 
                "FixedHistory" t
              WHERE 
			          t."updateTime" between '{0} {1}' AND '{2} {3}'
			        AND
                ST_MakeEnvelope (
                  {4}, 4326
                ) && t."coordinate" :: geometry) k
 			      group by k."deviceId", k."coordinate")as frt
      `
    }
    this.mobileSensor = {
      getRealTimeMobile: `
        SELECT
          json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(ST_AsGeoJSON(mrt.*)::json)
          )
        FROM 
          (
            SELECT
              mrt."deviceId",
              mrt."updateTime",
              mrt."pm25UartValue",
              mrt."vocValue",
              mrt.coordinate
            FROM 
              "MobileRealTime" mrt
          ) AS mrt
      `
    }
  }
}
