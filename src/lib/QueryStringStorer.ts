
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
      //連續時間 無選星期 無去除日期
      getQueryWithContinueExtent:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
      `,
      //連續時間  無選星期 去除日期
      getQueryWithContinueExtentRmdates:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
		        AND t."updateTime":: date not in ({4})
			      AND
                ST_MakeEnvelope (
                {5}, 4326
                ) && t."coordinate" :: geometry) k
 			      group by k."deviceId", k."coordinate")as frt
      `,
      //連續時間 有選星期 無去除日期
      getQueryWithContinueExtentWeekdays:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
				    AND EXTRACT(DOW FROM t."updateTime") in ({4})
			      AND
                ST_MakeEnvelope (
                {5}, 4326
                ) && t."coordinate" :: geometry) k
 			      group by k."deviceId", k."coordinate")as frt
      `,
      //連續時間 有選星期 去除日期
      getQueryWithContinueExtentWeekdaysAndRmdates:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
				    AND EXTRACT(DOW FROM t."updateTime") in ({4})
            AND t."updateTime":: date not in ({5})
			      AND
                ST_MakeEnvelope (
                {6}, 4326
                ) && t."coordinate" :: geometry) k
 			      group by k."deviceId", k."coordinate")as frt
      `,
      //時段篩選 無跨日 無選星期 無去除日期
      getQueryWithTimeIntervalExtentNopassDay:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
                t."updateTime"::time BETWEEN '{0}' AND '{1}'
			        AND  t."updateTime" between '{2} {3}' AND '{4} {5}'
			        AND
                ST_MakeEnvelope (
                  {6}, 4326
                ) && t."coordinate" :: geometry) k
 			      group by k."deviceId", k."coordinate")as frt
      `,
      //時段篩選 無跨日 無選星期 去除日期
      getQueryWithTimeIntervalExtentNopassDayRmdates:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
                t."updateTime"::time BETWEEN '{0}' AND '{1}'
			        AND  t."updateTime" between '{2} {3}' AND '{4} {5}'
              AND t."updateTime":: date not in ({6}) 
			        AND
                ST_MakeEnvelope (
                  {7}, 4326
                ) && t."coordinate" :: geometry) k
 			      group by k."deviceId", k."coordinate")as frt
      `,
      //時段篩選 無跨日 有選星期 無去除日期
      getQueryWithTimeIntervalExtentNopassDayWeekdays:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
                t."updateTime"::time BETWEEN '{0}' AND '{1}'
			        AND  t."updateTime" between '{2} {3}' AND '{4} {5}'
              AND EXTRACT(DOW FROM t."updateTime") in ({6})
			        AND
                ST_MakeEnvelope (
                  {7}, 4326
                ) && t."coordinate" :: geometry) k
 			      group by k."deviceId", k."coordinate")as frt
      `,
      //時段篩選 無跨日 有選星期 去除日期
      getQueryWithTimeIntervalExtentNopassDayWeekdaysRmdates:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
                t."updateTime"::time BETWEEN '{0}' AND '{1}'
			        AND  t."updateTime" between '{2} {3}' AND '{4} {5}'
              AND EXTRACT(DOW FROM t."updateTime") in ({6})
              AND t."updateTime":: date not in ({7}) 
			        AND
                ST_MakeEnvelope (
                  {8}, 4326
                ) && t."coordinate" :: geometry) k
 			      group by k."deviceId", k."coordinate")as frt
      `,
      //時段篩選 有跨日 無選星期 無去除日期
      getQueryWithTimeIntervalExtentPassDay:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
                (t."updateTime"::time >= '{0}' OR t."updateTime"::time <= '{1}')
			        AND  t."updateTime" between '{2} {3}' AND '{4} {5}'
			        AND
                ST_MakeEnvelope (
                  {6}, 4326
                ) && t."coordinate" :: geometry) k
 			      group by k."deviceId", k."coordinate")as frt
      `,
      //時段篩選 有跨日 無選日期 去除日期
      getQueryWithTimeIntervalExtentPassDayRmdates:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
                (t."updateTime"::time >= '{0}' OR t."updateTime"::time <= '{1}')
			        AND  t."updateTime" between '{2} {3}' AND '{4} {5}'
              AND t."updateTime":: date not in ({6}) 
			        AND
                ST_MakeEnvelope (
                  {7}, 4326
                ) && t."coordinate" :: geometry) k
 			      group by k."deviceId", k."coordinate")as frt
      `,
      //時段篩選 有跨日 有選星期 無去除日期
      getQueryWithTimeIntervalExtentPassDayWeekdays:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
                (t."updateTime"::time >= '{0}' OR t."updateTime"::time <= '{1}')
			        AND  t."updateTime" between '{2} {3}' AND '{4} {5}'
              AND EXTRACT(DOW FROM t."updateTime") in ({6})
			        AND
                ST_MakeEnvelope (
                  {7}, 4326
                ) && t."coordinate" :: geometry) k
 			      group by k."deviceId", k."coordinate")as frt
      `,
      //時段篩選 有跨日 有選星期 去除日期
      getQueryWithTimeIntervalExtentPassDayWeekdaysRmdates:`
        SELECT
          json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(ST_AsGeoJSON(frt.*)::json)
          )
        FROM(
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
                (t."updateTime"::time >= '{0}' OR t."updateTime"::time <= '{1}')
			        AND  t."updateTime" between '{2} {3}' AND '{4} {5}'
              AND EXTRACT(DOW FROM t."updateTime") in ({6})
              AND t."updateTime":: date not in ({7})
			        AND
                ST_MakeEnvelope (
                  {8}, 4326
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
