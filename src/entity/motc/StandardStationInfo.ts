import { Column, Entity, Index } from "typeorm";


@Entity("StandardStationInfo", { schema: "public" })
export class StandardStationInfo {
  @Column("text", { primary: true, name: "deviceId" })
  deviceId: string;

  @Column("geography", { name: "coordinate", nullable: true })
  coordinate: string | null;
}
