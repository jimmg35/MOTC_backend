import { Column, Entity, Index } from "typeorm";

@Index("idx_mb_time", ["datetime"], {})
@Index("idx_mb_dn", ["deviceName"], {})
@Entity("Mobile_Sensor_History", { schema: "public" })
export class MobileSensorHistory {
  @Column("text", { name: "Device_Name", nullable: true })
  deviceName: string | null;

  @Column("timestamp without time zone", { name: "CreatedTime" })
  createdTime: Date;

  @Column("timestamp without time zone", { name: "Datetime" })
  datetime: Date;

  @Column("geography", { name: "coordinate", nullable: true })
  coordinate: string | null;

  @Column("double precision", { name: "Voc", precision: 53 })
  voc: number;

  @Column("double precision", { name: "Flow", precision: 53 })
  flow: number;

  @Column("double precision", { name: "Pm2_5_UART", precision: 53 })
  pm2_5Uart: number;

  @Column("double precision", { name: "Pm2_5_I2C", precision: 53 })
  pm2_5I2C: number;

  @Column("double precision", { name: "Temperature", precision: 53 })
  temperature: number;

  @Column("double precision", { name: "Humidity", precision: 53 })
  humidity: number;

  @Column("double precision", { name: "Speed", precision: 53 })
  speed: number;
}
