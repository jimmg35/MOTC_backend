import { Column, Entity, Index } from "typeorm";

@Index("PK_Fixed_Sensor_Observe", ["deviceName"], { unique: true })
@Entity("Fixed_Sensor_Observe", { schema: "public" })
export class FixedSensorObserve {
  @Column("text", { primary: true, name: "Device_Name" })
  deviceName: string;

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

  @Column("timestamp without time zone", {
    name: "CreatedTime",
    default: () => "'0001-01-01 00:00:00'",
  })
  createdTime: Date;

  @Column("boolean", { name: "onlineStatus", default: () => "false" })
  onlineStatus: boolean;
}
