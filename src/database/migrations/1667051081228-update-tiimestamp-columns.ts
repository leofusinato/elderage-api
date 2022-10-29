import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTiimestampColumns1667051081228
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE checkin_medications
        ALTER COLUMN date_hour_applied TYPE TIMESTAMP WITH TIME ZONE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE checkin_medications
        ALTER COLUMN date_hour_applied TYPE TIMESTAMP WITH TIME ZONE
    `);
  }
}
