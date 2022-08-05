import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createScheduleMedicationTable1659653884738
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schedule_medication',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'medication_id', type: 'uuid' },
          { name: 'time', type: 'time' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'fk_medication_schedule',
            columnNames: ['medication_id'],
            referencedTableName: 'aged_medication',
            referencedColumnNames: ['id'],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('schedule_medication');
  }
}
