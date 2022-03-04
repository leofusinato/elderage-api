import {MigrationInterface, QueryRunner} from "typeorm";

export class RelationAgedUser1646355000868 implements MigrationInterface {
    name = 'RelationAgedUser1646355000868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_ageds_ageds" ("usersId" uuid NOT NULL, "agedsId" uuid NOT NULL, CONSTRAINT "PK_d28e49bb7b416e6d8f80ea85698" PRIMARY KEY ("usersId", "agedsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e856c9a758219f6210a2da2268" ON "users_ageds_ageds" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_096c80c322c52908915f6f837a" ON "users_ageds_ageds" ("agedsId") `);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users_ageds_ageds" ADD CONSTRAINT "FK_e856c9a758219f6210a2da2268c" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_ageds_ageds" ADD CONSTRAINT "FK_096c80c322c52908915f6f837a9" FOREIGN KEY ("agedsId") REFERENCES "ageds"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_ageds_ageds" DROP CONSTRAINT "FK_096c80c322c52908915f6f837a9"`);
        await queryRunner.query(`ALTER TABLE "users_ageds_ageds" DROP CONSTRAINT "FK_e856c9a758219f6210a2da2268c"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_096c80c322c52908915f6f837a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e856c9a758219f6210a2da2268"`);
        await queryRunner.query(`DROP TABLE "users_ageds_ageds"`);
    }

}
