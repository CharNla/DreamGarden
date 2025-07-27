import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Droplets, AlarmClockOff } from "lucide-react";

export default function WakeUp() {
  const [, setLocation] = useLocation();
  const [isWatering, setIsWatering] = useState(false);
  const [showWateringAnimation, setShowWateringAnimation] = useState(false);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const handleWaterPlant = async () => {
    setIsWatering(true);
    setShowWateringAnimation(true);

    // Simulate watering animation
    setTimeout(() => {
      setLocation("/sleep-rating");
    }, 3000);
  };

  const handleSnooze = () => {
    // In a real app, this would trigger a 5-minute snooze
    console.log("Alarm snoozed for 5 minutes");
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--dream-accent-400)] to-[var(--dream-primary-500)]">
      <motion.div 
        className="flex flex-col items-center justify-center h-full p-6 text-white text-center relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Time Display */}
        <motion.div 
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="text-6xl font-bold mb-2">{getCurrentTime()}</div>
          <div className="text-xl opacity-90">สวัสดีตอนเช้า! 🌅</div>
        </motion.div>

        {/* Plant Watering Animation Area */}
        <motion.div 
          className="relative w-48 h-48 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Plant illustration */}
          <div className="absolute inset-0 flex items-end justify-center">
            <motion.div 
              className="w-32 h-32 bg-gradient-to-t from-[var(--dream-primary-600)] to-[var(--dream-primary-400)] rounded-full opacity-80 flex items-center justify-center"
              animate={showWateringAnimation ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <span className="text-4xl">🌱</span>
            </motion.div>
          </div>

          {/* Water animation overlay */}
          {showWateringAnimation && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 100, opacity: [0, 1, 0] }}
                transition={{ duration: 2, ease: "easeIn" }}
              >
                <div className="w-2 h-16 bg-blue-300 opacity-80 rounded-full" />
              </motion.div>
              
              {/* Multiple water drops */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2"
                  initial={{ y: -50, opacity: 0, x: -10 + i * 5 }}
                  animate={{ y: 120, opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    delay: i * 0.2,
                    ease: "easeIn" 
                  }}
                >
                  <div className="w-1 h-8 bg-blue-400 opacity-60 rounded-full" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="space-y-4 w-full max-w-xs"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Primary Dismiss/Water Button */}
          <Button
            onClick={handleWaterPlant}
            disabled={isWatering}
            className="w-full py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl shadow-lg hover:bg-white/30 transition-all duration-300"
            size="lg"
          >
            <motion.div
              className="flex items-center justify-center space-x-2"
              animate={isWatering ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Droplets className="w-5 h-5" />
              <span>
                {isWatering ? "กำลังรดน้ำ... 🌱" : "ปิดปลุก & รดน้ำต้นไม้ 💧"}
              </span>
            </motion.div>
          </Button>

          {/* AlarmClockOff Option */}
          {!isWatering && (
            <Button
              onClick={handleSnooze}
              variant="ghost"
              className="w-full py-3 text-white/70 font-medium hover:text-white hover:bg-white/10 transition-colors"
            >
              <AlarmClockOff className="w-4 h-4 mr-2" />
              เลื่อนปลุก 5 นาที
            </Button>
          )}
        </motion.div>

        {/* Encouraging message during watering */}
        {isWatering && (
          <motion.div
            className="absolute bottom-20 left-0 right-0 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-lg font-medium">ยอดเยี่ยม! ต้นไม้ของคุณได้รับพลังงานแล้ว ✨</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
