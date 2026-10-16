ALTER TABLE "documentation" ALTER COLUMN "youtube_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documentation" ADD COLUMN "media_type" text DEFAULT 'video' NOT NULL;--> statement-breakpoint
ALTER TABLE "documentation" ADD COLUMN "image" text;