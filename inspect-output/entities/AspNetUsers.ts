import { Column, Entity, Index, ManyToMany, OneToMany } from "typeorm";
import { AspNetUserClaims } from "./AspNetUserClaims";
import { AspNetUserLogins } from "./AspNetUserLogins";
import { AspNetRoles } from "./AspNetRoles";
import { AspNetUserTokens } from "./AspNetUserTokens";

@Index("PK_AspNetUsers", ["id"], { unique: true })
@Index("EmailIndex", ["normalizedEmail"], {})
@Index("UserNameIndex", ["normalizedUserName"], { unique: true })
@Entity("AspNetUsers", { schema: "public" })
export class AspNetUsers {
  @Column("text", { primary: true, name: "Id" })
  id: string;

  @Column("character varying", {
    name: "UserName",
    nullable: true,
    length: 256,
  })
  userName: string | null;

  @Column("character varying", {
    name: "NormalizedUserName",
    nullable: true,
    length: 256,
  })
  normalizedUserName: string | null;

  @Column("character varying", { name: "Email", nullable: true, length: 256 })
  email: string | null;

  @Column("character varying", {
    name: "NormalizedEmail",
    nullable: true,
    length: 256,
  })
  normalizedEmail: string | null;

  @Column("boolean", { name: "EmailConfirmed" })
  emailConfirmed: boolean;

  @Column("text", { name: "PasswordHash", nullable: true })
  passwordHash: string | null;

  @Column("text", { name: "SecurityStamp", nullable: true })
  securityStamp: string | null;

  @Column("text", { name: "ConcurrencyStamp", nullable: true })
  concurrencyStamp: string | null;

  @Column("text", { name: "PhoneNumber", nullable: true })
  phoneNumber: string | null;

  @Column("boolean", { name: "PhoneNumberConfirmed" })
  phoneNumberConfirmed: boolean;

  @Column("boolean", { name: "TwoFactorEnabled" })
  twoFactorEnabled: boolean;

  @Column("timestamp with time zone", { name: "LockoutEnd", nullable: true })
  lockoutEnd: Date | null;

  @Column("boolean", { name: "LockoutEnabled" })
  lockoutEnabled: boolean;

  @Column("integer", { name: "AccessFailedCount" })
  accessFailedCount: number;

  @OneToMany(
    () => AspNetUserClaims,
    (aspNetUserClaims) => aspNetUserClaims.user
  )
  aspNetUserClaims: AspNetUserClaims[];

  @OneToMany(
    () => AspNetUserLogins,
    (aspNetUserLogins) => aspNetUserLogins.user
  )
  aspNetUserLogins: AspNetUserLogins[];

  @ManyToMany(() => AspNetRoles, (aspNetRoles) => aspNetRoles.aspNetUsers)
  aspNetRoles: AspNetRoles[];

  @OneToMany(
    () => AspNetUserTokens,
    (aspNetUserTokens) => aspNetUserTokens.user
  )
  aspNetUserTokens: AspNetUserTokens[];
}
