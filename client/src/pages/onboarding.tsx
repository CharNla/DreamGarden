import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sprout, Moon, Droplets, Leaf } from "lucide-react";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentScreen, setCurrentScreen] = useState(1);

  const nextScreen = (screen: number) => {
    setCurrentScreen(screen);
  };

  const goToAlarmSetting = () => {
    setLocation("/alarm-setting");
  };

  const screens = [
    {
      id: 1,
      gradient: "dream-gradient-primary",
      icon: <Sprout className="w-16 h-16 text-white" />,
      title: "DreamGarden",
      description: "ต้อนรับสู่สวนแห่งความฝัน\nที่ต้นไม้จะเติบโตไปพร้อมกับการนอนหลับของคุณ",
      buttonText: "เริ่มต้นการเดินทาง",
      buttonColor: "bg-[var(--dream-primary-600)] hover:bg-[var(--dream-primary-700)]",
      onNext: () => nextScreen(2),
    },
    {
      id: 2,
      gradient: "dream-gradient-secondary",
      icon: (
        <div className="flex justify-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-[var(--dream-primary-500)] rounded-full flex items-center justify-center">
            <Moon className="w-8 h-8 text-white" />
          </div>
          <div className="w-4 h-1 bg-[var(--dream-primary-300)] rounded-full self-center"></div>
          <div className="w-20 h-20 bg-[var(--dream-secondary-500)] rounded-full flex items-center justify-center shadow-lg z-10">
            <Droplets className="w-10 h-10 text-white" />
          </div>
          <div className="w-4 h-1 bg-[var(--dream-primary-300)] rounded-full self-center"></div>
          <div className="w-16 h-16 bg-[var(--dream-accent-500)] rounded-full flex items-center justify-center">
            <Leaf className="w-8 h-8 text-white" />
          </div>
        </div>
      ),
      title: "วิธีการทำงาน",
      description: "🌙 ตั้งเวลาปลุกและนอนให้สม่ำเสมอ\n💧 รดน้ำต้นไม้เมื่อตื่นในแต่ละเช้า\n🌱 ดูต้นไม้เติบโตตามคุณภาพการนอน",
      buttonText: "เข้าใจแล้ว",
      buttonColor: "bg-[var(--dream-secondary-600)] hover:bg-[var(--dream-secondary-700)]",
      onNext: () => nextScreen(3),
    },
    {
      id: 3,
      gradient: "dream-gradient-accent",
      icon: <Sprout className="w-12 h-12 text-white" />,
      title: "เริ่มต้นสวนของคุณ",
      description: "พร้อมที่จะเริ่มปลูกต้นไม้แรกแล้วหรือยัง?\nมาตั้งเวลาปลุกแรกกันเลย!",
      buttonText: "ตั้งเวลาปลุก",
      buttonColor: "bg-[var(--dream-accent-600)] hover:bg-[var(--dream-accent-700)]",
      onNext: goToAlarmSetting,
    },
  ];

  const currentScreenData = screens.find(screen => screen.id === currentScreen)!;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentScreen}
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 ${currentScreenData.gradient}`}
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Icon */}
            <motion.div 
              className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[var(--dream-primary-400)] to-[var(--dream-primary-600)] rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {currentScreenData.icon}
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-3xl font-bold text-[var(--dream-primary-700)] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentScreenData.title}
            </motion.h1>

            {/* Description */}
            <motion.div 
              className="text-lg text-gray-600 leading-relaxed px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {currentScreenData.description.split('\n').map((line, index) => (
                <p key={index} className="mb-2">{line}</p>
              ))}
            </motion.div>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={currentScreenData.onNext}
                className={`${currentScreenData.buttonColor} text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors`}
                size="lg"
              >
                {currentScreenData.buttonText}
              </Button>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div 
              className="flex justify-center space-x-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {screens.map((screen) => (
                <div
                  key={screen.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    screen.id === currentScreen 
                      ? 'bg-[var(--dream-primary-600)]' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
