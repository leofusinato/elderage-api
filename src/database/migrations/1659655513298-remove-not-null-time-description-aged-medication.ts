import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeNotNullTimeDescriptionAgedMedication1659655513298
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "aged_medication" ALTER COLUMN time_description DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "aged_medication" ALTER COLUMN time_description SET NOT NULL`
    );
  }
}
