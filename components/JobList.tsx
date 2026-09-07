"use client";

import { useMemo, useState } from "react";
import type { JobMatch } from "../lib/job-search";

export default function JobList({ jobs }: { jobs: JobMatch[] }) {
  const [minScore, setMinScore] = useState(80);

  const filtered = useMemo(
    () => jobs.filter((j) => j.match_score >= minScore),
    [jobs, minScore]
  );

  return (
    <div>
      <div className="score-filter">
        <label>
          Score minimum : <strong>{minScore}%</strong>
        </label>
        <input
          type="range"
          min={75}
          max={100}
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
        />
      </div>

      {filtered.length === 0 && (
        <p className="empty">Aucune offre au-dessus de ce seuil pour l'instant.</p>
      )}

      <div className="list">
        {filtered.map((job, i) => (
          <a
            key={i}
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="job-item"
          >
            <div className="item-meta">
              <span className="job-score">{job.match_score}%</span>
              <span className="item-source">{job.company}</span>
              <span className="item-source">{job.sector}</span>
              <span className="item-time">{job.location}</span>
            </div>
            <div className="item-title">{job.title}</div>
            <div className="job-justification">{job.justification}</div>
            <div className="job-footer">
              via {job.source} · {job.date_posted}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

