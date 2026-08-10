"use client";

import React from "react";
import { Weekday } from "@/generated/prisma/enums";

const ALL_WEEKDAYS: { day: Weekday; shortLabel: string; fullLabel: string }[] = [
  { day: Weekday.MONDAY, shortLabel: "Mon", fullLabel: "Monday" },
  { day: Weekday.TUESDAY, shortLabel: "Tue", fullLabel: "Tuesday" },
  { day: Weekday.WEDNESDAY, shortLabel: "Wed", fullLabel: "Wednesday" },
  { day: Weekday.THURSDAY, shortLabel: "Thu", fullLabel: "Thursday" },
  { day: Weekday.FRIDAY, shortLabel: "Fri", fullLabel: "Friday" },
  { day: Weekday.SATURDAY, shortLabel: "Sat", fullLabel: "Saturday" },
  { day: Weekday.SUNDAY, shortLabel: "Sun", fullLabel: "Sunday" },
];

interface OperatingDaysSelectorProps {
  selectedDays: Weekday[];
  onChange: (days: Weekday[]) => void;
  disabled?: boolean;
}

export function OperatingDaysSelector({
  selectedDays,
  onChange,
  disabled,
}: OperatingDaysSelectorProps) {
  const toggleDay = (day: Weekday) => {
    if (disabled) return;
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  const selectEveryDay = () => {
    if (disabled) return;
    onChange(ALL_WEEKDAYS.map((w) => w.day));
  };

  const selectWeekdaysOnly = () => {
    if (disabled) return;
    onChange([
      Weekday.MONDAY,
      Weekday.TUESDAY,
      Weekday.WEDNESDAY,
      Weekday.THURSDAY,
      Weekday.FRIDAY,
    ]);
  };

  const selectWeekendsOnly = () => {
    if (disabled) return;
    onChange([Weekday.SATURDAY, Weekday.SUNDAY]);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700">
          Operating Days <span className="text-red-500">*</span>
        </label>

        {!disabled && (
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#002B66]">
            <button
              type="button"
              onClick={selectEveryDay}
              className="hover:underline text-[#002B66]"
            >
              Every Day
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={selectWeekdaysOnly}
              className="hover:underline text-slate-600"
            >
              Weekdays
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={selectWeekendsOnly}
              className="hover:underline text-slate-600"
            >
              Weekends
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {ALL_WEEKDAYS.map(({ day, shortLabel, fullLabel }) => {
          const isSelected = selectedDays.includes(day);

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => toggleDay(day)}
              title={fullLabel}
              className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all border ${
                isSelected
                  ? "bg-[#002B66] text-white border-blue-950 shadow-sm"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
              }`}
            >
              {shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
