import { Column, Entity, Index } from "typeorm";

@Index("idx_fx_time", ["datetime"], {})
@Index("idx_fx_dn", ["deviceName"], {})
@Entity("Fixed_Sensor_History", { schema: "public" })
export class FixedSensorHistory {
  @Column("text", { name: "Device_Name", nullable: true })
  deviceName: string | null;

  @Column("timestamp without time zone", { name: "CreatedTime" })
  createdTime: Date;

  @Column("timestamp without time zone", { name: "Datetime" })
  datetime: Date;

  @Column("double precision", {
    name: "Temperature",
    nullable: true,
    precision: 53,
  })
  temperature: number | null;

  @Column("double precision", {
    name: "Humidity",
    nullable: true,
    precision: 53,
  })
  humidity: number | null;

  @Column("double precision", { name: "Pm2_5", nullable: true, precision: 53 })
  pm2_5: number | null;

  @Column("double precision", { name: "Co", nullable: true, precision: 53 })
  co: number | null;

  @Column("double precision", { name: "Voc", nullable: true, precision: 53 })
  voc: number | null;

  @Column("double precision", { name: "So2", nullable: true, precision: 53 })
  so2: number | null;

  @Column("double precision", { name: "No2", nullable: true, precision: 53 })
  no2: number | null;
}
