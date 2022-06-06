import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AspNetUsers } from "./AspNetUsers";

@Index("PK_AspNetUserTokens", ["loginProvider", "name", "userId"], {
  unique: true,
})
@Entity("AspNetUserTokens", { schema: "public" })
export class AspNetUserTokens {
  @Column("text", { primary: true, name: "UserId" })
  userId: string;

  @Column("text", { primary: true, name: "LoginProvider" })
  loginProvider: string;

  @Column("text", { primary: true, name: "Name" })
  name: string;

  @Column("text", { name: "Value", nullable: true })
  value: string | null;

  @ManyToOne(() => AspNetUsers, (aspNetUsers) => aspNetUsers.aspNetUserTokens, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "UserId", referencedColumnName: "id" }])
  user: AspNetUsers;
}
