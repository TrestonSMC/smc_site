// src/app/careers/page.tsx

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CAREER_ROLES } from "@/lib/careers";

type RoleTypeFilter = "All" | "Contract" | "Part-time" | "Full-time" | "Per-project" | "Remote" | "Hybrid" | "On-site";

export default function CareersPage() {
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<RoleTypeFilter>("All");
  const [sort, setSort] = useState<"Relevance" | "A-Z">("Relevance");

  const roles = useMemo(() => {
    const query = q.trim().toLowerCase();

    const score = (text: string) => {
      if (!query) return 0;
      const t = text.toLowerCase();
      if (t === query) return 10;
      if (t.includes(query)) return 4;
      return 0;
    };

    let filtered = CAREER_ROLES.filter((role) => {
      const haystack = [
        role.title,
        role.location,
        role.type,
        role.summary,
        ...(role.bullets || []),
        ...(role.responsibilities || []),
        ...(role.requirements || []),
        ...(role.niceToHave || []),
        ...(role.tools || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !query || haystack.includes(query);

      // type filter matches against role.type + role.location (so Remote/Hybrid works too)
      const matchesType =
        typeFilter === "All" ||
        role.type.toLowerCase().includes(typeFilter.toLowerCase()) ||
        role.location.toLowerCase().includes(typeFilter.toLowerCase());

      return matchesQuery && matchesType;
    });

    if (sort === "A-Z") {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (query) {
      // relevance sort (basic scoring across fields)
      filtered = filtered
        .map((r) => {
          const s =
            score(r.title) * 3 +
            score(r.type) * 2 +
            score(r.location) * 2 +
            score(r.summary) +
            (r.bullets?.reduce((acc, b) => acc + score(b), 0) || 0);
          return { r, s };
        })
        .sort((a, b) => b.s - a.s)
        .map(({ r }) => r);
    }

    return filtered;
  }, [q, typeFilter, sort]);

  const countLabel = `${roles.length} role${roles.length === 1 ? "" : "s"}`;

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="text-xs font-semibold tracking-[0.22em] text-white/60">
              CAREERS
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
              Join Slater Media Company
            </h1>
            <p className="mt-3 max-w-2xl text-white/70 leading-relaxed">
              We’re building a premium creative + dev studio. Search and filter open roles below.
            </p>
          </div>

          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/[0.09] transition"
          >
            Have questions? Contact →
          </Link>
        </div>

        {/* Search + Filters */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.06] p-4 sm:p-5 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="flex-1">
              <label className="sr-only" htmlFor="career-search">
                Search roles
              </label>
              <input
                id="career-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search roles (e.g. editor, remote, reels, adobe, photography)…"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/95 placeholder:text-white/40 outline-none focus:border-white/25 focus:bg-black/28 transition"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div>
                <label className="sr-only" htmlFor="type-filter">
                  Filter
                </label>
                <select
                  id="type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as RoleTypeFilter)}
                  className="w-full sm:w-[220px] rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/90 outline-none focus:border-white/25 focus:bg-black/28 transition"
                >
                  <option value="All">All roles</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Per-project">Per-project</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="sr-only" htmlFor="sort">
                  Sort
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "Relevance" | "A-Z")}
                  className="w-full sm:w-[180px] rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/90 outline-none focus:border-white/25 focus:bg-black/28 transition"
                >
                  <option value="Relevance">Sort: Relevance</option>
                  <option value="A-Z">Sort: A–Z</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setTypeFilter("All");
                  setSort("Relevance");
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/[0.09] transition"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-white/60">{countLabel}</div>

            {(q.trim() || typeFilter !== "All") && (
              <div className="flex flex-wrap gap-2">
                {q.trim() && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-3 py-1 text-xs font-semibold text-white/75">
                    Search: “{q.trim()}”
                  </span>
                )}
                {typeFilter !== "All" && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-3 py-1 text-xs font-semibold text-white/75">
                    Filter: {typeFilter}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {roles.map((role) => (
            <Link
              key={role.slug}
              href={`/careers/${role.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md hover:bg-white/[0.075] transition"
            >
              <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(900px_circle_at_30%_10%,rgba(179,106,255,0.16),transparent_55%),radial-gradient(900px_circle_at_70%_30%,rgba(0,180,255,0.14),transparent_58%),radial-gradient(900px_circle_at_50%_90%,rgba(255,196,92,0.10),transparent_55%)]" />
              <div className="relative">
                <div className="text-sm font-semibold text-white/95">{role.title}</div>
                <div className="mt-1 text-sm text-white/65">
                  {role.location} • {role.type}
                </div>

                <p className="mt-4 text-sm text-white/75 leading-relaxed">
                  {role.summary}
                </p>

                <ul className="mt-4 space-y-2">
                  {role.bullets.slice(0, 3).map((b) => (
                    <li key={b} className="text-sm text-white/70">
                      • {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-4 py-2 text-sm font-semibold text-white/85 group-hover:bg-black/30 transition">
                  View role →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {roles.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center text-white/70">
            <div className="text-lg font-semibold text-white/90">No roles found</div>
            <div className="mt-2 text-sm">
              Try a different keyword (ex: “remote”, “editor”, “photoshop”) or clear filters.
            </div>
          </div>
        )}

        <div className="mt-10 text-sm text-white/55">
          Tip: include portfolio links + availability + city.
        </div>
      </div>
    </main>
  );
}

