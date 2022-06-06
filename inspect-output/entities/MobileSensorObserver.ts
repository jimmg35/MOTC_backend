import { Column, Entity, Index } from "typeorm";

@Index("PK_Mobile_Sensor_Observer", ["deviceName"], { unique: true })
@Entity("Mobile_Sensor_Observer", { schema: "public" })
export class MobileSensorObserver {
  @Column("text", { primary: true, name: "Device_Name" })
  deviceName: string;

  @Column("timestamp without time zone", { name: "Datetime" })
  datetime: Date;

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

  @Column("geography", { name: "coordinate", nullable: true })
  coordinate: string | null;
}
