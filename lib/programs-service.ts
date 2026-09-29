import "server-only";
import { cache } from "react";
import { asc, eq } from "drizzle-orm";
import { programClasses as classData } from "@/data/program-classes";
import { programs as programData } from "@/data/programs";
import { teachers as teacherData } from "@/data/teachers";
import { testimonials as testimonialData } from "@/data/testimonials";
import { getDb, schema } from "@/db";
import type { ProgramClassRow, ProgramRow, TeacherRow, TestimonialRow } from "@/db/schema";
import type { ProgramClass, ProgramWithClasses, Teacher, Testimonial } from "@/types";

/**
 * Satu pintu data konten publik (program + jadwal, pengajar, testimoni).
 *
 * - Database terhubung → data dari database (dikelola lewat /admin).
 * - Belum ada database / database error → data bawaan di folder data/, agar situs tidak rusak.
 *
 * Halaman tetap statis; setelah admin menyimpan perubahan, halaman terkait diperbarui
 * lewat revalidatePath (lihat lib/admin/revalidate.ts).
 */

async function withFallback<T>(label: string, load: () => Promise<T | null>, fallback: () => T): Promise<T> {
  try {
    const result = await load();
    if (result !== null) return result;
  } catch (error) {
    console.error(`[content] Gagal memuat ${label} dari database, memakai data bawaan:`, error);
  }
  return fallback();
}

export function toProgramClass(row: ProgramClassRow): ProgramClass {
  return {
    id: row.id,
    programId: row.programId,
    name: row.name,
    registrationOpens: row.registrationOpens,
    registrationCloses: row.registrationCloses,
    classStarts: row.classStarts,
    days: row.days,
    time: row.time,
    mode: row.mode,
    location: row.location ?? undefined,
    quota: row.quota,
    enrolled: row.enrolled,
    manuallyClosed: row.manuallyClosed || undefined,
    note: row.note ?? undefined,
  };
}

export function toProgram(row: ProgramRow, classes: ProgramClassRow[]): ProgramWithClasses {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.image,
    imageAlt: row.imageAlt,
    theme: row.theme,
    category: row.category,
    ageRange: row.ageRange,
    code: row.code,
    tagline: row.tagline,
    longDescription: row.longDescription,
    facts: row.facts,
    curriculum: row.curriculum,
    outcomes: row.outcomes,
    audience: row.audience,
    pricing: row.pricing,
    classes: classes
      .filter((c) => c.programId === row.id)
      .sort((a, b) => a.classStarts.localeCompare(b.classStarts))
      .map(toProgramClass),
  };
}

export function toTeacher(row: TeacherRow): Teacher {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    programIds: row.programIds,
    experienceYears: row.experienceYears,
    education: row.education,
    highlights: row.highlights,
    bio: row.bio,
    gender: row.gender,
    photo: row.photo ?? undefined,
  };
}

export function toTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    quote: row.quote,
    rating: row.rating,
    tone: row.tone,
    programId: row.programId ?? undefined,
    city: row.city ?? undefined,
    date: row.date ?? undefined,
  };
}

/** Program yang ditampilkan (published) beserta jadwal kelasnya, urut sesuai admin. */
export const getProgramsWithClasses = cache(
  (): Promise<ProgramWithClasses[]> =>
    withFallback(
      "program",
      async () => {
        const db = await getDb();
        if (!db) return null;
        const [rows, classes] = await Promise.all([
          db.select().from(schema.programs).where(eq(schema.programs.published, true)).orderBy(asc(schema.programs.sortOrder), asc(schema.programs.title)),
          db.select().from(schema.programClasses),
        ]);
        return rows.map((row) => toProgram(row, classes));
      },
      getMockProgramsWithClasses,
    ),
);

export const getTeachers = cache(
  (): Promise<Teacher[]> =>
    withFallback(
      "pengajar",
      async () => {
        const db = await getDb();
        if (!db) return null;
        const rows = await db
          .select()
          .from(schema.teachers)
          .where(eq(schema.teachers.published, true))
          .orderBy(asc(schema.teachers.sortOrder), asc(schema.teachers.name));
        return rows.map(toTeacher);
      },
      () => teacherData,
    ),
);

export const getTestimonials = cache(
  (): Promise<Testimonial[]> =>
    withFallback(
      "testimoni",
      async () => {
        const db = await getDb();
        if (!db) return null;
        const rows = await db
          .select()
          .from(schema.testimonials)
          .where(eq(schema.testimonials.published, true))
          .orderBy(asc(schema.testimonials.sortOrder));
        return rows.map(toTestimonial);
      },
      () => testimonialData,
    ),
);

export function getMockProgramsWithClasses(): ProgramWithClasses[] {
  return programData.map((program) => ({
    ...program,
    classes: classData.filter((item) => item.programId === program.id),
  }));
}
