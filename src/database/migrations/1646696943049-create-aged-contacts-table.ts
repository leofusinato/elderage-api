import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createAgedContactsTable1646696943049
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: "aged_contacts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "aged_id",
            type: "uuid",
          },
          {
            name: "type",
            type: "smallint",
            isPrimary: true,
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "fk_aged_contact",
            columnNames: ["aged_id"],
            referencedTableName: "ageds",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("aged_contacts");
    await queryRunner.query('DROP EXTENSION "uuid-ossp"');
  }
}
