"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core";
import { createClient } from "@supabase/supabase-js";
import {
  CalendarDays,
  Plus,
  Users,
  Clock,
  MapPin,
  X,
  Trash2,
  PartyPopper,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type EventType =
  | "Meeting"
  | "Event"
  | "Birthday"
  | "Shoot"
  | "Deadline"
  | "Travel"
  | "Other";

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  description?: string;
  location?: string;
  eventType?: EventType | string;
  recurrence?: string;
  recurrenceGroupId?: string | null;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  classNames?: string[];
};

type CalendarRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_at: string;
  end_at: string | null;
  event_type: string | null;
  recurrence: string | null;
  recurrence_group_id: string | null;
};

function NebulaFull() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-neutral-950" />
      <div className="absolute -top-72 left-[6%] h-[980px] w-[980px] rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.22),transparent_64%)] blur-3xl" />
      <div className="absolute -top-64 right-[4%] h-[1020px] w-[1020px] rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.18),transparent_66%)] blur-3xl" />
      <div className="absolute -bottom-80 left-[28%] h-[1100px] w-[1100px] rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.13),transparent_68%)] blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.58)_72%,rgba(0,0,0,0.9)_100%)]" />
    </div>
  );
}

function getEventStyle(type: string) {
  const normalized = type.toLowerCase();

  if (normalized === "meeting") {
    return {
      backgroundColor: "rgba(255,196,92,0.30)",
      borderColor: "rgba(255,196,92,0.85)",
      classNames: ["event-glow-gold"],
    };
  }

  if (normalized === "event") {
    return {
      backgroundColor: "rgba(255,80,100,0.28)",
      borderColor: "rgba(255,80,100,0.85)",
      classNames: ["event-glow-red"],
    };
  }

  if (normalized === "birthday") {
    return {
      backgroundColor: "rgba(255,255,255,0.12)",
      borderColor: "rgba(255,255,255,0.35)",
      classNames: ["event-glow-rainbow"],
    };
  }

  if (normalized === "shoot") {
    return {
      backgroundColor: "rgba(0,220,170,0.28)",
      borderColor: "rgba(0,220,170,0.82)",
      classNames: ["event-glow-green"],
    };
  }

  if (normalized === "deadline") {
    return {
      backgroundColor: "rgba(0,180,255,0.28)",
      borderColor: "rgba(0,180,255,0.82)",
      classNames: ["event-glow-blue"],
    };
  }

  if (normalized === "travel") {
    return {
      backgroundColor: "rgba(179,106,255,0.30)",
      borderColor: "rgba(179,106,255,0.82)",
      classNames: ["event-glow-purple"],
    };
  }

  return {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.25)",
    classNames: ["event-glow-silver"],
  };
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function buildRecurringRows(base: Omit<CalendarRow, "id">, recurrence: string) {
  if (recurrence === "none") return [base];

  const rows: Omit<CalendarRow, "id">[] = [];
  const startDate = new Date(base.start_at);
  const endDate = base.end_at ? new Date(base.end_at) : null;
  const groupId = crypto.randomUUID();

  const repeatEveryDays =
    recurrence === "daily"
      ? 1
      : recurrence === "weekly"
      ? 7
      : recurrence === "bi-weekly"
      ? 14
      : recurrence === "monthly"
      ? 30
      : recurrence === "yearly"
      ? 365
      : 0;

  if (!repeatEveryDays) return [base];

  for (let i = 0; i < 365; i += repeatEveryDays) {
    const occurrenceStart = addDays(startDate, i);
    const occurrenceEnd = endDate ? addDays(endDate, i) : null;

    rows.push({
      ...base,
      start_at: occurrenceStart.toISOString(),
      end_at: occurrenceEnd?.toISOString() ?? null,
      recurrence,
      recurrence_group_id: groupId,
    });
  }

  return rows;
}

function rowToEvent(row: CalendarRow): CalendarEvent {
  const style = getEventStyle(row.event_type || "Other");

  return {
    id: row.id,
    title: row.title,
    start: row.start_at,
    end: row.end_at || undefined,
    description: row.description || "",
    location: row.location || "",
    eventType:
      row.recurrence && row.recurrence !== "none"
        ? `${row.event_type || "Other"} • Repeats ${row.recurrence}`
        : row.event_type || "Other",
    recurrence: row.recurrence || "none",
    recurrenceGroupId: row.recurrence_group_id,
    textColor: "#ffffff",
    ...style,
  };
}

function formatTimeLabel(value: string) {
  if (!value) return "";

  const [hourRaw, minute] = value.split(":");
  const hour = Number(hourRaw);
  const hour12 = hour % 12 || 12;
  const ampm = hour < 12 ? "AM" : "PM";

  return `${hour12}:${minute} ${ampm}`;
}

function DateTimePicker({
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
  required,
}: {
  label: string;
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  required?: boolean;
}) {
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  const times = useMemo(() => {
    const list: { label: string; value: string }[] = [];

    for (let h = 0; h < 24; h++) {
      for (const m of [0, 15, 30, 45]) {
        const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        list.push({ label: formatTimeLabel(value), value });
      }
    }

    return list;
  }, []);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="mb-2 text-xs font-semibold tracking-[0.18em] text-white/45">
        {label}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenDate((p) => !p);
              setOpenTime(false);
            }}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-left text-sm text-white/85 hover:bg-black/45"
          >
            {date || "Select date"}
          </button>

          {openDate && (
            <div className="absolute left-0 top-full z-50 mt-2 rounded-2xl border border-white/10 bg-neutral-950 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
              <input
                required={required}
                type="date"
                value={date}
                onChange={(e) => {
                  onDateChange(e.target.value);
                  setOpenDate(false);
                }}
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none"
              />
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenTime((p) => !p);
              setOpenDate(false);
            }}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-left text-sm text-white/85 hover:bg-black/45"
          >
            {time ? formatTimeLabel(time) : "Select time"}
          </button>

          {openTime && (
            <div className="absolute right-0 top-full z-50 mt-2 max-h-64 w-44 overflow-y-auto rounded-2xl border border-white/10 bg-neutral-950 p-2 shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
              {times.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    onTimeChange(t.value);
                    setOpenTime(false);
                  }}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm text-white/75 hover:bg-white/10 hover:text-white"
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {required && (
        <input
          required
          value={date && time ? `${date}T${time}` : ""}
          onChange={() => {}}
          className="pointer-events-none absolute opacity-0"
          tabIndex={-1}
        />
      )}
    </div>
  );
}

export default function AdminCalendarPage() {
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    eventType: "Meeting" as EventType,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    recurring: "none",
  });

  const loadEvents = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .order("start_at", { ascending: true });

    if (!error && data) {
      setEvents((data as CalendarRow[]).map(rowToEvent));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const stats = useMemo(
    () => [
      {
        icon: CalendarDays,
        label: "Company Events",
        value: loading ? "Loading..." : `${events.length} Scheduled`,
      },
      {
        icon: Users,
        label: "Team Visibility",
        value: "Company Wide",
      },
      {
        icon: PartyPopper,
        label: "Event Types",
        value: "Auto Colored",
      },
    ],
    [events.length, loading]
  );

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      location: "",
      eventType: "Meeting",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      recurring: "none",
    });
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const start = `${form.startDate}T${form.startTime}`;
    const end =
      form.endDate && form.endTime ? `${form.endDate}T${form.endTime}` : null;

    const baseRow: Omit<CalendarRow, "id"> = {
      title: form.title,
      description: form.description || null,
      location: form.location || null,
      start_at: new Date(start).toISOString(),
      end_at: end ? new Date(end).toISOString() : null,
      event_type: form.eventType,
      recurrence: form.recurring,
      recurrence_group_id: null,
    };

    const rowsToInsert = buildRecurringRows(baseRow, form.recurring);

    const { data, error } = await supabase
      .from("calendar_events")
      .insert(rowsToInsert)
      .select("*");

    if (!error && data) {
      setEvents((prev) => [...prev, ...(data as CalendarRow[]).map(rowToEvent)]);
      resetForm();
      setCreateOpen(false);
    }

    if (error) {
      console.error("Create event error:", error.message);
      alert(`Could not save event: ${error.message}`);
    }

    setSaving(false);
  };

  const deleteSelectedEvent = async () => {
    if (!selectedEvent) return;

    const deleteQuery = selectedEvent.recurrenceGroupId
      ? supabase
          .from("calendar_events")
          .delete()
          .eq("recurrence_group_id", selectedEvent.recurrenceGroupId)
      : supabase.from("calendar_events").delete().eq("id", selectedEvent.id);

    const { error } = await deleteQuery;

    if (!error) {
      if (selectedEvent.recurrenceGroupId) {
        setEvents((prev) =>
          prev.filter((ev) => ev.recurrenceGroupId !== selectedEvent.recurrenceGroupId)
        );
      } else {
        setEvents((prev) => prev.filter((ev) => ev.id !== selectedEvent.id));
      }

      setSelectedEvent(null);
    }

    if (error) {
      console.error("Delete event error:", error.message);
      alert(`Could not delete event: ${error.message}`);
    }
  };

  const handleEventClick = (arg: EventClickArg) => {
    const found = events.find((ev) => ev.id === arg.event.id);
    if (found) setSelectedEvent(found);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 px-4 py-10 text-white sm:px-6">
      <NebulaFull />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold tracking-[0.22em] text-white/65 backdrop-blur-md">
              <CalendarDays className="h-4 w-4" />
              SMC ADMIN
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
              Company Calendar
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
              Manage meetings, shoots, birthdays, deadlines, recurring events, and internal team schedules.
            </p>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/30 px-6 py-3 text-sm font-semibold text-white/95 shadow-[0_0_32px_rgba(0,180,255,0.16)] transition hover:bg-black/45"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_75px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-md"
            >
              <div className="absolute -inset-8 opacity-40 blur-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(179,106,255,0.28),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(0,180,255,0.22),transparent_58%)]" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-black/25">
                  <item.icon className="h-5 w-5 text-white/90" />
                </div>
                <div>
                  <div className="text-sm text-white/55">{item.label}</div>
                  <div className="mt-1 text-lg font-semibold text-white/95">
                    {item.value}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_28px_120px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-6">
          <div className="pointer-events-none absolute -inset-10 opacity-75 blur-3xl bg-[radial-gradient(circle_at_20%_20%,rgba(179,106,255,0.22),transparent_45%),radial-gradient(circle_at_80%_25%,rgba(0,180,255,0.22),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(255,196,92,0.13),transparent_48%)]" />

          <div className="relative">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="auto"
              eventClick={handleEventClick}
              dayMaxEvents={3}
              moreLinkClick="popover"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
            />
          </div>
        </section>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-neutral-950/95 p-6 shadow-[0_30px_140px_rgba(0,0,0,0.75)]">
            <div className="absolute -inset-10 opacity-60 blur-3xl bg-[radial-gradient(circle_at_20%_20%,rgba(0,180,255,0.20),transparent_45%),radial-gradient(circle_at_80%_40%,rgba(179,106,255,0.22),transparent_48%)]" />

            <div className="relative">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold tracking-[0.22em] text-white/50">
                    NEW EVENT
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold">Create Company Event</h2>
                </div>

                <button
                  onClick={() => setCreateOpen(false)}
                  className="rounded-full border border-white/10 bg-black/25 p-2 text-white/70 hover:bg-black/40"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={createEvent} className="grid gap-3">
                <input
                  required
                  placeholder="Event title"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-white/25"
                />

                <textarea
                  placeholder="Event details"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-white/25"
                />

                <input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-white/25"
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DateTimePicker
                    label="Start"
                    required
                    date={form.startDate}
                    time={form.startTime}
                    onDateChange={(value) =>
                      setForm((p) => ({ ...p, startDate: value }))
                    }
                    onTimeChange={(value) =>
                      setForm((p) => ({ ...p, startTime: value }))
                    }
                  />

                  <DateTimePicker
                    label="End"
                    date={form.endDate}
                    time={form.endTime}
                    onDateChange={(value) =>
                      setForm((p) => ({ ...p, endDate: value }))
                    }
                    onTimeChange={(value) =>
                      setForm((p) => ({ ...p, endTime: value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select
                    value={form.eventType}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        eventType: e.target.value as EventType,
                      }))
                    }
                    className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none focus:border-white/25"
                  >
                    <option>Meeting</option>
                    <option>Event</option>
                    <option>Birthday</option>
                    <option>Shoot</option>
                    <option>Deadline</option>
                    <option>Travel</option>
                    <option>Other</option>
                  </select>

                  <select
                    value={form.recurring}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, recurring: e.target.value }))
                    }
                    className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none focus:border-white/25"
                  >
                    <option value="none">Does not repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateOpen(false)}
                    className="rounded-full border border-white/10 bg-black/20 px-5 py-2.5 text-sm font-semibold text-white/70 hover:bg-black/35"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-sm font-semibold text-white/95 shadow-[0_0_30px_rgba(0,180,255,0.16)] hover:bg-white/[0.12] disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/95 p-6 shadow-[0_30px_140px_rgba(0,0,0,0.75)]">
            <div className="absolute -inset-10 opacity-60 blur-3xl bg-[radial-gradient(circle_at_20%_20%,rgba(179,106,255,0.22),transparent_45%),radial-gradient(circle_at_80%_40%,rgba(0,180,255,0.20),transparent_48%)]" />

            <div className="relative">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold tracking-[0.22em] text-white/50">
                    EVENT DETAILS
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold">{selectedEvent.title}</h2>
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-full border border-white/10 bg-black/25 p-2 text-white/70 hover:bg-black/40"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-white/75">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="h-4 w-4" />
                    Time
                  </div>
                  <div className="mt-2">
                    {new Date(selectedEvent.start).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {selectedEvent.end &&
                      ` – ${new Date(selectedEvent.end).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}`}
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                    <div className="mt-2">{selectedEvent.location}</div>
                  </div>
                )}

                {selectedEvent.eventType && (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-white/90">Type</div>
                    <div className="mt-2">{selectedEvent.eventType}</div>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-white/90">Details</div>
                    <div className="mt-2 leading-relaxed">{selectedEvent.description}</div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={deleteSelectedEvent}
                  className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-100 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                  {selectedEvent.recurrenceGroupId
                    ? "Delete Recurring Series"
                    : "Delete Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .fc {
          color: rgba(255, 255, 255, 0.9);
          --fc-border-color: rgba(255, 255, 255, 0.1);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: rgba(255, 255, 255, 0.04);
          --fc-today-bg-color: rgba(0, 180, 255, 0.1);
          --fc-button-bg-color: rgba(0, 0, 0, 0.35);
          --fc-button-border-color: rgba(255, 255, 255, 0.12);
          --fc-button-hover-bg-color: rgba(255, 255, 255, 0.1);
          --fc-button-active-bg-color: rgba(0, 180, 255, 0.22);
        }

        .fc .fc-toolbar-title {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: rgba(255, 255, 255, 0.96);
          text-shadow: 0 0 28px rgba(0, 180, 255, 0.18);
        }

        .fc .fc-button {
          border-radius: 999px !important;
          padding: 0.55rem 0.9rem !important;
          font-size: 0.78rem !important;
          font-weight: 700 !important;
          text-transform: capitalize !important;
        }

        .fc .fc-scrollgrid {
          border-radius: 1.5rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          background: rgba(0, 0, 0, 0.18);
        }

        .fc .fc-col-header-cell {
          background: rgba(255, 255, 255, 0.045);
          padding: 0.85rem 0;
        }

        .fc .fc-col-header-cell-cushion {
          color: rgba(255, 255, 255, 0.62);
          font-size: 0.73rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .fc .fc-daygrid-day {
          background: rgba(255, 255, 255, 0.018);
        }

        .fc .fc-daygrid-day:hover {
          background: rgba(255, 255, 255, 0.045);
        }

        .fc .fc-daygrid-day-number {
          padding: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .fc .fc-event {
          cursor: pointer;
          border-radius: 999px;
          padding: 0.2rem 0.45rem;
          font-size: 0.75rem;
          font-weight: 700;
          backdrop-filter: blur(10px);
        }

        .fc .fc-daygrid-more-link {
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.72rem;
          font-weight: 700;
          padding-left: 0.45rem;
        }

        .fc .fc-popover {
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(10, 10, 10, 0.96);
          color: white;
          box-shadow: 0 22px 90px rgba(0, 0, 0, 0.7);
        }

        .fc .fc-popover-header {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .fc .event-glow-gold {
          box-shadow: 0 0 24px rgba(255, 196, 92, 0.28);
        }

        .fc .event-glow-red {
          box-shadow: 0 0 24px rgba(255, 80, 100, 0.28);
        }

        .fc .event-glow-green {
          box-shadow: 0 0 24px rgba(0, 220, 170, 0.28);
        }

        .fc .event-glow-blue {
          box-shadow: 0 0 24px rgba(0, 180, 255, 0.28);
        }

        .fc .event-glow-purple {
          box-shadow: 0 0 24px rgba(179, 106, 255, 0.28);
        }

        .fc .event-glow-silver {
          box-shadow: 0 0 24px rgba(255, 255, 255, 0.15);
        }

        .fc .event-glow-rainbow {
          background: linear-gradient(
            90deg,
            rgba(255, 80, 100, 0.42),
            rgba(255, 196, 92, 0.42),
            rgba(0, 220, 170, 0.42),
            rgba(0, 180, 255, 0.42),
            rgba(179, 106, 255, 0.42)
          ) !important;
          border-color: rgba(255, 255, 255, 0.38) !important;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.18);
        }

        .fc a {
          color: inherit;
          text-decoration: none;
        }

        option {
          background: #0a0a0a;
          color: white;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .fc .fc-toolbar {
            flex-direction: column;
            gap: 0.85rem;
          }
        }
      `}</style>
    </main>
  );
}