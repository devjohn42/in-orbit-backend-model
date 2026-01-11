CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"avatar_url" text NOT NULL,
	"exteral_account_id" integer NOT NULL,
	CONSTRAINT "users_exteral_account_id_unique" UNIQUE("exteral_account_id")
);
