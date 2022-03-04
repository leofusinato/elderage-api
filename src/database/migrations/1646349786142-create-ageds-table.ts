import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createAgedsTable1646349786142 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'ageds',
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: 'name',
            type: "varchar",
          },
          {
            name: 'gender',
            type: "varchar",
          },
          {
            name: 'birthdate',
            type: "date",
          },
          {
            name: 'address',
            type: "varchar",
          },
          {
            name: 'city',
            type: "varchar",
          },
          {
            name: 'state',
            type: "varchar",
          },
          { 
            name: "created_at", 
            type: "timestamp", 
            default: "now()" 
          },
        ]
      }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("ageds");
    await queryRunner.query('DROP EXTENSION "uuid-ossp"');
  }
}