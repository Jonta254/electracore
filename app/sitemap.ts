import type { MetadataRoute } from "next";
import { GUIDES } from "./guides/content";
import { COURSE_LESSON_COUNTS } from "./learn/courseTopology";

const ORIGIN = "https://electracore.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: ORIGIN, changeFrequency: "weekly", priority: 1 },
    { url: `${ORIGIN}/learn`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${ORIGIN}/calculate`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${ORIGIN}/design`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${ORIGIN}/guides`, changeFrequency: "weekly", priority: 0.9 },
  ];

  const courseRoutes: MetadataRoute.Sitemap = Object.entries(COURSE_LESSON_COUNTS).flatMap(([slug, lessonCount]) => [
    { url: `${ORIGIN}/learn/${slug}`, changeFrequency: "monthly" as const, priority: 0.8 },
    ...Array.from({ length: lessonCount }, (_, index) => ({
      url: `${ORIGIN}/learn/${slug}/l${index + 1}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]);

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${ORIGIN}/guides/${guide.slug}`,
    lastModified: guide.updated,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...coreRoutes, ...courseRoutes, ...guideRoutes];
}
