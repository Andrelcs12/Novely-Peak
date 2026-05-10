import { formatInTimeZone } from "date-fns-tz";

const TIMEZONE =
  "America/Sao_Paulo";

export function getTodayKey() {
  return formatInTimeZone(
    new Date(),
    TIMEZONE,
    "yyyy-MM-dd",
  );
}

export function toDayKey(
  date: Date,
) {
  return formatInTimeZone(
    date,
    TIMEZONE,
    "yyyy-MM-dd",
  );
}

export function getStartOfDay() {
  const now = new Date();

  const date = new Date(
    now.toLocaleString("en-US", {
      timeZone: TIMEZONE,
    }),
  );

  date.setHours(0, 0, 0, 0);

  return date;
}

export function getEndOfDay() {
  const now = new Date();

  const date = new Date(
    now.toLocaleString("en-US", {
      timeZone: TIMEZONE,
    }),
  );

  date.setHours(
    23,
    59,
    59,
    999,
  );

  return date;
}

export function isSameDay(
  dateA?: Date | null,
  dateB?: Date | null,
) {
  if (!dateA || !dateB) {
    return false;
  }

  return (
    toDayKey(dateA) ===
    toDayKey(dateB)
  );
}

export function getYesterdayKey() {
  const now = new Date();

  now.setDate(now.getDate() - 1);

  return formatInTimeZone(
    now,
    TIMEZONE,
    "yyyy-MM-dd",
  );
}