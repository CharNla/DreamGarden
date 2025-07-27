import { motion } from "framer-motion";
import { CalendarDay as CalendarDayType } from "@/types";
import { Star } from "lucide-react";

interface CalendarDayProps {
  day: CalendarDayType;
  onClick?: (date: string) => void;
}

export default function CalendarDay({ day, onClick }: CalendarDayProps) {
  const handleClick = () => {
    if (onClick && day.isCurrentMonth) {
      onClick(day.date);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-400';
    if (rating >= 3) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const dayNumber = new Date(day.date).getDate();

  return (
    <motion.button
      className={`aspect-square flex flex-col items-center justify-center border rounded-lg relative ${
        day.isToday ? 'border-primary bg-primary/10' : 'border-gray-200'
      } ${
        day.isCurrentMonth ? 'hover:bg-gray-50' : ''
      } ${
        !day.isCurrentMonth ? 'text-gray-300' : ''
      }`}
      onClick={handleClick}
      whileHover={day.isCurrentMonth ? { scale: 1.02 } : {}}
      whileTap={day.isCurrentMonth ? { scale: 0.98 } : {}}
    >
      <span className={`text-sm font-medium ${
        day.isToday ? 'text-primary font-semibold' : ''
      }`}>
        {dayNumber}
      </span>
      
      {day.hasRecord && day.rating ? (
        <div className="flex space-x-0.5 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className={`w-1.5 h-1.5 rounded-full ${
                star <= day.rating! ? getRatingColor(day.rating!) : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      ) : day.isCurrentMonth && !day.hasRecord ? (
        <div className="text-xs text-gray-400 mt-1">ยังไม่มี</div>
      ) : null}
    </motion.button>
  );
}
