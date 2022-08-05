import { MigrationInterface, QueryRunner } from 'typeorm';

export class createScheduleColumnCheckin1659657881678
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checkin_medications" ADD COLUMN schedule_id uuid;
        ALTER TABLE "checkin_medications" ADD CONSTRAINT fk_checkin_medication_schedule FOREIGN KEY (schedule_id)
        REFERENCES public.schedule_medication (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
      `
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "checkin_medications" DROP COLUMN schedule_id`
    );
  }
}
