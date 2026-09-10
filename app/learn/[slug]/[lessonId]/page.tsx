import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEnhancedLesson } from "../../enhancedLessons";
import { COURSE_TITLES, isCourseSlug, isLessonIdForCourse } from "../../courseTopology";
import LessonExperience from "./LessonExperience";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lessonId: string }> }): Promise<Metadata> {
  const { slug, lessonId } = await params;
  if (!isCourseSlug(slug) || !isLessonIdForCourse(slug, lessonId)) return {};
  const lesson = getEnhancedLesson(slug, lessonId);
  return {
    title: `${COURSE_TITLES[slug]} Lesson ${lessonId.slice(1)}`,
    description: lesson?.purpose ?? `Lesson ${lessonId.slice(1)} in ${COURSE_TITLES[slug]}.`,
  };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params;
  if (!isLessonIdForCourse(slug, lessonId)) notFound();
  return <LessonExperience slug={slug} lessonId={lessonId} enhancedLesson={getEnhancedLesson(slug, lessonId)} />;
}
