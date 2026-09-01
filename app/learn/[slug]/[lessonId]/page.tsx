"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { COURSES, LessonContent } from "../CourseExperience";
import { loadCourseLearning, saveLastLesson, saveLessonCompletion } from "../../progress";

export default function LessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = use(params);
  const router = useRouter();
  const course = COURSES[slug];
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());

  const location = useMemo(() => {
    if (!course) return null;
    const lessons = course.modules.flatMap((module) => module.lessons);
    const index = lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index < 0) return null;
    const courseModule = course.modules.find((item) => item.lessons.some((lesson) => lesson.id === lessonId));
    return { lesson: lessons[index], lessons, index, courseModule };
  }, [course, lessonId]);

  useEffect(() => {
    if (!course || !location) return;
    try {
      const saved = loadCourseLearning(localStorage, slug);
      setCompleted(new Set(saved.completedLessons));
      saveLastLesson(localStorage, slug, lessonId);
    } catch {
      // The reader remains usable when browser storage is unavailable.
    }
  }, [course, lessonId, location, slug]);

  if (!course || !location || !location.courseModule) {
    return <main className="lesson-route-missing"><p>Lesson not found</p><Link href={course ? `/learn/${slug}` : "/learn"}>Return to the course catalogue</Link></main>;
  }

  const { lesson, lessons, index, courseModule } = location;
  const isComplete = completed.has(lesson.id);
  const goToLesson = (targetId: string) => {
    try { saveLastLesson(localStorage, slug, targetId); } catch {}
    router.push(`/learn/${slug}/${targetId}`);
  };
  const toggleComplete = () => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(lesson.id)) next.delete(lesson.id); else next.add(lesson.id);
      try { saveLessonCompletion(localStorage, slug, [...next], lessons.length); } catch {}
      return next;
    });
  };

  return (
    <main className="lesson-route" style={{ "--lesson-accent": course.color } as CSSProperties}>
      <header className="lesson-route-header">
        <div className="lesson-route-breadcrumb"><Link href="/learn">Courses</Link><span>/</span><Link href={`/learn/${slug}`}>{course.title}</Link><span>/</span><span>{courseModule.title}</span></div>
        <div className="lesson-route-title-row">
          <div><p>{lesson.type} · {lesson.duration} · Lesson {index + 1} of {lessons.length}</p><h1>{lesson.title}</h1></div>
          <button type="button" className={isComplete ? "is-complete" : ""} onClick={toggleComplete}>{isComplete ? "Completed" : "Mark complete"}</button>
        </div>
        <div className="lesson-route-progress" aria-label={`${index + 1} of ${lessons.length} lessons`}><span style={{ width: `${((index + 1) / lessons.length) * 100}%` }} /></div>
      </header>

      <div className="lesson-route-layout">
        <aside className="lesson-syllabus" aria-label="Course syllabus">
          <div className="lesson-syllabus-head"><strong>Course syllabus</strong><Link href={`/learn/${slug}`}>Course overview</Link></div>
          <nav>
            {course.modules.map((item, moduleIndex) => (
              <details key={item.id} open={item.id === courseModule.id}>
                <summary><span>{String(moduleIndex + 1).padStart(2, "0")}</span>{item.title}</summary>
                <ol>
                  {item.lessons.map((itemLesson) => (
                    <li key={itemLesson.id} className={completed.has(itemLesson.id) ? "is-done" : ""}>
                      <Link href={`/learn/${slug}/${itemLesson.id}`} aria-current={itemLesson.id === lesson.id ? "page" : undefined}>
                        <span>{completed.has(itemLesson.id) ? "Done" : itemLesson.type === "lesson" ? "Read" : itemLesson.type}</span>
                        {itemLesson.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </nav>
        </aside>

        <section className="lesson-route-reader" aria-label="Lesson content">
          <LessonContent
            key={lesson.id}
            lesson={lesson}
            courseColor={course.color}
            courseSlug={slug}
            moduleTitle={courseModule.title}
            previousLesson={lessons[index - 1]}
            nextLesson={lessons[index + 1]}
            onNavigate={goToLesson}
          />
        </section>
      </div>
    </main>
  );
}
