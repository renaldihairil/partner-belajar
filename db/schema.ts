import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import type {
  ArticleBlock,
  ArticleCategory,
  AudienceItem,
  ClassMode,
  CurriculumModule,
  DocumentationCategory,
  PricePlan,
  ProgramTheme,
  Teacher,
  Testimonial,
} from "@/types";
import type { AdminRole, PermissionKey } from "@/lib/auth/permissions";

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

/**
 * Link publik agar guru mengisi data sendiri (dibagikan admin ke para guru).
 * PIN opsional: tanpa PIN cukup punya link; dengan PIN harus punya link DAN tahu PIN-nya.
 * PIN disimpan sebagai hash (scrypt), jadi tidak bisa dilihat lagi — hanya bisa diganti.
 */
export const teacherLinks = pgTable("teacher_links", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  label: text("label").notNull(),
  /** Kosong = link terbuka (cukup punya link). Terisi = wajib PIN. */
  pinHash: text("pin_hash"),
  active: boolean("active").notNull().default(true),
  ...timestamps,
});

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
  /** Kontak pribadi guru (WhatsApp/email) — hanya untuk admin, tidak pernah tampil di situs. */
  contact: text("contact"),
  /** Terisi bila data masuk lewat link form guru; kosong bila diinput admin. */
  linkId: text("link_id").references(() => teacherLinks.id, { onDelete: "set null" }),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  ...timestamps,
});

/**
 * Link publik untuk mengumpulkan testimoni (dibagikan admin ke orang tua).
 * Orang tua membuka /kirim-testimoni/<token>; kalau link terkait sebuah program,
 * testimoni yang masuk otomatis dikaitkan ke program itu.
 */
export const testimonialLinks = pgTable("testimonial_links", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  label: text("label").notNull(),
  programId: text("program_id").references(() => programs.id, { onDelete: "set null" }),
  active: boolean("active").notNull().default(true),
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
  /** Nama anak (diisi orang tua lewat link testimoni; ikut tampil di keterangan). */
  childName: text("child_name"),
  /** Terisi bila testimoni masuk lewat link publik; kosong bila diinput admin. */
  linkId: text("link_id").references(() => testimonialLinks.id, { onDelete: "set null" }),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  ...timestamps,
});

export const articles = pgTable(
  "articles",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    /** Tanggal terbit "YYYY-MM-DD" (WIB). */
    date: text("date").notNull(),
    image: text("image").notNull(),
    imageAlt: text("image_alt").notNull(),
    excerpt: text("excerpt").notNull(),
    category: text("category").$type<ArticleCategory>().notNull(),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    authorName: text("author_name").notNull(),
    authorRole: text("author_role").notNull(),
    content: jsonb("content").$type<ArticleBlock[]>().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("articles_date_idx").on(t.date)],
);

export const documentation = pgTable("documentation", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  caption: text("caption").notNull(),
  /** Tanggal kegiatan "YYYY-MM-DD". */
  date: text("date").notNull(),
  category: text("category").$type<DocumentationCategory>().notNull(),
  programId: text("program_id").references(() => programs.id, { onDelete: "set null" }),
  youtubeId: text("youtube_id").notNull(),
  published: boolean("published").notNull().default(true),
  ...timestamps,
});

export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  /** "owner" (semua akses) atau "editor" (sesuai `permissions`). Akun lama otomatis menjadi owner. */
  role: text("role").$type<AdminRole>().notNull().default("owner"),
  permissions: jsonb("permissions").$type<PermissionKey[]>().notNull().default([]),
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
export type ArticleRow = typeof articles.$inferSelect;
export type DocumentationRow = typeof documentation.$inferSelect;
export type TestimonialRow = typeof testimonials.$inferSelect;
export type TestimonialLinkRow = typeof testimonialLinks.$inferSelect;
export type TeacherLinkRow = typeof teacherLinks.$inferSelect;
export type AdminUserRow = typeof adminUsers.$inferSelect;
