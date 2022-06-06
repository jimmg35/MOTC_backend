import { Column, Entity, Index } from "typeorm";

@Index("PK_Fixed_Sensor_Info", ["deviceId"], { unique: true })
@Index("fixed_geom_idx", ["coordinate"], {})
@Entity("Fixed_Sensor_Info", { schema: "public" })
export class FixedSensorInfo {
  @Column("text", { primary: true, name: "Device_Id" })
  deviceId: string;

  @Column("text", { name: "Device_Name", nullable: true })
  deviceName: string | null;

  @Column("text", { name: "Project_Key", nullable: true })
  projectKey: string | null;

  @Column("geography", { name: "coordinate", nullable: true })
  coordinate: string | null;
}
