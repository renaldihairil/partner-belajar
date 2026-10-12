ALTER TABLE "teachers" ADD COLUMN "edit_token" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "self_updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_edit_token_unique" UNIQUE("edit_token");