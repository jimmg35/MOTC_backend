import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("tw_roads_split_staging_geom_idx", ["geom"], {})
@Index("tw_roads_split_staging_pkey", ["gid"], { unique: true })
@Entity("tw_roads_split_staging", { schema: "public" })
export class TwRoadsSplitStaging {
  @PrimaryGeneratedColumn({ type: "integer", name: "gid" })
  gid: number;

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

  @Column("bigint", { name: "roadstruct", nullable: true })
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

  @Column("bigint", { name: "width", nullable: true })
  width: string | null;

  @Column("character varying", { name: "fnode", nullable: true, length: 9 })
  fnode: string | null;

  @Column("character varying", { name: "tnode", nullable: true, length: 9 })
  tnode: string | null;

  @Column("character varying", { name: "mdate", nullable: true, length: 8 })
  mdate: string | null;

  @Column("bigint", { name: "source", nullable: true })
  source: string | null;

  @Column("bigint", { name: "definition", nullable: true })
  definition: string | null;

  @Column("character varying", { name: "dir", nullable: true, length: 1 })
  dir: string | null;

  @Column("numeric", { name: "shape_leng", nullable: true })
  shapeLeng: string | null;

  @Column("numeric", { name: "length", nullable: true })
  length: string | null;

  @Column("numeric", { name: "shape_le_1", nullable: true })
  shapeLe_1: string | null;

  @Column("bigint", { name: "orig_fid", nullable: true })
  origFid: string | null;

  @Column("bigint", { name: "orig_seq", nullable: true })
  origSeq: string | null;

  @Column("geometry", { name: "geom", nullable: true })
  geom: string | null;
}
