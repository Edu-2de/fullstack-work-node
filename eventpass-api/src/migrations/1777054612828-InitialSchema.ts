import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1777054612828 implements MigrationInterface {
    name = 'InitialSchema1777054612828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('organizer', 'customer', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password_encrypted" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."events_status_enum" AS ENUM('published', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "location" character varying NOT NULL, "total_capacity" integer NOT NULL, "available_capacity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "banner_url" character varying, "status" "public"."events_status_enum" NOT NULL DEFAULT 'published', "deleted_at" TIMESTAMP, "organizerId" uuid, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tickets_status_enum" AS ENUM('valid', 'cancelled', 'used')`);
        await queryRunner.query(`CREATE TABLE "tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "purchase_date" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."tickets_status_enum" NOT NULL DEFAULT 'valid', "used_at" TIMESTAMP, "eventsId" uuid, "customerId" uuid, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events_categories_categories" ("eventsId" uuid NOT NULL, "categoriesId" uuid NOT NULL, CONSTRAINT "PK_cbafb88d0a713682a8354e21124" PRIMARY KEY ("eventsId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ec1afd5bf48b617b478e86ea6" ON "events_categories_categories" ("eventsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_91500cdda8bef78e27a5fc795f" ON "events_categories_categories" ("categoriesId") `);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_1024d476207981d1c72232cf3ca" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_4462a3179707a5f49256bd771ec" FOREIGN KEY ("eventsId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_7a1f978a1c1a6b2b1133014b4b2" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events_categories_categories" ADD CONSTRAINT "FK_8ec1afd5bf48b617b478e86ea60" FOREIGN KEY ("eventsId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "events_categories_categories" ADD CONSTRAINT "FK_91500cdda8bef78e27a5fc795f8" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events_categories_categories" DROP CONSTRAINT "FK_91500cdda8bef78e27a5fc795f8"`);
        await queryRunner.query(`ALTER TABLE "events_categories_categories" DROP CONSTRAINT "FK_8ec1afd5bf48b617b478e86ea60"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_7a1f978a1c1a6b2b1133014b4b2"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_4462a3179707a5f49256bd771ec"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_1024d476207981d1c72232cf3ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91500cdda8bef78e27a5fc795f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ec1afd5bf48b617b478e86ea6"`);
        await queryRunner.query(`DROP TABLE "events_categories_categories"`);
        await queryRunner.query(`DROP TABLE "tickets"`);
        await queryRunner.query(`DROP TYPE "public"."tickets_status_enum"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
