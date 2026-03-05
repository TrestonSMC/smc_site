// src/app/admin/applications/[id]/page.tsx
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ApplicationViewer({ params }: Props) {
  const { id } = await params;

  if (!id) return notFound();

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">SMC Application</h1>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/70 mb-2">Application ID</p>
          <p className="font-mono text-lg break-all">{id}</p>
        </div>

        <div className="mt-8 text-white/60">
          Next step: load the applicant payload from Sheets and render it here.
        </div>
      </div>
    </main>
  );
}