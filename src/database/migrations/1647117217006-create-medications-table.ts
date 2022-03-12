import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createMedicationsTable1647117217006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'aged_medication',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'aged_id', type: 'uuid' },
          { name: 'description', type: 'varchar', isNullable: false },
          { name: 'details', type: 'varchar', isNullable: true },
          { name: 'time_type', type: 'smallint', isNullable: false },
          { name: 'time_description', type: 'smallint', isNullable: false },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'fk_aged_medication',
            columnNames: ['aged_id'],
            referencedTableName: 'ageds',
            referencedColumnNames: ['id'],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('aged_medication');
  }
}
