import { Column, Entity, Index } from "typeorm";

@Index("PK_Projects_Info", ["projectKey"], { unique: true })
@Entity("Projects_Info", { schema: "public" })
export class ProjectsInfo {
  @Column("text", { primary: true, name: "Project_Key" })
  projectKey: string;

  @Column("text", { name: "Project_Name", nullable: true })
  projectName: string | null;

  @Column("text", { name: "Project_Id", nullable: true })
  projectId: string | null;
}
