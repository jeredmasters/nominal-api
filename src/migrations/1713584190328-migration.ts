import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1713584190328 implements MigrationInterface {
    name = 'Migration1713584190328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "organisationa" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL,
                "label" character varying NOT NULL,
                "logo_sm_url" character varying,
                "logo_lg_url" character varying,
                CONSTRAINT "PK_ffc2b3884ea1d071db29591fced" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "voters" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL,
                "organisation_id" uuid NOT NULL,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                CONSTRAINT "PK_a58842a42a7c48bc3efebb0a305" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "email_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL,
                "voter_id" uuid NOT NULL,
                "election_id" uuid,
                "action" character varying NOT NULL,
                "status" character varying NOT NULL,
                "expirest_at" TIMESTAMP,
                CONSTRAINT "PK_08abb3fa348e894c274a6730d35" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "elections" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL,
                "organisation_id" uuid NOT NULL,
                "label" character varying NOT NULL,
                "type" character varying NOT NULL,
                CONSTRAINT "PK_21abca6e4191b830d1eb8379cf0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "candidates" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL,
                "election_id" uuid NOT NULL,
                "label" character varying NOT NULL,
                "description" character varying,
                "learn_more_url" character varying,
                "image_sm_url" character varying,
                "image_lg_url" character varying,
                CONSTRAINT "PK_140681296bf033ab1eb95288abb" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "api_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL,
                "voter_id" uuid NOT NULL,
                "email_token_id" uuid,
                "public_key" character varying NOT NULL,
                "secret_key" character varying NOT NULL,
                "client_ip" character varying,
                "client_user_agent" character varying,
                CONSTRAINT "PK_c587455266b5fa8dace7194caac" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "enrollments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL,
                "voter_id" uuid NOT NULL,
                "election_id" uuid NOT NULL,
                CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "responses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL,
                "voter_id" uuid NOT NULL,
                "election_id" uuid NOT NULL,
                "response" character varying NOT NULL,
                CONSTRAINT "PK_be3bdac59bd243dff421ad7bf70" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "voters"
            ADD CONSTRAINT "FK_ebdfb9e41a142b1079e60aed63e" FOREIGN KEY ("organisation_id") REFERENCES "organisationa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "email_tokens"
            ADD CONSTRAINT "FK_a3b56799b7ef679570284e42141" FOREIGN KEY ("voter_id") REFERENCES "voters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "email_tokens"
            ADD CONSTRAINT "FK_b3cf82eb33e2609bb6d7fc841ad" FOREIGN KEY ("election_id") REFERENCES "voters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "elections"
            ADD CONSTRAINT "FK_249f6055bf7a67a17e6f6ec6f59" FOREIGN KEY ("organisation_id") REFERENCES "organisationa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "candidates"
            ADD CONSTRAINT "FK_32673ff5618c85a5ac2620e7cd0" FOREIGN KEY ("election_id") REFERENCES "elections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "api_tokens"
            ADD CONSTRAINT "FK_6af3ee8752108c46ae45595b87f" FOREIGN KEY ("voter_id") REFERENCES "voters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "api_tokens"
            ADD CONSTRAINT "FK_eeafd62ad8383ab03d1334a9f38" FOREIGN KEY ("email_token_id") REFERENCES "email_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ADD CONSTRAINT "FK_89e2e5fc32a55d573e283f95603" FOREIGN KEY ("voter_id") REFERENCES "voters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ADD CONSTRAINT "FK_45cda901030a6cb8a0233558874" FOREIGN KEY ("election_id") REFERENCES "elections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "responses"
            ADD CONSTRAINT "FK_afc3c24ffadd97da21107abf2f5" FOREIGN KEY ("voter_id") REFERENCES "organisationa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "responses"
            ADD CONSTRAINT "FK_96b0c2088c452b397d991e8e3bb" FOREIGN KEY ("election_id") REFERENCES "organisationa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "responses" DROP CONSTRAINT "FK_96b0c2088c452b397d991e8e3bb"
        `);
        await queryRunner.query(`
            ALTER TABLE "responses" DROP CONSTRAINT "FK_afc3c24ffadd97da21107abf2f5"
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments" DROP CONSTRAINT "FK_45cda901030a6cb8a0233558874"
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments" DROP CONSTRAINT "FK_89e2e5fc32a55d573e283f95603"
        `);
        await queryRunner.query(`
            ALTER TABLE "api_tokens" DROP CONSTRAINT "FK_eeafd62ad8383ab03d1334a9f38"
        `);
        await queryRunner.query(`
            ALTER TABLE "api_tokens" DROP CONSTRAINT "FK_6af3ee8752108c46ae45595b87f"
        `);
        await queryRunner.query(`
            ALTER TABLE "candidates" DROP CONSTRAINT "FK_32673ff5618c85a5ac2620e7cd0"
        `);
        await queryRunner.query(`
            ALTER TABLE "elections" DROP CONSTRAINT "FK_249f6055bf7a67a17e6f6ec6f59"
        `);
        await queryRunner.query(`
            ALTER TABLE "email_tokens" DROP CONSTRAINT "FK_b3cf82eb33e2609bb6d7fc841ad"
        `);
        await queryRunner.query(`
            ALTER TABLE "email_tokens" DROP CONSTRAINT "FK_a3b56799b7ef679570284e42141"
        `);
        await queryRunner.query(`
            ALTER TABLE "voters" DROP CONSTRAINT "FK_ebdfb9e41a142b1079e60aed63e"
        `);
        await queryRunner.query(`
            DROP TABLE "responses"
        `);
        await queryRunner.query(`
            DROP TABLE "enrollments"
        `);
        await queryRunner.query(`
            DROP TABLE "api_tokens"
        `);
        await queryRunner.query(`
            DROP TABLE "candidates"
        `);
        await queryRunner.query(`
            DROP TABLE "elections"
        `);
        await queryRunner.query(`
            DROP TABLE "email_tokens"
        `);
        await queryRunner.query(`
            DROP TABLE "voters"
        `);
        await queryRunner.query(`
            DROP TABLE "organisationa"
        `);
    }

}
