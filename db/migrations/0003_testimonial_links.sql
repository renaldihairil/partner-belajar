CREATE TABLE "testimonial_links" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"label" text NOT NULL,
	"program_id" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "testimonial_links_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "child_name" text;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "link_id" text;--> statement-breakpoint
ALTER TABLE "testimonial_links" ADD CONSTRAINT "testimonial_links_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_link_id_testimonial_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."testimonial_links"("id") ON DELETE set null ON UPDATE no action;