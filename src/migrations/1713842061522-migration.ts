import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1713842061522 implements MigrationInterface {
    name = 'Migration1713842061522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "admin_users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                CONSTRAINT "PK_06744d221bb6145dc61e5dc441d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "admin_passcode" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "admin_user_id" uuid NOT NULL,
                "type" character varying NOT NULL,
                "value" character varying NOT NULL,
                CONSTRAINT "PK_6cc4a757570e4309465e2b22b75" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "organisations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "label" character varying NOT NULL,
                "logo_sm_url" character varying,
                "logo_lg_url" character varying,
                CONSTRAINT "PK_7bf54cba378d5b2f1d4c10ef4df" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "voters" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "organisation_id" uuid NOT NULL,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "email" character varying NOT NULL,
                CONSTRAINT "PK_a58842a42a7c48bc3efebb0a305" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "elections" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "organisation_id" uuid NOT NULL,
                "copy_election_id" uuid,
                "label" character varying NOT NULL,
                "type" character varying NOT NULL,
                "closes_at" TIMESTAMP NOT NULL,
                "opens_at" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_21abca6e4191b830d1eb8379cf0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "email_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "voter_id" uuid NOT NULL,
                "election_id" uuid,
                "action" character varying NOT NULL,
                "status" character varying NOT NULL,
                "expires_at" TIMESTAMP,
                CONSTRAINT "PK_08abb3fa348e894c274a6730d35" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "candidates" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "organisation_id" uuid NOT NULL,
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
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
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
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "voter_id" uuid NOT NULL,
                "election_id" uuid NOT NULL,
                CONSTRAINT "UQ_fc04d00159014da5bd2e403bd48" UNIQUE ("voter_id", "election_id"),
                CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "responses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "voter_id" uuid NOT NULL,
                "election_id" uuid NOT NULL,
                "response" character varying NOT NULL,
                CONSTRAINT "PK_be3bdac59bd243dff421ad7bf70" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "admin_permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "admin_user_id" uuid NOT NULL,
                "permission" character varying NOT NULL,
                CONSTRAINT "PK_97efc32c48511fc4061111040a0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "admin_log" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "primary" character varying NOT NULL,
                "trigger" character varying,
                "admin_user_idadmin_user_id" jsonb,
                "admin_user_id" uuid,
                "admin_permission_id" uuid,
                "voter_id" uuid,
                "election_id" uuid,
                "email_token_id" uuid,
                "candidate_id" uuid,
                "organisation_id" uuid,
                "api_token_id" uuid,
                "enrollment_id" uuid,
                "response_id" uuid,
                CONSTRAINT "PK_42b80ec4239a2d6ee856b340db9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "event_log" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "primary" character varying NOT NULL,
                "trigger" character varying,
                "meta" jsonb,
                "voter_id" uuid,
                "election_id" uuid,
                "email_token_id" uuid,
                "candidate_id" uuid,
                "organisation_id" uuid,
                "api_token_id" uuid,
                "enrollment_id" uuid,
                "response_id" uuid,
                CONSTRAINT "PK_d8ccd9b5b44828ea378dd37e691" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "admin_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "admin_user_id" uuid NOT NULL,
                "public_key" character varying NOT NULL,
                "secret_key" character varying NOT NULL,
                "client_ip" character varying,
                "client_user_agent" character varying,
                "device_meta" jsonb,
                CONSTRAINT "PK_1b8fe3dbc19bbe91baa16ab6b09" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "runnings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "candidate_id" uuid NOT NULL,
                "election_id" uuid NOT NULL,
                CONSTRAINT "UQ_eb33b9e783aaa3569c9f1beb058" UNIQUE ("candidate_id", "election_id"),
                CONSTRAINT "PK_f4dba91aaf130695c587db8a2d2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_passcode"
            ADD CONSTRAINT "FK_390af88ad2ec4fa291b33c6b979" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "voters"
            ADD CONSTRAINT "FK_ebdfb9e41a142b1079e60aed63e" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "elections"
            ADD CONSTRAINT "FK_249f6055bf7a67a17e6f6ec6f59" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "elections"
            ADD CONSTRAINT "FK_34883fa5eff7740f70f0ec30936" FOREIGN KEY ("copy_election_id") REFERENCES "elections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "email_tokens"
            ADD CONSTRAINT "FK_a3b56799b7ef679570284e42141" FOREIGN KEY ("voter_id") REFERENCES "voters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "email_tokens"
            ADD CONSTRAINT "FK_b3cf82eb33e2609bb6d7fc841ad" FOREIGN KEY ("election_id") REFERENCES "elections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "candidates"
            ADD CONSTRAINT "FK_9f898cd26fb19cf9dc4621328c7" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ADD CONSTRAINT "FK_afc3c24ffadd97da21107abf2f5" FOREIGN KEY ("voter_id") REFERENCES "organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "responses"
            ADD CONSTRAINT "FK_96b0c2088c452b397d991e8e3bb" FOREIGN KEY ("election_id") REFERENCES "organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_permissions"
            ADD CONSTRAINT "FK_e83c6ef14600c7e765f4d50432e" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log"
            ADD CONSTRAINT "FK_1cba7d14456bf5032da523fd48d" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log"
            ADD CONSTRAINT "FK_c2f376dc0964beca2d1b3864d88" FOREIGN KEY ("admin_permission_id") REFERENCES "admin_permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log"
            ADD CONSTRAINT "FK_1bce427db9fb32113eb1763e2d8" FOREIGN KEY ("voter_id") REFERENCES "voters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log"
            ADD CONSTRAINT "FK_8d963cdfbc9ee16cff8e3b7caa5" FOREIGN KEY ("election_id") REFERENCES "elections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log"
            ADD CONSTRAINT "FK_362871873a20a29cc57c43b6228" FOREIGN KEY ("email_token_id") REFERENCES "email_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log"
            ADD CONSTRAINT "FK_2b080b5e8c356e7498435d058e6" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log"
            ADD CONSTRAINT "FK_83e3f357452e9393849e99125ac" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log"
            ADD CONSTRAINT "FK_3f034e80b18cf9940ff88164909" FOREIGN KEY ("api_token_id") REFERENCES "api_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log"
            ADD CONSTRAINT "FK_d35dffd0d4af092a39871d2808b" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log"
            ADD CONSTRAINT "FK_ed36e307c4d3daa9762b205befb" FOREIGN KEY ("response_id") REFERENCES "responses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log"
            ADD CONSTRAINT "FK_77ca42b73fe5fa97878425067b7" FOREIGN KEY ("voter_id") REFERENCES "voters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log"
            ADD CONSTRAINT "FK_8ae83ab109c587b31221de6ee0f" FOREIGN KEY ("election_id") REFERENCES "elections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log"
            ADD CONSTRAINT "FK_7bbc3798ce33a732c0f97860101" FOREIGN KEY ("email_token_id") REFERENCES "email_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log"
            ADD CONSTRAINT "FK_f0c2d95a37564693bd048f5865b" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log"
            ADD CONSTRAINT "FK_4702916d51f9626dfa637af15fe" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log"
            ADD CONSTRAINT "FK_190ae484392abaca290d6003f4b" FOREIGN KEY ("api_token_id") REFERENCES "api_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log"
            ADD CONSTRAINT "FK_c854f3f14394b8395423c01433b" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log"
            ADD CONSTRAINT "FK_d67a3fc2c943611834478d8803a" FOREIGN KEY ("response_id") REFERENCES "responses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_tokens"
            ADD CONSTRAINT "FK_d36431dd8b3d2d315e6593237b9" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "runnings"
            ADD CONSTRAINT "FK_5ead13968fd66de0447096c8cf8" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "runnings"
            ADD CONSTRAINT "FK_fe6ded7d0842fc873ae25b160fd" FOREIGN KEY ("election_id") REFERENCES "elections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "runnings" DROP CONSTRAINT "FK_fe6ded7d0842fc873ae25b160fd"
        `);
        await queryRunner.query(`
            ALTER TABLE "runnings" DROP CONSTRAINT "FK_5ead13968fd66de0447096c8cf8"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_tokens" DROP CONSTRAINT "FK_d36431dd8b3d2d315e6593237b9"
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log" DROP CONSTRAINT "FK_d67a3fc2c943611834478d8803a"
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log" DROP CONSTRAINT "FK_c854f3f14394b8395423c01433b"
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log" DROP CONSTRAINT "FK_190ae484392abaca290d6003f4b"
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log" DROP CONSTRAINT "FK_4702916d51f9626dfa637af15fe"
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log" DROP CONSTRAINT "FK_f0c2d95a37564693bd048f5865b"
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log" DROP CONSTRAINT "FK_7bbc3798ce33a732c0f97860101"
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log" DROP CONSTRAINT "FK_8ae83ab109c587b31221de6ee0f"
        `);
        await queryRunner.query(`
            ALTER TABLE "event_log" DROP CONSTRAINT "FK_77ca42b73fe5fa97878425067b7"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log" DROP CONSTRAINT "FK_ed36e307c4d3daa9762b205befb"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log" DROP CONSTRAINT "FK_d35dffd0d4af092a39871d2808b"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log" DROP CONSTRAINT "FK_3f034e80b18cf9940ff88164909"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log" DROP CONSTRAINT "FK_83e3f357452e9393849e99125ac"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log" DROP CONSTRAINT "FK_2b080b5e8c356e7498435d058e6"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log" DROP CONSTRAINT "FK_362871873a20a29cc57c43b6228"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log" DROP CONSTRAINT "FK_8d963cdfbc9ee16cff8e3b7caa5"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log" DROP CONSTRAINT "FK_1bce427db9fb32113eb1763e2d8"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log" DROP CONSTRAINT "FK_c2f376dc0964beca2d1b3864d88"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_log" DROP CONSTRAINT "FK_1cba7d14456bf5032da523fd48d"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_permissions" DROP CONSTRAINT "FK_e83c6ef14600c7e765f4d50432e"
        `);
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
            ALTER TABLE "candidates" DROP CONSTRAINT "FK_9f898cd26fb19cf9dc4621328c7"
        `);
        await queryRunner.query(`
            ALTER TABLE "email_tokens" DROP CONSTRAINT "FK_b3cf82eb33e2609bb6d7fc841ad"
        `);
        await queryRunner.query(`
            ALTER TABLE "email_tokens" DROP CONSTRAINT "FK_a3b56799b7ef679570284e42141"
        `);
        await queryRunner.query(`
            ALTER TABLE "elections" DROP CONSTRAINT "FK_34883fa5eff7740f70f0ec30936"
        `);
        await queryRunner.query(`
            ALTER TABLE "elections" DROP CONSTRAINT "FK_249f6055bf7a67a17e6f6ec6f59"
        `);
        await queryRunner.query(`
            ALTER TABLE "voters" DROP CONSTRAINT "FK_ebdfb9e41a142b1079e60aed63e"
        `);
        await queryRunner.query(`
            ALTER TABLE "admin_passcode" DROP CONSTRAINT "FK_390af88ad2ec4fa291b33c6b979"
        `);
        await queryRunner.query(`
            DROP TABLE "runnings"
        `);
        await queryRunner.query(`
            DROP TABLE "admin_tokens"
        `);
        await queryRunner.query(`
            DROP TABLE "event_log"
        `);
        await queryRunner.query(`
            DROP TABLE "admin_log"
        `);
        await queryRunner.query(`
            DROP TABLE "admin_permissions"
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
            DROP TABLE "email_tokens"
        `);
        await queryRunner.query(`
            DROP TABLE "elections"
        `);
        await queryRunner.query(`
            DROP TABLE "voters"
        `);
        await queryRunner.query(`
            DROP TABLE "organisations"
        `);
        await queryRunner.query(`
            DROP TABLE "admin_passcode"
        `);
        await queryRunner.query(`
            DROP TABLE "admin_users"
        `);
    }

}
