ALTER TABLE "programs" ADD COLUMN "whatsapp" text;--> statement-breakpoint
ALTER TABLE "program_classes" DROP COLUMN "registration_opens";--> statement-breakpoint
ALTER TABLE "program_classes" DROP COLUMN "registration_closes";--> statement-breakpoint
ALTER TABLE "program_classes" DROP COLUMN "class_starts";