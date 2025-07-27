import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useSleepRecords, useSleepStats } from "@/hooks/use-sleep-data";
import CalendarDay from "@/components/calendar-day";

export default function SleepDiary() {
  const [, setLocation] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { data: sleepRecords = [] } = useSleepRecords();
  const sleepStats = useSleepStats();

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    const days = [];
    
    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date: date.toISOString().split('T')[0],
        hasRecord: false,
        isToday: false,
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const record = sleepRecords.find(r => r.date === dateString);
      const today = new Date();
      
      days.push({
        date: dateString,
        rating: record?.rating,
        hasRecord: !!record,
        isToday: date.toDateString() === today.toDateString(),
        isCurrentMonth: true,
      });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date: date.toISOString().split('T')[0],
        hasRecord: false,
        isToday: false,
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const daysOfWeek = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="absolute inset-0 bg-white">
      {/* Header */}
      <motion.div 
        className="dream-header-gradient text-white px-6 py-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/garden")}
            className="mr-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold">สมุดบันทึกการนอน</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm font-medium min-w-[80px] text-center">
            {formatMonthYear(currentDate)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="text-white hover:bg-white/20"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>

      <div className="p-4 overflow-y-auto">
        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {calendarDays.map((day, index) => (
              <CalendarDay key={index} day={day} />
            ))}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div 
          className="bg-gray-50 rounded-xl p-4 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-700 mb-3">คำอธิบาย</h3>
          <div className="space-y-2">
            {[
              { rating: 5, label: 'นอนหลับดีมาก (5 ดาว)', color: 'green' },
              { rating: 3, label: 'นอนหลับปานกลาง (3 ดาว)', color: 'yellow' },
              { rating: 2, label: 'นอนหลับไม่ดี (2 ดาว)', color: 'red' },
            ].map((item) => (
              <div key={item.rating} className="flex items-center space-x-3">
                <div className="flex space-x-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={`w-3 h-3 rounded-full ${
                        star <= item.rating 
                          ? item.color === 'green' ? 'bg-green-400' :
                            item.color === 'yellow' ? 'bg-yellow-400' :
                            'bg-red-400'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div 
            className="bg-[var(--dream-primary-50)] rounded-xl p-4 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-primary">
              {sleepStats.averageRating}
            </div>
            <div className="text-sm text-gray-600">คะแนนเฉลี่ย</div>
          </motion.div>
          <motion.div 
            className="bg-[var(--dream-secondary-50)] rounded-xl p-4 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-secondary">
              {sleepStats.streakDays}
            </div>
            <div className="text-sm text-gray-600">วันติดต่อกัน</div>
          </motion.div>
        </motion.div>

        {/* Recent Records Summary */}
        {sleepRecords.length > 0 && (
          <motion.div 
            className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="font-semibold text-gray-700 mb-3">บันทึกล่าสุด</h3>
            <div className="space-y-2">
              {sleepRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium">
                      {new Date(record.date).toLocaleDateString('th-TH')}
                    </div>
                    <div className="flex space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-2 h-2 rounded-full ${
                            star <= record.rating 
                              ? record.rating >= 4 ? 'bg-green-400' :
                                record.rating >= 3 ? 'bg-yellow-400' :
                                'bg-red-400'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {record.wakeUpTime}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
