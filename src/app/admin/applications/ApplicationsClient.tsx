"use client";

import { useEffect, useState } from "react";

type Application = {
  timestamp: string;
  name: string;
  role: string;
  viewLink: string;
  applicationId: string;
  payload: string;
};

export default function ApplicationsClient() {
  const [apps, setApps] = useState<Application[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setApps(data.items);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Applicants</h1>

      <div className="space-y-4">
        {apps.map((app) => (
          <div
            key={app.applicationId}
            className="border border-white/10 rounded-xl"
          >
            <button
              onClick={() =>
                setOpen(open === app.applicationId ? null : app.applicationId)
              }
              className="w-full text-left p-4 flex justify-between"
            >
              <div>
                <div className="font-semibold">{app.name}</div>
                <div className="text-sm text-white/60">{app.role}</div>
              </div>

              <div>{open === app.applicationId ? "▲" : "▼"}</div>
            </button>

            {open === app.applicationId && (
              <div className="p-4 border-t border-white/10">
                <pre className="text-sm whitespace-pre-wrap">
                  {app.payload}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}