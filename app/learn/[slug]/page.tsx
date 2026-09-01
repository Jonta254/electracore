import CourseExperience from "./CourseExperience";

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  return <CourseExperience params={params} />;
}
