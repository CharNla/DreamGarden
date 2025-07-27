export interface PlantState {
  health: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  growth: number; // 0-100
  type: 'bamboo' | 'lotus' | 'bonsai' | 'cherry';
}

export interface Currency {
  dewdrops: number;
  sunlight: number;
}

export interface AlarmTime {
  hour: number;
  minute: number;
}

export interface WakeUpData {
  time: string;
  date: string;
  plantWatered: boolean;
}

export interface DayOfWeek {
  id: number;
  name: string;
  shortName: string;
  selected: boolean;
}

export interface CalendarDay {
  date: string;
  rating?: number;
  hasRecord: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
}
