import { Column, Entity, Index } from "typeorm";

@Index("PK_Road_Info", ["roadId"], { unique: true })
@Entity("Road_Info", { schema: "public" })
export class RoadInfo {
  @Column("text", { primary: true, name: "Road_Id" })
  roadId: string;

  @Column("text", { name: "Road_Name", nullable: true })
  roadName: string | null;

  @Column("double precision", { name: "Endpoint_A_Lon", precision: 53 })
  endpointALon: number;

  @Column("double precision", { name: "Endpoint_A_Lat", precision: 53 })
  endpointALat: number;

  @Column("double precision", { name: "Endpoint_B_Lon", precision: 53 })
  endpointBLon: number;

  @Column("double precision", { name: "Endpoint_B_Lat", precision: 53 })
  endpointBLat: number;

  @Column("double precision", { name: "Length", precision: 53 })
  length: number;
}
