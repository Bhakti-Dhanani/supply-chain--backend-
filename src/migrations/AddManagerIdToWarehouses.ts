import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddManagerIdToWarehouses implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Allow NULL temporarily
    await queryRunner.query(`ALTER TABLE warehouses ALTER COLUMN "managerId" DROP NOT NULL`);

    // Assign a default managerId to existing rows (replace 1 with a valid manager ID)
    await queryRunner.query(`UPDATE warehouses SET "managerId" = 1 WHERE "managerId" IS NULL`);

    // Revert to NOT NULL
    await queryRunner.query(`ALTER TABLE warehouses ALTER COLUMN "managerId" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert the changes
    await queryRunner.query(`ALTER TABLE warehouses ALTER COLUMN "managerId" DROP NOT NULL`);
  }
}