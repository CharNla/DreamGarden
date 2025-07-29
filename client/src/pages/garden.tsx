import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useSleepRecords, useSleepStats } from "@/hooks/use-sleep-data";
import PlantDisplay from "@/components/plant-display";
import bambooStage1 from "@/assets/images/trees/bamboo_serenity/bamboo_stage_1.png";
import { Sprout, Calendar, MessageCircle, Clock, ShoppingBag } from "lucide-react";
import { PlantState } from "@/types";

export default function Garden() {
  const [, setLocation] = useLocation();
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });
  
  const { data: sleepRecords } = useSleepRecords(7); // Last 7 days
  const sleepStats = useSleepStats();

  // Calculate plant state based on recent sleep data
  const calculatePlantState = (): PlantState => {
    if (!sleepRecords || sleepRecords.length === 0) {
      return {
        health: 'fair',
        growth: 20,
        type: 'bamboo'
      };
    }

    const averageRating = sleepRecords.reduce((sum, record) => sum + record.rating, 0) / sleepRecords.length;
    const consistency = sleepRecords.length / 7; // Days with records out of 7
    
    let health: PlantState['health'];
    if (averageRating >= 4.5 && consistency >= 0.8) health = 'excellent';
    else if (averageRating >= 3.5 && consistency >= 0.6) health = 'good';
    else if (averageRating >= 2.5 && consistency >= 0.4) health = 'fair';
    else if (averageRating >= 1.5) health = 'poor';
    else health = 'critical';

    const growth = Math.min(100, Math.round((averageRating * 20) + (consistency * 30)));

    return {
      health,
      growth,
      type: 'bamboo'
    };
  };

  const plantState = calculatePlantState();

  const navigationItems = [
    { 
      id: 'garden', 
      label: 'สวน', 
      icon: Sprout, 
      path: '/garden',
      active: true 
    },
    { 
      id: 'diary', 
      label: 'ปฏิทิน', 
      icon: Calendar, 
      path: '/sleep-diary',
      active: false 
    },
    { 
      id: 'chat', 
      label: 'Reef AI', 
      icon: MessageCircle, 
      path: '/chat',
      active: false 
    },
    { 
      id: 'alarm', 
      label: 'ปลุก', 
      icon: Clock, 
      path: '/alarm-setting',
      active: false 
    },
  ];

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--dream-primary-50)] to-[var(--dream-secondary-50)]">
      {/* Header with Currency */}
      <motion.div 
        className="bg-white shadow-sm px-6 py-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">สวนของฉัน</h1>
          <div className="flex items-center space-x-4">
            {/* Dewdrops */}
            <motion.div 
              className="flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
            >
              <div className="dewdrop w-6 h-6" />
              <span className="text-sm font-semibold text-[var(--dream-secondary-600)]">
                {user?.dewdrops || 0}
              </span>
            </motion.div>
            {/* Sunlight Energy */}
            <motion.div 
              className="flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
            >
              <div className="sunlight w-6 h-6 rounded-full" />
              <span className="text-sm font-semibold text-[var(--dream-accent-600)]">
                {user?.sunlight || 0}
              </span>
            </motion.div>
            {/* Shop Icon */}
            <button
              className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="ร้านค้า"
              onClick={() => setLocation('/shop')}
            >
              <ShoppingBag className="w-6 h-6 text-gray-500 hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Plant Display */}
      <motion.div 
        className="flex-1 plant-container px-6 py-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* ต้นไม้หลัก */}
        <div className="flex items-center justify-center w-full h-[50vh] min-h-[260px] max-h-[440px] mt-14">
          <img 
            src={bambooStage1} 
            alt="Bamboo Stage 1" 
            className="mx-auto w-80 h-80 sm:w-96 sm:h-96 object-contain drop-shadow-2xl transition-all duration-300" 
          />
        </div>
        
        {/* Additional Stats - stick above quick actions/navbar */}
        <div className="fixed left-0 right-0 bottom-44 w-full max-w-sm mx-auto px-4 z-30">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">
                {sleepStats.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">คะแนนเฉลี่ย</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-secondary">
                {sleepStats.streakDays}
              </div>
              <div className="text-sm text-gray-600">วันติดต่อกัน</div>
            </div>
          </div>
        </div>

        {/* Quick Actions - stick above navbar */}
        <div className="fixed left-0 right-0 bottom-28 w-full max-w-sm mx-auto px-4 z-30">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setLocation("/wake-up")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl w-full"
            >
              🌅 ทดสอบรดน้ำ
            </Button>
            <Button
              onClick={() => setLocation("/sleep-rating")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 py-3 rounded-xl w-full"
            >
              ⭐ บันทึกการนอน
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <motion.div 
        className="bg-white border-t border-gray-200 px-6 py-4 fixed bottom-0 left-0 w-full z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="grid grid-cols-4 gap-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center space-y-1 transition-colors ${
                  item.active 
                    ? 'text-primary' 
                    : 'text-gray-400 hover:text-primary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
