CREATE TABLE "documentation" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"caption" text NOT NULL,
	"date" text NOT NULL,
	"category" text NOT NULL,
	"program_id" text,
	"youtube_id" text NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documentation" ADD CONSTRAINT "documentation_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;