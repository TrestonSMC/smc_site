// src/app/careers/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { getRole } from "@/lib/careers";

export default async function CareerRolePage({
  params,
}: {
  // Next 16 may pass params as a Promise
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await Promise.resolve(params);
  const role = getRole(slug);

  if (!role) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link href="/careers" className="text-sm text-white/65 hover:text-white/90 transition">
            ← Back to Careers
          </Link>

          <Link
            href={`/careers/apply?slug=${encodeURIComponent(role.slug)}`}
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/[0.09] transition"
          >
            Apply now →
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-7 sm:p-10 backdrop-blur-md relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(900px_circle_at_30%_10%,rgba(179,106,255,0.16),transparent_55%),radial-gradient(900px_circle_at_70%_30%,rgba(0,180,255,0.14),transparent_58%),radial-gradient(900px_circle_at_50%_90%,rgba(255,196,92,0.10),transparent_55%)]" />
          <div className="relative">
            <div className="text-xs font-semibold tracking-[0.22em] text-white/60">ROLE</div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
              {role.title}
            </h1>
            <div className="mt-3 text-sm text-white/65">
              {role.location} • {role.type}
            </div>

            <p className="mt-6 text-base text-white/75 leading-relaxed">
              {role.summary}
            </p>

            {/* In-depth description */}
            <div className="mt-8 space-y-4">
              {role.description?.map((p, i) => (
                <p key={i} className="text-sm sm:text-base text-white/75 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Quick bullets */}
            {role.bullets?.length ? (
              <div className="mt-8">
                <div className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                  At a glance
                </div>
                <ul className="mt-4 space-y-2">
                  {role.bullets.map((b) => (
                    <li key={b} className="text-sm text-white/70">
                      • {b}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Sections */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="Responsibilities" items={role.responsibilities} />
              <Section title="Requirements" items={role.requirements} />
              <Section title="Nice to have" items={role.niceToHave} />
              <Section title="Tools / stack" items={role.tools} />
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={`/careers/apply?slug=${encodeURIComponent(role.slug)}`}
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/[0.09] transition"
              >
                Apply for {role.title} →
              </Link>

              <Link
                href="/careers"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-black/20 px-6 py-3 text-sm font-semibold text-white/80 hover:bg-black/30 transition"
              >
                View all roles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <div className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
        {title}
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((t) => (
          <li key={t} className="text-sm text-white/75 leading-relaxed">
            • {t}
          </li>
        ))}
      </ul>
    </div>
  );
}








