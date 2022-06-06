import { Column, Entity } from "typeorm";

@Entity("standard_station_buffer", { schema: "public" })
export class StandardStationBuffer {
  @Column("text", { name: "Station_Id", nullable: true })
  stationId: string | null;

  @Column("geography", { name: "st_buffer", nullable: true })
  stBuffer: string | null;
}
