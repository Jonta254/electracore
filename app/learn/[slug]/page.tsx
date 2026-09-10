import CourseExperience from "./CourseExperience";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSE_LESSON_COUNTS, COURSE_TITLES, isCourseSlug } from "../courseTopology";

export function generateStaticParams() {
  return Object.keys(COURSE_LESSON_COUNTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isCourseSlug(slug)) return {};
  const title = COURSE_TITLES[slug];
  return {
    title,
    description: `${title}: structured electrical lessons, worked examples, knowledge checks, sources, and visible review status.`,
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isCourseSlug(slug)) notFound();
  return <CourseExperience slug={slug} />;
}
