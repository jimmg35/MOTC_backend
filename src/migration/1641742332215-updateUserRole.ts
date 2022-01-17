import {MigrationInterface, QueryRunner} from "typeorm";

export class updateUserRole1641742332215 implements MigrationInterface {
    name = 'updateUserRole1641742332215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a43c1ff35a58799012c789bf4a3"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "name" TO "roleName"`);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("userUserId" uuid NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b38bd5c220511055a802bbce985" PRIMARY KEY ("userUserId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0bd606ba8531dd93b457b8486d" ON "user_roles_role" ("userUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_a43c1ff35a58799012c789bf4a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userRoleUserId"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "roleName"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "roleName" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_0bd606ba8531dd93b457b8486d9" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_0bd606ba8531dd93b457b8486d9"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "roleName"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "roleName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userRoleUserId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_a43c1ff35a58799012c789bf4a" UNIQUE ("userRoleUserId")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4be2f7adf862634f5f803d246b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0bd606ba8531dd93b457b8486d"`);
        await queryRunner.query(`DROP TABLE "user_roles_role"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "roleName" TO "name"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a43c1ff35a58799012c789bf4a3" FOREIGN KEY ("userRoleUserId") REFERENCES "user_role"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
