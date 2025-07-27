// Mock data for DreamGarden

export const mockUser = {
  id: "demo-user",
  name: "Demo User",
  avatar: "https://i.pravatar.cc/150?u=demo-user",
  email: "demo@dreamgarden.com"
};

export const mockAlarms = [
  {
    id: 1,
    time: "07:00",
    label: "Wake up",
    enabled: true
  },
  {
    id: 2,
    time: "22:30",
    label: "Go to bed",
    enabled: false
  }
];

export const mockSleepRecords = [
  {
    id: 1,
    date: "2025-07-26",
    duration: 7.5,
    quality: 4
  }
];

export const mockChatMessages = [
  {
    id: 1,
    userId: "demo-user",
    message: "Hello! How did you sleep last night?",
    timestamp: Date.now()
  }
];
