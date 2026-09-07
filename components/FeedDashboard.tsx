"use client";

import { useMemo, useState } from "react";
import type { Item } from "../lib/rss";
import type { Category } from "../lib/feeds";

const URGENT_KEYWORDS = [
  "cve",
  "faille",
  "vulnérabilité",
  "vulnerability",
  "exploit",
  "ransomware",
  "zero-day",
  "0-day",
  "critique",
  "critical",
];

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "à l'instant";
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

export default function FeedDashboard({
  items,
  categories,
}: {
  items: Item[];
  categories: Category[];
}) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesTab = activeTab === "all" || it.categoryId === activeTab;
      const matchesQuery =
        query.trim() === "" ||
        it.title.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [items, activeTab, query]);

  const isUrgent = (title: string) =>
    URGENT_KEYWORDS.some((k) => title.toLowerCase().includes(k));

  return (
    <div>
      <div className="tabs">
        <button
          className={activeTab === "all" ? "tab active" : "tab"}
          onClick={() => setActiveTab("all")}
        >
          Tout
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={activeTab === c.id ? "tab active" : "tab"}
            onClick={() => setActiveTab(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <input
        className="search"
        type="text"
        placeholder="Filtrer par mot-clé..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="list">
        {filtered.length === 0 && (
          <p className="empty">Aucun article ne correspond.</p>
        )}
        {filtered.map((it, i) => (
          <a
            key={i}
            href={it.link}
            target="_blank"
            rel="noopener noreferrer"
            className={isUrgent(it.title) ? "item urgent" : "item"}
          >
            <div className="item-meta">
              <span className="item-source">{it.source}</span>
              <span className="item-time">{timeAgo(it.isoDate)}</span>
              {isUrgent(it.title) && <span className="badge">⚠ urgent</span>}
            </div>
            <div className="item-title">{it.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

