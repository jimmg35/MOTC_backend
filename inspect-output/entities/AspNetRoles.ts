import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { AspNetRoleClaims } from "./AspNetRoleClaims";
import { AspNetUsers } from "./AspNetUsers";

@Index("PK_AspNetRoles", ["id"], { unique: true })
@Index("RoleNameIndex", ["normalizedName"], { unique: true })
@Entity("AspNetRoles", { schema: "public" })
export class AspNetRoles {
  @Column("text", { primary: true, name: "Id" })
  id: string;

  @Column("character varying", { name: "Name", nullable: true, length: 256 })
  name: string | null;

  @Column("character varying", {
    name: "NormalizedName",
    nullable: true,
    length: 256,
  })
  normalizedName: string | null;

  @Column("text", { name: "ConcurrencyStamp", nullable: true })
  concurrencyStamp: string | null;

  @OneToMany(
    () => AspNetRoleClaims,
    (aspNetRoleClaims) => aspNetRoleClaims.role
  )
  aspNetRoleClaims: AspNetRoleClaims[];

  @ManyToMany(() => AspNetUsers, (aspNetUsers) => aspNetUsers.aspNetRoles)
  @JoinTable({
    name: "AspNetUserRoles",
    joinColumns: [{ name: "RoleId", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "UserId", referencedColumnName: "id" }],
    schema: "public",
  })
  aspNetUsers: AspNetUsers[];
}
