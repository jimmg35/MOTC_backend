import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("tw_road_split_project_pkey", ["ogcFid"], { unique: true })
@Index("idx_road_geom", ["wkbGeometry"], {})
@Index("tw_road_split_project_wkb_geometry_geom_idx", ["wkbGeometry"], {})
@Entity("tw_road_split_project", { schema: "public" })
export class TwRoadSplitProject {
  @PrimaryGeneratedColumn({ type: "integer", name: "ogc_fid" })
  ogcFid: number;

  @Column("character varying", {
    name: "roadsegid",
    nullable: true,
    length: 11,
  })
  roadsegid: string | null;

  @Column("character varying", {
    name: "roadclass1",
    nullable: true,
    length: 2,
  })
  roadclass1: string | null;

  @Column("character varying", {
    name: "roadclass2",
    nullable: true,
    length: 8,
  })
  roadclass2: string | null;

  @Column("character varying", { name: "roadcode", nullable: true, length: 4 })
  roadcode: string | null;

  @Column("character varying", { name: "county", nullable: true, length: 8 })
  county: string | null;

  @Column("numeric", {
    name: "roadstruct",
    nullable: true,
    precision: 10,
    scale: 0,
  })
  roadstruct: string | null;

  @Column("character varying", { name: "roadnum", nullable: true, length: 8 })
  roadnum: string | null;

  @Column("character varying", { name: "roadnum1", nullable: true, length: 8 })
  roadnum1: string | null;

  @Column("character varying", { name: "roadnum2", nullable: true, length: 8 })
  roadnum2: string | null;

  @Column("character varying", { name: "roadname", nullable: true, length: 36 })
  roadname: string | null;

  @Column("character varying", {
    name: "roadalias",
    nullable: true,
    length: 36,
  })
  roadalias: string | null;

  @Column("character varying", {
    name: "roadcomnum",
    nullable: true,
    length: 1,
  })
  roadcomnum: string | null;

  @Column("character varying", {
    name: "rdnamesect",
    nullable: true,
    length: 8,
  })
  rdnamesect: string | null;

  @Column("character varying", {
    name: "britunname",
    nullable: true,
    length: 20,
  })
  britunname: string | null;

  @Column("character varying", {
    name: "rdnamelane",
    nullable: true,
    length: 20,
  })
  rdnamelane: string | null;

  @Column("character varying", {
    name: "rdnamenon",
    nullable: true,
    length: 16,
  })
  rdnamenon: string | null;

  @Column("numeric", { name: "width", nullable: true, precision: 10, scale: 0 })
  width: string | null;

  @Column("character varying", { name: "fnode", nullable: true, length: 9 })
  fnode: string | null;

  @Column("character varying", { name: "tnode", nullable: true, length: 9 })
  tnode: string | null;

  @Column("character varying", { name: "mdate", nullable: true, length: 8 })
  mdate: string | null;

  @Column("numeric", {
    name: "source",
    nullable: true,
    precision: 10,
    scale: 0,
  })
  source: string | null;

  @Column("numeric", {
    name: "definition",
    nullable: true,
    precision: 10,
    scale: 0,
  })
  definition: string | null;

  @Column("character varying", { name: "dir", nullable: true, length: 1 })
  dir: string | null;

  @Column("numeric", {
    name: "shape_leng",
    nullable: true,
    precision: 19,
    scale: 11,
  })
  shapeLeng: string | null;

  @Column("numeric", {
    name: "length",
    nullable: true,
    precision: 19,
    scale: 11,
  })
  length: string | null;

  @Column("numeric", {
    name: "shape_le_1",
    nullable: true,
    precision: 19,
    scale: 11,
  })
  shapeLe_1: string | null;

  @Column("geometry", { name: "wkb_geometry", nullable: true })
  wkbGeometry: string | null;
}
