import { useState } from "react";
import { AlarmTime } from "@/types";
import { Clock } from "lucide-react";

interface TimePickerProps {
  time: AlarmTime;
  onChange: (time: AlarmTime) => void;
}

export default function TimePicker({ time, onChange }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const [showHourList, setShowHourList] = useState(false);
  const [showMinuteList, setShowMinuteList] = useState(false);

  const handleHourSelect = (hour: number) => {
    onChange({ ...time, hour });
    setShowHourList(false);
  };
  const handleMinuteSelect = (minute: number) => {
    onChange({ ...time, minute });
    setShowMinuteList(false);
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-6 h-6 text-[var(--dream-primary-500)]" />
        <span className="text-lg font-semibold text-[var(--dream-primary-700)]">เลือกเวลาตื่น</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Hour Selector */}
        <div className="relative">
          <button
            className="w-16 h-16 bg-[var(--dream-primary-100)] text-[var(--dream-primary-600)] text-4xl font-bold rounded-xl shadow transition-all hover:bg-[var(--dream-primary-200)] focus:outline-none focus:ring-2 focus:ring-[var(--dream-primary-400)]"
            onClick={() => setShowHourList((v) => !v)}
            aria-label="เลือกชั่วโมง"
          >
            {time.hour.toString().padStart(2, "0")}
          </button>
          {showHourList && (
            <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-2 w-20 max-h-56 overflow-y-auto bg-white rounded-xl shadow-lg border border-[var(--dream-primary-100)] animate-fade-in">
              {hours.map((h) => (
                <button
                  key={h}
                  className={`w-full py-2 text-xl rounded-lg transition-all ${
                    h === time.hour
                      ? "bg-[var(--dream-primary-500)] text-white font-bold"
                      : "hover:bg-[var(--dream-primary-50)] text-[var(--dream-primary-700)]"
                  }`}
                  onClick={() => handleHourSelect(h)}
                >
                  {h.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-4xl font-bold text-[var(--dream-secondary-500)]">:</span>
        {/* Minute Selector */}
        <div className="relative">
          <button
            className="w-16 h-16 bg-[var(--dream-secondary-100)] text-[var(--dream-secondary-600)] text-4xl font-bold rounded-xl shadow transition-all hover:bg-[var(--dream-secondary-200)] focus:outline-none focus:ring-2 focus:ring-[var(--dream-secondary-400)]"
            onClick={() => setShowMinuteList((v) => !v)}
            aria-label="เลือกนาที"
          >
            {time.minute.toString().padStart(2, "0")}
          </button>
          {showMinuteList && (
            <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-2 w-20 max-h-56 overflow-y-auto bg-white rounded-xl shadow-lg border border-[var(--dream-secondary-100)] animate-fade-in">
              {minutes.filter((_, i) => i % 5 === 0).map((m) => (
                <button
                  key={m}
                  className={`w-full py-2 text-xl rounded-lg transition-all ${
                    m === time.minute
                      ? "bg-[var(--dream-secondary-500)] text-white font-bold"
                      : "hover:bg-[var(--dream-secondary-50)] text-[var(--dream-secondary-700)]"
                  }`}
                  onClick={() => handleMinuteSelect(m)}
                >
                  {m.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
