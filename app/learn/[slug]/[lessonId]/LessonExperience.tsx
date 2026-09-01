"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { COURSES, LessonContent } from "../CourseExperience";
import type { EnhancedLesson } from "../../enhancedLessons";
import type { CourseLearningState } from "../../progress";
import { loadCourseLearning, saveLastLesson, saveLessonCompletion } from "../../progress";
import { ASSESSMENT_PASS_SCORE } from "../../assessment";
import { canMarkLessonComplete } from "../../completionPolicy";

const EMPTY_LEARNING: CourseLearningState = { completedLessons: [], assessments: {}, completedExercises: [] };

export default function LessonExperience({ slug, lessonId, enhancedLesson }: {
  slug: string;
  lessonId: string;
  enhancedLesson?: EnhancedLesson;
}) {
  const router = useRouter();
  const course = COURSES[slug];
  const [learning, setLearning] = useState<CourseLearningState>(EMPTY_LEARNING);

  const location = useMemo(() => {
    if (!course) return null;
    const lessons = course.modules.flatMap(module => module.lessons);
    const index = lessons.findIndex(lesson => lesson.id === lessonId);
    if (index < 0) return null;
    const courseModule = course.modules.find(item => item.lessons.some(lesson => lesson.id === lessonId));
    return { lesson: lessons[index], lessons, index, courseModule };
  }, [course, lessonId]);

  useEffect(() => {
    if (!course || !location) return;
    try {
      setLearning(loadCourseLearning(localStorage, slug));
      saveLastLesson(localStorage, slug, lessonId);
    } catch {
      // The reader remains usable when browser storage is unavailable.
    }
  }, [course, lessonId, location, slug]);

  if (!course || !location || !location.courseModule) return null;

  const { lesson, lessons, index, courseModule } = location;
  const completed = new Set(learning.completedLessons);
  const isComplete = completed.has(lesson.id);
  const assessmentRecord = learning.assessments[lesson.id];
  const exerciseComplete = learning.completedExercises.includes(lesson.id);
  const requirementMet = canMarkLessonComplete({
    type: lesson.type,
    alreadyComplete: isComplete,
    exerciseComplete,
    bestAssessmentScore: assessmentRecord?.bestScore,
  });

  const refreshLearning = () => {
    try { setLearning(loadCourseLearning(localStorage, slug)); } catch {}
  };
  const goToLesson = (targetId: string) => {
    try { saveLastLesson(localStorage, slug, targetId); } catch {}
    router.push(`/learn/${slug}/${targetId}`);
  };
  const toggleComplete = () => {
    if (!isComplete && !requirementMet) return;
    setLearning(current => {
      const nextCompleted = new Set(current.completedLessons);
      if (nextCompleted.has(lesson.id)) nextCompleted.delete(lesson.id); else nextCompleted.add(lesson.id);
      const next = { ...current, completedLessons: [...nextCompleted] };
      try { saveLessonCompletion(localStorage, slug, next.completedLessons, lessons.length); } catch {}
      return next;
    });
  };

  const requirementText = lesson.type === "quiz"
    ? `Score at least ${ASSESSMENT_PASS_SCORE}% to mark this assessment complete.`
    : lesson.type === "exercise"
      ? "Complete the exercise before marking this lesson complete."
      : null;

  return (
    <main className="lesson-route" style={{ "--lesson-accent": course.color } as CSSProperties}>
      <header className="lesson-route-header">
        <div className="lesson-route-breadcrumb"><Link href="/learn">Courses</Link><span>/</span><Link href={`/learn/${slug}`}>{course.title}</Link><span>/</span><span>{courseModule.title}</span></div>
        <div className="lesson-route-title-row">
          <div><p>{lesson.type} · {lesson.duration} · Lesson {index + 1} of {lessons.length}</p><h1>{lesson.title}</h1></div>
          <button type="button" className={isComplete ? "is-complete" : ""} disabled={!isComplete && !requirementMet} onClick={toggleComplete}>{isComplete ? "Completed" : "Mark complete"}</button>
        </div>
        {requirementText && !isComplete ? <p className="lesson-completion-requirement">{requirementMet ? "Completion requirement met. You can now mark this lesson complete." : requirementText}</p> : null}
        <div className="lesson-route-progress" aria-label={`${index + 1} of ${lessons.length} lessons`}><span style={{ width: `${((index + 1) / lessons.length) * 100}%` }} /></div>
      </header>

      <div className="lesson-route-layout">
        <aside className="lesson-syllabus" aria-label="Course syllabus">
          <div className="lesson-syllabus-head"><strong>Course syllabus</strong><Link href={`/learn/${slug}`}>Course overview</Link></div>
          <div className="lesson-mobile-jump">
            <label htmlFor="lesson-jump">Jump to any lesson</label>
            <select id="lesson-jump" value={lesson.id} onChange={event => goToLesson(event.target.value)}>
              {course.modules.map((item, moduleIndex) => <optgroup key={item.id} label={`${moduleIndex + 1}. ${item.title}`}>
                {item.lessons.map(itemLesson => <option key={itemLesson.id} value={itemLesson.id}>{itemLesson.title}</option>)}
              </optgroup>)}
            </select>
          </div>
          <nav>{course.modules.map((item, moduleIndex) => <details key={item.id} open={item.id === courseModule.id}>
            <summary><span>{String(moduleIndex + 1).padStart(2, "0")}</span>{item.title}</summary>
            <ol>{item.lessons.map(itemLesson => <li key={itemLesson.id} className={completed.has(itemLesson.id) ? "is-done" : ""}>
              <Link href={`/learn/${slug}/${itemLesson.id}`} aria-current={itemLesson.id === lesson.id ? "page" : undefined}>
                <span>{completed.has(itemLesson.id) ? "Done" : itemLesson.type === "lesson" ? "Read" : itemLesson.type}</span>{itemLesson.title}
              </Link>
            </li>)}</ol>
          </details>)}</nav>
        </aside>

        <section className="lesson-route-reader" aria-label="Lesson content">
          <LessonContent
            lesson={lesson}
            courseColor={course.color}
            courseSlug={slug}
            moduleTitle={courseModule.title}
            previousLesson={lessons[index - 1]}
            nextLesson={lessons[index + 1]}
            onNavigate={goToLesson}
            enhancedLesson={enhancedLesson}
            exerciseComplete={exerciseComplete}
            assessmentRecord={assessmentRecord}
            onLearningStateChange={refreshLearning}
          />
        </section>
      </div>
    </main>
  );
}
