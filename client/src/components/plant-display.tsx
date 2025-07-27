import { motion } from "framer-motion";
import { PlantState } from "@/types";

interface PlantDisplayProps {
  plantState: PlantState;
  showWateringAnimation?: boolean;
  className?: string;
}

export default function PlantDisplay({ 
  plantState, 
  showWateringAnimation = false, 
  className = "" 
}: PlantDisplayProps) {
  const getPlantColor = (health: PlantState['health']) => {
    switch (health) {
      case 'excellent':
        return 'from-green-400 to-green-600';
      case 'good':
        return 'from-green-300 to-green-500';
      case 'fair':
        return 'from-yellow-300 to-green-400';
      case 'poor':
        return 'from-yellow-400 to-yellow-600';
      case 'critical':
        return 'from-red-400 to-red-600';
      default:
        return 'from-green-400 to-green-600';
    }
  };

  const getHealthMessage = (health: PlantState['health']) => {
    switch (health) {
      case 'excellent':
        return 'สุขภาพดีมาก';
      case 'good':
        return 'สุขภาพดี';
      case 'fair':
        return 'สุขภาพปานกลาง';
      case 'poor':
        return 'ต้องการการดูแล';
      case 'critical':
        return 'ต้องการการดูแลเร่งด่วน';
      default:
        return 'สุขภาพดี';
    }
  };

  const plantColorClass = getPlantColor(plantState.health);
  const healthMessage = getHealthMessage(plantState.health);

  return (
    <div className={`relative ${className}`}>
      {/* Plant Container */}
      <div className="flex items-center justify-center h-64 plant-container">
        <motion.div 
          className="relative"
          animate={showWateringAnimation ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Soil Base */}
          <div className="w-40 h-16 bg-gradient-to-t from-amber-800 to-amber-600 rounded-b-full absolute bottom-0 left-1/2 transform -translate-x-1/2" />
          
          {/* Plant Stem and Leaves */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              className="w-2 bg-green-600 mb-2"
              style={{ height: `${60 + (plantState.growth / 100) * 40}px` }}
              animate={showWateringAnimation ? { height: `${64 + (plantState.growth / 100) * 40}px` } : {}}
            />
            <motion.div 
              className="flex space-x-4"
              animate={showWateringAnimation ? { y: [-2, 0] } : {}}
            >
              <motion.div 
                className={`w-8 h-8 bg-gradient-to-br ${plantColorClass} rounded-full transform -rotate-12 animate-shimmer`}
                whileHover={{ scale: 1.1 }}
              />
              <motion.div 
                className={`w-12 h-12 bg-gradient-to-br ${plantColorClass} rounded-full animate-shimmer`}
                whileHover={{ scale: 1.1 }}
              />
              <motion.div 
                className={`w-8 h-8 bg-gradient-to-br ${plantColorClass} rounded-full transform rotate-12 animate-shimmer`}
                whileHover={{ scale: 1.1 }}
              />
            </motion.div>
          </div>

          {/* Growth Particles */}
          {plantState.health === 'excellent' && (
            <motion.div 
              className="absolute -top-4 left-1/2 transform -translate-x-1/2"
              animate={{ y: [-5, -15, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-1 h-1 bg-yellow-400 rounded-full" />
            </motion.div>
          )}

          {/* Watering Animation */}
          {showWateringAnimation && (
            <motion.div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: [0, 1, 0], y: [0, 100, 150] }}
              transition={{ duration: 2, ease: "easeIn" }}
            >
              <div className="w-2 h-16 bg-blue-300 opacity-80 animate-water-drop" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Plant Status */}
      <div className="text-center mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          {plantState.type === 'bamboo' && 'ต้นไผ่แห่งความสงบ'}
          {plantState.type === 'lotus' && 'ดอกบัวแห่งความบริสุทธิ์'}
          {plantState.type === 'bonsai' && 'บอนไซแห่งสมาธิ'}
          {plantState.type === 'cherry' && 'ซากุระแห่งความหวัง'}
        </h2>
        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              plantState.health === 'excellent' ? 'bg-green-500' :
              plantState.health === 'good' ? 'bg-green-400' :
              plantState.health === 'fair' ? 'bg-yellow-400' :
              plantState.health === 'poor' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${
              plantState.health === 'excellent' ? 'text-green-600' :
              plantState.health === 'good' ? 'text-green-500' :
              plantState.health === 'fair' ? 'text-yellow-600' :
              plantState.health === 'poor' ? 'text-yellow-700' :
              'text-red-600'
            }`}>
              {healthMessage}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            การนอนที่สม่ำเสมอทำให้ต้นไม้เติบโตอย่างแข็งแรง
          </p>
          
          {/* Growth Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>การเติบโต</span>
              <span>{plantState.growth}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${plantState.growth}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
