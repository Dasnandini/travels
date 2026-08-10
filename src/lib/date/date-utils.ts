import { Weekday } from "@/generated/prisma/enums";

export const DEFAULT_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Kolkata";

/**
 * Gets current date in YYYY-MM-DD format for a given timezone.
 */
export function getTodayDateString(timeZone: string = DEFAULT_TIMEZONE): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

/**
 * Checks if a string is a valid YYYY-MM-DD calendar date.
 */
export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (month < 1 || month > 12) return false;

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Checks if a YYYY-MM-DD date string is in the past relative to configured timezone.
 */
export function isPastDate(dateStr: string, timeZone: string = DEFAULT_TIMEZONE): boolean {
  const todayStr = getTodayDateString(timeZone);
  return dateStr < todayStr;
}

/**
 * Returns Weekday enum for a given YYYY-MM-DD date string in configured timezone.
 */
export function getWeekdayFromDateString(
  dateStr: string,
  timeZone: string = DEFAULT_TIMEZONE
): Weekday {
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  // Use 12:00 UTC to avoid daylight saving or boundary shifts when Intl formats in timeZone
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
  });
  const weekdayName = formatter.format(date).toUpperCase();
  return weekdayName as Weekday;
}

/**
 * Calculates duration in minutes between departure time and arrival time (HH:mm format).
 * Properly handles overnight journeys crossing midnight.
 */
export function calculateDurationMinutes(departureTime: string, arrivalTime: string): number {
  const [depH, depM] = departureTime.split(":").map(Number);
  const [arrH, arrM] = arrivalTime.split(":").map(Number);

  const depMins = depH * 60 + depM;
  let arrMins = arrH * 60 + arrM;

  if (arrMins < depMins) {
    arrMins += 24 * 60; // Crosses midnight into next day
  }

  return arrMins - depMins;
}
