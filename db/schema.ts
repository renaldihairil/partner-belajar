import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import type {
  AudienceItem,
  ClassMode,
  CurriculumModule,
  PricePlan,
  ProgramTheme,
  Teacher,
  Testimonial,
} from "@/types";

/**
 * Skema database Partner Belajar.
 * Bagian konten yang bertingkat (kurikulum, harga, dll.) disimpan sebagai JSON agar
 * sederhana dikelola; bentuknya sama persis dengan tipe di types/index.ts.
 * Tanggal jadwal disimpan sebagai teks "YYYY-MM-DD" (WIB), sama seperti sebelumnya.
 */

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const programs = pgTable("programs", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  imageAlt: text("image_alt").notNull(),
  theme: text("theme").$type<ProgramTheme>().notNull(),
  category: text("category").notNull(),
  ageRange: text("age_range").notNull(),
  code: text("code").notNull(),
  tagline: text("tagline").notNull(),
  longDescription: text("long_description").notNull(),
  facts: jsonb("facts").$type<{ label: string; value: string }[]>().notNull().default([]),
  curriculum: jsonb("curriculum").$type<CurriculumModule[]>().notNull().default([]),
  outcomes: jsonb("outcomes").$type<string[]>().notNull().default([]),
  audience: jsonb("audience").$type<AudienceItem[]>().notNull().default([]),
  pricing: jsonb("pricing").$type<PricePlan[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  ...timestamps,
});

export const programClasses = pgTable(
  "program_classes",
  {
    id: text("id").primaryKey(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    registrationOpens: text("registration_opens").notNull(),
    registrationCloses: text("registration_closes").notNull(),
    classStarts: text("class_starts").notNull(),
    days: jsonb("days").$type<string[]>().notNull().default([]),
    time: text("time").notNull(),
    mode: text("mode").$type<ClassMode>().notNull(),
    location: text("location"),
    quota: integer("quota").notNull(),
    enrolled: integer("enrolled").notNull().default(0),
    manuallyClosed: boolean("manually_closed").notNull().default(false),
    note: text("note"),
    ...timestamps,
  },
  (t) => [index("program_classes_program_idx").on(t.programId)],
);

export const teachers = pgTable("teachers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  programIds: jsonb("program_ids").$type<string[]>().notNull().default([]),
  experienceYears: integer("experience_years").notNull().default(0),
  education: text("education").notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  bio: text("bio").notNull(),
  gender: text("gender").$type<Teacher["gender"]>().notNull(),
  photo: text("photo"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  ...timestamps,
});

export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  quote: text("quote").notNull(),
  rating: integer("rating").$type<Testimonial["rating"]>().notNull(),
  tone: text("tone").$type<Testimonial["tone"]>().notNull(),
  programId: text("program_id").references(() => programs.id, { onDelete: "set null" }),
  city: text("city"),
  date: text("date"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  ...timestamps,
});

export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
});

/** Catatan login gagal untuk membatasi percobaan tebak password. */
export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("login_attempts_key_idx").on(t.key, t.createdAt)],
);

export type ProgramRow = typeof programs.$inferSelect;
export type ProgramClassRow = typeof programClasses.$inferSelect;
export type TeacherRow = typeof teachers.$inferSelect;
export type TestimonialRow = typeof testimonials.$inferSelect;
export type AdminUserRow = typeof adminUsers.$inferSelect;
