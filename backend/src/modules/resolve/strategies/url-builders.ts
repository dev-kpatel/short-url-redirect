// src/modules/resolve/strategies/url-builders.ts

import { CalendarEvent } from "../types.js";

/** ---------- Formatting helpers ---------- **/

// YYYYMMDDTHHMMSSZ (UTC)
function toCompactUtc(dt: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    dt.getUTCFullYear(),
    pad(dt.getUTCMonth() + 1),
    pad(dt.getUTCDate()),
    "T",
    pad(dt.getUTCHours()),
    pad(dt.getUTCMinutes()),
    pad(dt.getUTCSeconds()),
    "Z",
  ].join("");
}

// ISO 8601 (UTC) - includes trailing Z
function toIsoUtc(dt: Date): string {
  return dt.toISOString();
}

// Escape text for ICS (RFC5545)
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\") // backslash
    .replace(/\n/g, "\\n")  // newline
    .replace(/,/g, "\\,")   // comma
    .replace(/;/g, "\\;");  // semicolon
}

// Fold long ICS lines at 75 octets (simple UTF-16 naive approach; good enough for most)
function foldIcsLine(line: string): string {
  const limit = 75;
  if (line.length <= limit) return line;
  const parts: string[] = [];
  let i = 0;
  while (i < line.length) {
    const chunk = line.slice(i, i + limit);
    parts.push((i === 0 ? "" : " ") + chunk);
    i += limit;
  }
  return parts.join("\r\n");
}

/** ---------- URL builders ---------- **/

/**
 * Google Calendar "render" URL.
 * Docs: https://developers.google.com/calendar/api/guides/create-events-quickadd (UI deeplink format)
 * Examples use: action=TEMPLATE, text, dates=START/END, details, location, ctz
 */
export function buildGoogleUrl(ev: CalendarEvent): string {
  const base = new URL("https://calendar.google.com/calendar/render");
  base.searchParams.set("action", "TEMPLATE");
  base.searchParams.set("text", ev.title || "");
  base.searchParams.set("dates", `${toCompactUtc(ev.start)}/${toCompactUtc(ev.end)}`);
  if (ev.description) base.searchParams.set("details", ev.description);
  if (ev.location) base.searchParams.set("location", ev.location);
  if (ev.tz) base.searchParams.set("ctz", ev.tz); // display timezone
  if (ev.recurrence) base.searchParams.set("recur", `RRULE:FREQ=${ev.frequency};INTERVAL=${ev.rinterval};COUNT=${ev.rcount}`);
  return base.toString();
}

/**
 * Yahoo Calendar URL.
 * Common params: v=60, title, st (start UTC), et (end UTC), desc, in_loc
 */
export function buildYahooUrl(ev: CalendarEvent): string {
  const base = new URL("https://calendar.yahoo.com/");
  base.searchParams.set("v", "60");
  base.searchParams.set("title", ev.title || "");
  base.searchParams.set("st", toCompactUtc(ev.start)); // UTC Z
  base.searchParams.set("et", toCompactUtc(ev.end));   // UTC Z
  if (ev.description) base.searchParams.set("desc", ev.description);
  if (ev.location) base.searchParams.set("in_loc", ev.location);
  if (ev.recurrence) base.searchParams.set("RPAT", `RRULE:FREQ=${ev.frequency};INTERVAL=${ev.rinterval};COUNT=${ev.rcount}`);
  return base.toString();
}

/**
 * Outlook Live (web) compose URL.
 * Params: path, rru=addevent (optional), subject, body, startdt, enddt, location, allday
 * Return = 'https://outlook.live.com/calendar/0/deeplink/compose?rru=addevent&path=/calendar/action/compose&startdt=&enddt=&subject=&body=&location=&allday=false&RPAT=01Wk&REND=20220708';

 */
export function buildOutlookUrl(ev: CalendarEvent): string {
  const base = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
  // These two help land on the compose screen in some scenarios
  base.searchParams.set("path", "/calendar/action/compose");
  base.searchParams.set("rru", "addevent");

  base.searchParams.set("subject", ev.title || "");
  if (ev.description) base.searchParams.set("body", ev.description);
  if (ev.location) base.searchParams.set("location", ev.location);

  base.searchParams.set("startdt", toIsoUtc(ev.start)); // ISO UTC
  base.searchParams.set("enddt", toIsoUtc(ev.end));     // ISO UTC
  base.searchParams.set("allday", "false");
  if (ev.recurrence) base.searchParams.set("recur", `RRULE:FREQ=${ev.frequency};INTERVAL=${ev.rinterval};COUNT=${ev.rcount}`);

  return base.toString();
}

/** ---------- ICS (.ics) generator ---------- **/

export function buildIcs(ev: CalendarEvent): string {
  const dtStamp = toCompactUtc(new Date());
  const dtStart = toCompactUtc(ev.start);
  const dtEnd = toCompactUtc(ev.end);
  const uid = `${ev.slug}-${dtStamp}@short-url`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//short-url-redirect//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    foldIcsLine(`UID:${uid}`),
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    foldIcsLine(`SUMMARY:${escapeIcsText(ev.title || "")}`),
    ...(ev.description ? [foldIcsLine(`DESCRIPTION:${escapeIcsText(ev.description)}`)] : []),
    ...(ev.location ? [foldIcsLine(`LOCATION:${escapeIcsText(ev.location)}`)] : []),
    ...(ev.recurrence ? [foldIcsLine(`RRULE:FREQ=${ev.frequency};INTERVAL=${ev.rinterval};COUNT=${ev.rcount}`)] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // ICS requires CRLF line endings
  return lines.join("\r\n") + "\r\n";
}
