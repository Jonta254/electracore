import { notFound } from "next/navigation";
import { getEnhancedLesson } from "../../enhancedLessons";
import { isLessonIdForCourse } from "../../courseTopology";
import LessonExperience from "./LessonExperience";

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params;
  if (!isLessonIdForCourse(slug, lessonId)) notFound();
  return <LessonExperience slug={slug} lessonId={lessonId} enhancedLesson={getEnhancedLesson(slug, lessonId)} />;
}
