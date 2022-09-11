import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addContactNameColumn1662919557271 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'aged_contacts',
      new TableColumn({ name: 'name', type: 'varchar' })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('aged_contacts', 'name');
  }
}
