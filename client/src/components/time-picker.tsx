import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlarmTime } from "@/types";

interface TimePickerProps {
  time: AlarmTime;
  onChange: (time: AlarmTime) => void;
}

export default function TimePicker({ time, onChange }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleHourChange = (hour: string) => {
    onChange({ ...time, hour: parseInt(hour) });
  };

  const handleMinuteChange = (minute: string) => {
    onChange({ ...time, minute: parseInt(minute) });
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 text-center">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">เวลาตื่น</h2>
      <div className="flex justify-center items-center space-x-2 text-4xl font-bold text-primary">
        <Select value={time.hour.toString().padStart(2, '0')} onValueChange={handleHourChange}>
          <SelectTrigger className="w-20 h-16 text-4xl font-bold border-none bg-transparent shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="mx-2">:</span>
        <Select value={time.minute.toString().padStart(2, '0')} onValueChange={handleMinuteChange}>
          <SelectTrigger className="w-20 h-16 text-4xl font-bold border-none bg-transparent shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {minutes.filter((_, i) => i % 15 === 0).map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
