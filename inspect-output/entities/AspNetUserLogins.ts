import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AspNetUsers } from "./AspNetUsers";

@Index("PK_AspNetUserLogins", ["loginProvider", "providerKey"], {
  unique: true,
})
@Index("IX_AspNetUserLogins_UserId", ["userId"], {})
@Entity("AspNetUserLogins", { schema: "public" })
export class AspNetUserLogins {
  @Column("text", { primary: true, name: "LoginProvider" })
  loginProvider: string;

  @Column("text", { primary: true, name: "ProviderKey" })
  providerKey: string;

  @Column("text", { name: "ProviderDisplayName", nullable: true })
  providerDisplayName: string | null;

  @Column("text", { name: "UserId" })
  userId: string;

  @ManyToOne(() => AspNetUsers, (aspNetUsers) => aspNetUsers.aspNetUserLogins, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "UserId", referencedColumnName: "id" }])
  user: AspNetUsers;
}
