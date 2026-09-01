import CourseExperience from "./CourseExperience";
import { notFound } from "next/navigation";
import { isCourseSlug } from "../courseTopology";
import { COURSE_LESSON_COUNTS } from "../courseTopology";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(COURSE_LESSON_COUNTS).map(slug => ({ slug }));
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isCourseSlug(slug)) notFound();
  return <CourseExperience slug={slug} />;
}
