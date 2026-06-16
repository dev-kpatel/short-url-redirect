import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn, findInputError } from "@shared/lib";
import { InputError } from "./InputError";

interface DateTimePickerProps {
  name: string;
  id?: string;
  label?: string;
  required?: boolean;
}

export const DateTimePicker = ({ name, id, label, required }: DateTimePickerProps) => {
  const { register, setValue, watch, trigger, formState: { errors } } = useFormContext();
  const inputErrors = findInputError(errors, name);
  const isInvalid = !!inputErrors;

  const value = watch(name) as string | undefined;

  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Parse current value or default to now
  const parseLocalDateTime = (str: string | undefined) => {
    if (!str) return new Date();
    try {
      const [datePart, timePart] = str.split("T");
      if (!datePart) return new Date();
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute] = timePart ? timePart.split(":").map(Number) : [12, 0];
      return new Date(year, month - 1, day, hour, minute);
    } catch {
      return new Date();
    }
  };

  const initialDate = parseLocalDateTime(value);
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? initialDate : null);

  // Time state
  const [hour, setHour] = useState(initialDate.getHours() % 12 || 12);
  const [minute, setMinute] = useState(Math.round(initialDate.getMinutes() / 5) * 5 % 60); // Round to nearest 5 mins
  const [amPm, setAmPm] = useState(initialDate.getHours() >= 12 ? "PM" : "AM");

  // Sync state if value changes externally
  useEffect(() => {
    if (value) {
      const date = parseLocalDateTime(value);
      setSelectedDate(date);
      setCurrentYear(date.getFullYear());
      setCurrentMonth(date.getMonth());
      setHour(date.getHours() % 12 || 12);
      setMinute(date.getMinutes());
      setAmPm(date.getHours() >= 12 ? "PM" : "AM");
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const updateValue = (date: Date, h: number, m: number, ap: string) => {
    let rawHour = h;
    if (ap === "PM" && h < 12) rawHour += 12;
    if (ap === "AM" && h === 12) rawHour = 0;

    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), rawHour, m);
    setSelectedDate(newDate);

    // Format YYYY-MM-DDTHH:MM
    const pad = (n: number) => String(n).padStart(2, "0");
    const formatted = `${newDate.getFullYear()}-${pad(newDate.getMonth() + 1)}-${pad(newDate.getDate())}T${pad(newDate.getHours())}:${pad(newDate.getMinutes())}`;
    
    setValue(name, formatted, { shouldValidate: true, shouldDirty: true });
  };

  // Calendar calculations
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  interface DayItem {
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
  }

  const daysGrid: DayItem[] = [];
  // Prev month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    daysGrid.push({
      day: daysInPrevMonth - i,
      month: currentMonth === 0 ? 11 : currentMonth - 1,
      year: currentMonth === 0 ? currentYear - 1 : currentYear,
      isCurrentMonth: false,
    });
  }
  // Current month
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    daysGrid.push({
      day: i,
      month: currentMonth,
      year: currentYear,
      isCurrentMonth: true,
    });
  }
  // Next month padding
  const remaining = 42 - daysGrid.length;
  for (let i = 1; i <= remaining; i++) {
    daysGrid.push({
      day: i,
      month: currentMonth === 11 ? 0 : currentMonth + 1,
      year: currentMonth === 11 ? currentYear + 1 : currentYear,
      isCurrentMonth: false,
    });
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDaySelect = (dayObj: typeof daysGrid[0]) => {
    const date = new Date(dayObj.year, dayObj.month, dayObj.day);
    setSelectedDate(date);
    updateValue(date, hour, minute, amPm);
  };

  // Format date for display in input trigger
  const getDisplayValue = () => {
    if (!selectedDate) return "Select date & time...";
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const pad = (n: number) => String(n).padStart(2, "0");
    const m = monthNames[selectedDate.getMonth()];
    const d = selectedDate.getDate();
    const y = selectedDate.getFullYear();
    const h = selectedDate.getHours() % 12 || 12;
    const min = pad(selectedDate.getMinutes());
    const ap = selectedDate.getHours() >= 12 ? "PM" : "AM";
    return `${m} ${d}, ${y} at ${h}:${min} ${ap}`;
  };

  const monthName = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ][currentMonth];

  return (
    <div className="block w-full">
      <div className="flex justify-between">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold tracking-wide text-foreground">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div>
          {isInvalid && (
            <InputError
              message={inputErrors?.message}
              key={inputErrors?.message}
            />
          )}
        </div>
      </div>

      <div className="relative mt-1.5 w-full" ref={popoverRef}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm shadow-sm transition-all duration-200 outline-none h-11",
            "bg-card text-foreground border-border text-left cursor-pointer",
            isOpen ? "border-lime-brand ring-1 ring-lime-brand/20" : "",
            isInvalid ? "border-red-500 ring-1 ring-red-500/20" : ""
          )}
        >
          <span className={cn(selectedDate ? "text-foreground font-medium" : "text-muted-foreground")}>
            {getDisplayValue()}
          </span>
          <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
        </button>

        {/* Hidden field for react-hook-form to register and validate */}
        <input
          type="hidden"
          {...register(name, { required: required ? `${label || name} is required` : false })}
        />

        {/* Calendar Popover */}
        {isOpen && (
          <div className="absolute left-0 right-0 md:left-auto md:right-0 z-50 mt-2 p-4 w-[310px] rounded-2xl border border-border bg-card shadow-2xl animate-fade-in text-foreground">
            {/* Popover Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-display font-bold text-sm">
                {monthName} {currentYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Weekdays Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-2">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {daysGrid.map((dayObj, index) => {
                const isSelected = selectedDate && 
                  selectedDate.getDate() === dayObj.day &&
                  selectedDate.getMonth() === dayObj.month &&
                  selectedDate.getFullYear() === dayObj.year;

                const isToday = new Date().getDate() === dayObj.day &&
                  new Date().getMonth() === dayObj.month &&
                  new Date().getFullYear() === dayObj.year;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDaySelect(dayObj)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-semibold flex items-center justify-center cursor-pointer transition-all duration-150",
                      dayObj.isCurrentMonth ? "text-foreground" : "text-muted-foreground/45",
                      isToday && !isSelected ? "border border-lime-brand/40 text-lime-brand" : "",
                      isSelected ? "bg-lime-brand text-primary-foreground font-bold shadow-sm" : "hover:bg-muted"
                    )}
                  >
                    {dayObj.day}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-border my-4" />

            {/* Time selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-semibold">Time</span>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Hours select */}
                <select
                  value={hour}
                  onChange={(e) => {
                    const h = Number(e.target.value);
                    setHour(h);
                    if (selectedDate) updateValue(selectedDate, h, minute, amPm);
                  }}
                  className="rounded-lg border border-border bg-muted/30 px-2 py-1 text-xs font-medium outline-none focus:border-lime-brand"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
                  ))}
                </select>

                <span className="text-muted-foreground">:</span>

                {/* Minutes select */}
                <select
                  value={minute}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setMinute(m);
                    if (selectedDate) updateValue(selectedDate, hour, m, amPm);
                  }}
                  className="rounded-lg border border-border bg-muted/30 px-2 py-1 text-xs font-medium outline-none focus:border-lime-brand"
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                    <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
                  ))}
                </select>

                {/* AM/PM toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const nextAp = amPm === "AM" ? "PM" : "AM";
                    setAmPm(nextAp);
                    if (selectedDate) updateValue(selectedDate, hour, minute, nextAp);
                  }}
                  className="rounded-lg border border-border bg-muted/40 hover:bg-muted px-2.5 py-1 text-xs font-bold uppercase transition-colors cursor-pointer select-none"
                >
                  {amPm}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
