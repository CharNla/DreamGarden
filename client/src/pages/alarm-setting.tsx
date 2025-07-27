import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useCreateAlarm } from "@/hooks/use-alarm";
import { useToast } from "@/hooks/use-toast";
import TimePicker from "@/components/time-picker";
import { AlarmTime, DayOfWeek } from "@/types";

export default function AlarmSetting() {
  const [, setLocation] = useLocation();
  const [time, setTime] = useState<AlarmTime>({ hour: 7, minute: 0 });
  const [note, setNote] = useState("");
  const [selectedDays, setSelectedDays] = useState<boolean[]>([false, true, true, true, true, true, false]);
  
  const createAlarm = useCreateAlarm();
  const { toast } = useToast();

  const daysOfWeek: DayOfWeek[] = [
    { id: 0, name: "อาทิตย์", shortName: "อา", selected: selectedDays[0] },
    { id: 1, name: "จันทร์", shortName: "จ", selected: selectedDays[1] },
    { id: 2, name: "อังคาร", shortName: "อ", selected: selectedDays[2] },
    { id: 3, name: "พุธ", shortName: "พ", selected: selectedDays[3] },
    { id: 4, name: "พฤหัสบดี", shortName: "พฤ", selected: selectedDays[4] },
    { id: 5, name: "ศุกร์", shortName: "ศ", selected: selectedDays[5] },
    { id: 6, name: "เสาร์", shortName: "ส", selected: selectedDays[6] },
  ];

  const toggleDay = (dayIndex: number) => {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[dayIndex] = !newSelectedDays[dayIndex];
    setSelectedDays(newSelectedDays);
  };

  const handleSaveAlarm = async () => {
    if (!selectedDays.some(day => day)) {
      toast({
        title: "กรุณาเลือกวัน",
        description: "เลือกอย่างน้อย 1 วันที่ต้องการให้ปลุก",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAlarm.mutateAsync({
        time: `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`,
        days: selectedDays,
        note: note.trim() || null,
        isActive: true,
      });

      toast({
        title: "บันทึกสำเร็จ!",
        description: "ตั้งเวลาปลุกเรียบร้อยแล้ว",
      });

      setLocation("/garden");
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการตั้งเวลาได้",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-white">
      {/* Header */}
      <motion.div 
        className="dream-header-gradient text-white px-6 py-4 flex items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/garden")}
          className="mr-4 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold">ตั้งเวลาปลุก</h1>
      </motion.div>

      <motion.div 
        className="p-6 space-y-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Time Picker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TimePicker time={time} onChange={setTime} />
        </motion.div>

        {/* Days Selection */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-700">วันที่ต้องการตื่น</h3>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day, index) => (
              <motion.button
                key={day.id}
                onClick={() => toggleDay(index)}
                className={`w-12 h-12 rounded-full font-semibold transition-colors ${
                  selectedDays[index]
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {day.shortName}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Note */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold text-gray-700">ข้อความเตือน (ไม่บังคับ)</h3>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น: ดื่มน้ำเปล่า 1 แก้ว หรือ เตรียมออกกำลังกาย"
            className="resize-none focus:ring-2 focus:ring-primary/20"
            rows={3}
          />
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handleSaveAlarm}
            disabled={createAlarm.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-semibold shadow-lg"
            size="lg"
          >
            {createAlarm.isPending ? "กำลังบันทึก..." : "บันทึกการตั้งเวลา"}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
