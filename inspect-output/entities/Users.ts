import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Users", ["id"], { unique: true })
@Entity("Users", { schema: "public" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "Id" })
  id: number;

  @Column("text", { name: "Username", nullable: true })
  username: string | null;

  @Column("text", { name: "Password", nullable: true })
  password: string | null;

  @Column("text", { name: "Email", nullable: true })
  email: string | null;

  @Column("integer", { name: "Role" })
  role: number;
}
