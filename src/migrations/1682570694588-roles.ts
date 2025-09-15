import { MigrationInterface, QueryRunner } from 'typeorm';

export class Roles1682570694588 implements MigrationInterface {
  name = 'Roles1682570694588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "id_role" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_f8a3754f51a266a160e71d261f8" FOREIGN KEY ("id_role") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_f8a3754f51a266a160e71d261f8"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id_role"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
