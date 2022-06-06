import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AspNetRoles } from "./AspNetRoles";

@Index("PK_AspNetRoleClaims", ["id"], { unique: true })
@Index("IX_AspNetRoleClaims_RoleId", ["roleId"], {})
@Entity("AspNetRoleClaims", { schema: "public" })
export class AspNetRoleClaims {
  @PrimaryGeneratedColumn({ type: "integer", name: "Id" })
  id: number;

  @Column("text", { name: "RoleId" })
  roleId: string;

  @Column("text", { name: "ClaimType", nullable: true })
  claimType: string | null;

  @Column("text", { name: "ClaimValue", nullable: true })
  claimValue: string | null;

  @ManyToOne(() => AspNetRoles, (aspNetRoles) => aspNetRoles.aspNetRoleClaims, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "RoleId", referencedColumnName: "id" }])
  role: AspNetRoles;
}
