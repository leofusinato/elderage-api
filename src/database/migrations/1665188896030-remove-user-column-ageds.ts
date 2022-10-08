import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class removeUserColumnAgeds1665188896030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ageds', 'user_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'ageds',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
      })
    );
    await queryRunner.createForeignKey(
      'ageds',
      new TableForeignKey({
        name: 'fk_aged_user_creator',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      })
    );
  }
}
