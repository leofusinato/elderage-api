import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class addAgedEventsTable1656625573429 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'aged_events',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'aged_id', type: 'uuid' },
          { name: 'date', type: 'timestamp' },
          { name: 'local', type: 'varchar' },
          { name: 'description', type: 'varchar' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'fk_event_aged',
            columnNames: ['aged_id'],
            referencedTableName: 'ageds',
            referencedColumnNames: ['id'],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('anamnesis');
  }
}
