import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Gift, Image, Music, Sparkles } from "lucide-react";

const shopItems = [
  {
    id: "decor",
    name: "ของตกแต่งสวน",
    description: "เพิ่มความสวยงามให้สวนของคุณด้วยของตกแต่งสุดน่ารัก",
    icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
    price: 50,
    color: "bg-yellow-50 border-yellow-200"
  },
  {
    id: "seedbox",
    name: "กล่องสุ่มเมล็ด",
    description: "ลุ้นรับเมล็ดพันธุ์ใหม่ ๆ สำหรับปลูกต้นไม้",
    icon: <Gift className="w-8 h-8 text-pink-400" />,
    price: 100,
    color: "bg-pink-50 border-pink-200"
  },
  {
    id: "bg",
    name: "พื้นหลังสวน",
    description: "เปลี่ยนบรรยากาศสวนด้วยพื้นหลังใหม่",
    icon: <Image className="w-8 h-8 text-blue-400" />,
    price: 80,
    color: "bg-blue-50 border-blue-200"
  },
  {
    id: "sound",
    name: "เสียงธรรมชาติ",
    description: "เพิ่มเสียงธรรมชาติให้สวนผ่อนคลายยิ่งขึ้น",
    icon: <Music className="w-8 h-8 text-green-400" />,
    price: 60,
    color: "bg-green-50 border-green-200"
  },
];

export default function Shop() {
  const [, setLocation] = useLocation();

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--dream-primary-50)] to-[var(--dream-secondary-50)] flex flex-col min-h-screen max-w-sm mx-auto">
      {/* Topbar */}
      <div className="bg-white shadow-md px-2 py-3 flex items-center justify-between sticky top-0 z-10">
        <Button size="icon" variant="ghost" onClick={() => setLocation("/garden")}
          className="text-gray-500 hover:text-primary mr-2">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </Button>
        <h1 className="text-lg font-bold text-gray-800 flex-1 text-left">ร้านค้า</h1>
      </div>

      {/* Shop Items */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {shopItems.map(item => (
          <div key={item.id} className={`rounded-2xl border shadow-sm flex items-center p-4 ${item.color}`}>
            <div className="mr-4 flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-base text-gray-800 mb-1">{item.name}</div>
              <div className="text-xs text-gray-500 mb-2">{item.description}</div>
              <div className="text-sm font-bold text-primary">{item.price} <span className="align-middle">💧</span></div>
            </div>
            <Button className="ml-2 bg-primary text-white rounded-xl px-4 py-2 text-sm font-semibold shadow hover:bg-primary/90 transition-colors">ซื้อ</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
