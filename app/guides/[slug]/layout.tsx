import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDE_MAP, GUIDES } from "../content";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDE_MAP[slug];
  if (!guide) return {};
  return { title: guide.title, description: guide.sub };
}

export default async function GuideLayout({ children, params }: Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  if (!GUIDE_MAP[slug]) notFound();
  return children;
}
