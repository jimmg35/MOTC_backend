import { Column, Entity, Index } from "typeorm";

@Index("PK_Test_talbe", ["projectKey"], { unique: true })
@Entity("Test_talbe", { schema: "public" })
export class TestTalbe {
  @Column("text", { primary: true, name: "Project_Key" })
  projectKey: string;

  @Column("text", { name: "Project_Name", nullable: true })
  projectName: string | null;

  @Column("text", { name: "Project_Id", nullable: true })
  projectId: string | null;
}
