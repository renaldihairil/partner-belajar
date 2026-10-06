CREATE TABLE "teacher_links" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"label" text NOT NULL,
	"pin_hash" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_links_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "contact" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "link_id" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_link_id_teacher_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."teacher_links"("id") ON DELETE set null ON UPDATE no action;