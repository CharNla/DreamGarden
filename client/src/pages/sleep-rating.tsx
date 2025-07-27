import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useCreateSleepRecord } from "@/hooks/use-sleep-data";
import { useToast } from "@/hooks/use-toast";
import StarRating from "@/components/star-rating";

export default function SleepRating() {
  const [, setLocation] = useLocation();
  const [rating, setRating] = useState(0);
  const [journal, setJournal] = useState("");
  
  const createSleepRecord = useCreateSleepRecord();
  const { toast } = useToast();

  const handleSave = async () => {
    if (rating === 0) {
      toast({
        title: "กรุณาให้คะแนน",
        description: "เลือกคะแนนการนอนหลับของคุณ",
        variant: "destructive",
      });
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });

      await createSleepRecord.mutateAsync({
        date: today,
        rating,
        journal: journal.trim() || null,
        wakeUpTime: currentTime,
      });

      toast({
        title: "บันทึกสำเร็จ!",
        description: `คุณได้รับหยาดน้ำค้าง ${rating * 2} หยาด และพลังงานแสงอาทิตย์ ${rating === 5 ? 5 : rating} หน่วย`,
      });

      setLocation("/garden");
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    }
  };

  const calculateRewards = (rating: number) => {
    return {
      dewdrops: rating * 2,
      sunlight: rating === 5 ? 5 : rating,
    };
  };

  const rewards = calculateRewards(rating);

  return (
    <div className="absolute inset-0 bg-white">
      {/* Header */}
      <motion.div 
        className="dream-header-gradient text-white px-6 py-4 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl font-semibold">การนอนเมื่อคืน</h1>
        <p className="text-sm opacity-90">ช่วยบอกเราหน่อยว่าคืนนี้นอนเป็นอย่างไรบ้าง</p>
      </motion.div>

      <motion.div 
        className="p-6 space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Sleep Rating */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-700">คะแนนการนอน</h2>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="lg"
          />
          <p className="text-sm text-gray-500">แตะเพื่อให้คะแนน (1 = แย่มาก, 5 = ดีมาก)</p>
        </motion.div>

        {/* Mood/Dream Journal */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-700">บันทึกความรู้สึกหรือความฝัน</h3>
          <Textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="บันทึกความรู้สึกหรือความฝันของคุณ... 💭&#10;&#10;เช่น: ฝันว่าไปเที่ยวทะเล รู้สึกสดชื่น"
            className="resize-none min-h-[120px] focus:ring-2 focus:ring-primary/20"
          />
        </motion.div>

        {/* Rewards Display */}
        {rating > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-[var(--dream-primary-50)] to-[var(--dream-secondary-50)] rounded-xl p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-semibold text-gray-700 mb-3">รางวัลที่ได้รับ</h3>
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="dewdrop w-6 h-6" />
                <span className="text-sm font-medium">+{rewards.dewdrops} หยาดน้ำค้าง</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="sunlight w-6 h-6 rounded-full" />
                <span className="text-sm font-medium">+{rewards.sunlight} พลังงานแสงอาทิตย์</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handleSave}
            disabled={createSleepRecord.isPending || rating === 0}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-semibold shadow-lg"
            size="lg"
          >
            {createSleepRecord.isPending ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
