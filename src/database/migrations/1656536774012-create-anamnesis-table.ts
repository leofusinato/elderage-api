import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createAnamnesisTable1656536774012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'anamnesis',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'aged_id', type: 'uuid' },
          { name: 'heart_rate', type: 'smallint', isNullable: true },
          { name: 'respiratory_frequency', type: 'smallint', isNullable: true },
          { name: 'temperature', type: 'numeric', isNullable: true },
          { name: 'glucose_level', type: 'numeric', isNullable: true },
          { name: 'weight', type: 'numeric', isNullable: true },
          { name: 'observations', type: 'varchar', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('anamnesis');
  }
}
