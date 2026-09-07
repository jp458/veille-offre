import Parser from "rss-parser";
import { categories, Category } from "./feeds";

export type Item = {
  title: string;
  link: string;
  source: string;
  isoDate: string | null;
  categoryId: string;
};

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "Mozilla/5.0 (veille-locale-bot)" },
});

async function fetchOneFeed(url: string, sourceName: string, categoryId: string): Promise<Item[]> {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []).slice(0, 15).map((it) => ({
      title: it.title || "(sans titre)",
      link: it.link || "#",
      source: sourceName,
      isoDate: it.isoDate || it.pubDate || null,
      categoryId,
    }));
  } catch (err) {
    // Un flux cassé ou temporairement indisponible ne doit pas faire planter le reste
    console.error(`Échec du flux ${sourceName} (${url}):`, (err as Error).message);
    return [];
  }
}

export async function getAllItems(): Promise<{ items: Item[]; categories: Category[] }> {
  const jobs: Promise<Item[]>[] = [];

  for (const cat of categories) {
    for (const feed of cat.feeds) {
      jobs.push(fetchOneFeed(feed.url, feed.name, cat.id));
    }
  }

  const results = await Promise.all(jobs);
  const items = results
    .flat()
    .sort((a, b) => {
      const da = a.isoDate ? new Date(a.isoDate).getTime() : 0;
      const db = b.isoDate ? new Date(b.isoDate).getTime() : 0;
      return db - da;
    });

  return { items, categories };
}

