import { Column, Entity, Index } from "typeorm";

@Index("PK_Standard_Station_Observe", ["stationId"], { unique: true })
@Entity("Standard_Station_Observe", { schema: "public" })
export class StandardStationObserve {
  @Column("text", { primary: true, name: "Station_Id" })
  stationId: string;

  @Column("timestamp without time zone", { name: "Datetime" })
  datetime: Date;

  @Column("double precision", { name: "Temperature", precision: 53 })
  temperature: number;

  @Column("double precision", { name: "RelativeHumidity", precision: 53 })
  relativeHumidity: number;

  @Column("double precision", { name: "Pm2_5", precision: 53 })
  pm2_5: number;

  @Column("double precision", { name: "Pm10", precision: 53 })
  pm10: number;

  @Column("double precision", { name: "Co", precision: 53 })
  co: number;

  @Column("double precision", { name: "Co2", precision: 53 })
  co2: number;

  @Column("double precision", { name: "No", precision: 53 })
  no: number;

  @Column("double precision", { name: "No2", precision: 53 })
  no2: number;

  @Column("double precision", { name: "Nox", precision: 53 })
  nox: number;

  @Column("double precision", { name: "So2", precision: 53 })
  so2: number;

  @Column("double precision", { name: "O3", precision: 53 })
  o3: number;

  @Column("double precision", { name: "Rainfall", precision: 53 })
  rainfall: number;

  @Column("double precision", { name: "Wind_Speed", precision: 53 })
  windSpeed: number;

  @Column("double precision", { name: "Wind_Direction", precision: 53 })
  windDirection: number;

  @Column("double precision", { name: "Wind_Speed_HR", precision: 53 })
  windSpeedHr: number;
}
