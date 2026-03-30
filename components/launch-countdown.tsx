"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

const TARGET_MONTH_INDEX = 3; // April is month index 3.
const TARGET_DAY = 15;

function getTargetDate(now: Date): Date {
  const currentYear = now.getFullYear();
  const targetThisYear = new Date(currentYear, TARGET_MONTH_INDEX, TARGET_DAY, 0, 0, 0);
  return now > targetThisYear ? new Date(currentYear + 1, TARGET_MONTH_INDEX, TARGET_DAY, 0, 0, 0) : targetThisYear;
}

function getCountdownParts(targetDate: Date): CountdownParts {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isComplete: false };
}

function formatUnit(value: number): string {
  return value.toString().padStart(2, "0");
}

/** Google Calendar expects UTC times as YYYYMMDDTHHmmssZ */
function formatGoogleCalendarDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");
}

/** Event starts 1 hour before launch; 30-minute slot so the reminder time is clear in Calendar */
function buildGoogleCalendarReminderUrl(launchDate: Date): string {
  const oneHourMs = 60 * 60 * 1000;
  const start = new Date(launchDate.getTime() - oneHourMs);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const dates = `${formatGoogleCalendarDate(start)}/${formatGoogleCalendarDate(end)}`;
  const text = "Garfield ($GARFIELD) — launch in 1 hour";
  const details =
    "Official launch is at midnight local time on April 15. This event is your 1-hour heads-up — add a notification in Google Calendar if you want an alert at this time.";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}&dates=${encodeURIComponent(dates)}`;
}

export default function LaunchCountdown() {
  const targetDate = useMemo(() => getTargetDate(new Date()), []);
  const [countdown, setCountdown] = useState<CountdownParts>(() => getCountdownParts(targetDate));

  const calendarUrl = buildGoogleCalendarReminderUrl(getTargetDate(new Date()));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(getCountdownParts(targetDate));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [targetDate]);

  return (
    <a
      href={calendarUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Add a Google Calendar event 1 hour before launch"
      aria-label="Open Google Calendar to add a reminder one hour before the Garfield launch"
      className="group relative block max-w-xl cursor-pointer rounded-[1.75rem] outline-none transition-transform duration-200 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-garfield-orange focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
    >
      <div
        className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-garfield-orange/35 blur-2xl transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-2xl border-2 border-garfield-orange/70 bg-gradient-to-br from-garfield-orange/20 via-neutral-900/95 to-neutral-950 p-5 shadow-[0_0_48px_-12px_rgba(255,107,53,0.55)] ring-1 ring-garfield-orange/30 sm:p-6">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-garfield-orange/15 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-garfield-orange sm:text-xs">Launch countdown</p>
            <p className="mt-1 text-lg font-bold text-white sm:text-xl">
              April <span className="text-garfield-orange">15</span>
            </p>
          </div>
          <span className="inline-flex w-fit shrink-0 rounded-full border border-garfield-orange/50 bg-garfield-orange/15 px-3 py-1 text-xs font-semibold text-garfield-orange">
            Save the date
          </span>
        </div>
        {countdown.isComplete ? (
          <p className="relative mt-5 text-center text-2xl font-bold tracking-tight text-garfield-orange drop-shadow-[0_0_24px_rgba(255,107,53,0.45)] sm:text-3xl">
            Launched
          </p>
        ) : (
          <div className="relative mt-5 grid grid-cols-4 gap-2 sm:gap-3">
            {(
              [
                ["Days", countdown.days],
                ["Hours", countdown.hours],
                ["Minutes", countdown.minutes],
                ["Seconds", countdown.seconds],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-garfield-orange/40 bg-neutral-950/80 p-2.5 text-center shadow-inner shadow-black/40 ring-1 ring-white/5 sm:p-3"
              >
                <p className="font-mono text-2xl font-bold tabular-nums tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,107,53,0.35)] sm:text-3xl">
                  {formatUnit(value)}
                </p>
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-garfield-orange/90 sm:text-[11px]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}
        <div
          className="relative mt-4 rounded-xl border border-garfield-orange/45 bg-garfield-orange/10 px-3 py-2.5 text-center shadow-inner shadow-black/20 sm:px-4 sm:py-3"
          role="note"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-garfield-orange sm:text-sm">Don&apos;t miss it</p>
          <p className="mt-1.5 text-sm font-semibold leading-snug text-white sm:text-base">
            Set a Google Calendar alarm{" "}
            <span className="text-garfield-orange">by clicking this countdown</span>
            <span className="font-normal text-neutral-300"> — reminder </span>
            <span className="font-bold text-white">1 hour before launch</span>
          </p>
        </div>
      </div>
    </a>
  );
}
