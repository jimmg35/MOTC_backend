import { Column, Entity } from "typeorm";

@Entity("fixed_sensor_buffer", { schema: "public" })
export class FixedSensorBuffer {
  @Column("text", { name: "Device_Id", nullable: true })
  deviceId: string | null;

  @Column("geography", { name: "st_buffer", nullable: true })
  stBuffer: string | null;
}
