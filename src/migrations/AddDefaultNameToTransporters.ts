import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultNameToTransporters {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add a default value to the 'name' column
    await queryRunner.query(`ALTER TABLE "transporters" ALTER COLUMN "name" SET DEFAULT 'Unknown Transporter';`);

    // Backfill existing rows with the default value
    await queryRunner.query(`UPDATE "transporters" SET "name" = 'Unknown Transporter' WHERE "name" IS NULL;`);

    // Remove the default value after backfilling if not needed
    await queryRunner.query(`ALTER TABLE "transporters" ALTER COLUMN "name" DROP DEFAULT;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert the changes by dropping the 'name' column
    await queryRunner.query(`ALTER TABLE "transporters" DROP COLUMN "name";`);
  }
}
