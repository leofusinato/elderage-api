import { query } from 'express';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addOwnerAgedUsersColumn1665189229651
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users_ageds_ageds',
      new TableColumn({
        name: 'owner',
        type: 'bool',
        isNullable: true,
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users_ageds_ageds', 'owner');
  }
}
