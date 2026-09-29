import { count } from "drizzle-orm";
import { programClasses as classData } from "@/data/program-classes";
import { programs as programData } from "@/data/programs";
import { teachers as teacherData } from "@/data/teachers";
import { testimonials as testimonialData } from "@/data/testimonials";
import type { Db } from "./index";
import { programClasses, programs, teachers, testimonials } from "./schema";

/**
 * Mengisi database kosong dengan konten awal dari folder data/ (program, jadwal,
 * pengajar, testimoni). Aman dijalankan berkali-kali: tabel yang sudah berisi dilewati.
 */
export async function seedIfEmpty(db: Db): Promise<string[]> {
  const done: string[] = [];

  const [{ value: programCount }] = await db.select({ value: count() }).from(programs);
  if (programCount === 0) {
    await db.insert(programs).values(
      programData.map((p, index) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        image: p.image,
        imageAlt: p.imageAlt,
        theme: p.theme,
        category: p.category,
        ageRange: p.ageRange,
        code: p.code,
        tagline: p.tagline,
        longDescription: p.longDescription,
        facts: p.facts,
        curriculum: p.curriculum,
        outcomes: p.outcomes,
        audience: p.audience,
        pricing: p.pricing,
        sortOrder: index,
      })),
    );
    if (classData.length) {
      await db.insert(programClasses).values(
        classData.map((c) => ({
          ...c,
          location: c.location ?? null,
          note: c.note ?? null,
          manuallyClosed: c.manuallyClosed ?? false,
        })),
      );
    }
    done.push("programs", "program_classes");
  }

  const [{ value: teacherCount }] = await db.select({ value: count() }).from(teachers);
  if (teacherCount === 0 && teacherData.length) {
    await db.insert(teachers).values(
      teacherData.map((t, index) => ({ ...t, photo: t.photo ?? null, sortOrder: index })),
    );
    done.push("teachers");
  }

  const [{ value: testimonialCount }] = await db.select({ value: count() }).from(testimonials);
  if (testimonialCount === 0 && testimonialData.length) {
    await db.insert(testimonials).values(
      testimonialData.map((t, index) => ({
        ...t,
        programId: t.programId ?? null,
        city: t.city ?? null,
        date: t.date ?? null,
        sortOrder: index,
      })),
    );
    done.push("testimonials");
  }

  return done;
}
