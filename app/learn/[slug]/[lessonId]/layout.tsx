import { notFound } from "next/navigation";
import { COURSE_LESSON_COUNTS, isLessonIdForCourse } from "../../courseTopology";

export function generateStaticParams() {
  return Object.entries(COURSE_LESSON_COUNTS).flatMap(([slug, count]) =>
    Array.from({ length: count }, (_, index) => ({ slug, lessonId: `l${index + 1}` })),
  );
}

export default async function LessonLayout({ children, params }: Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string; lessonId: string }>;
}>) {
  const { slug, lessonId } = await params;
  if (!isLessonIdForCourse(slug, lessonId)) notFound();
  return children;
}
