import { Column, Entity, Index } from "typeorm";

@Index("PK_Standard_Station_Info", ["stationId"], { unique: true })
@Entity("Standard_Station_Info", { schema: "public" })
export class StandardStationInfo {
  @Column("text", { primary: true, name: "Station_Id" })
  stationId: string;

  @Column("text", { name: "Station_Name", nullable: true })
  stationName: string | null;

  @Column("geography", { name: "coordinate", nullable: true })
  coordinate: string | null;
}
