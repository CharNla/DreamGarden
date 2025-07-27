import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SleepRecord, InsertSleepRecord } from "@shared/schema";

export function useSleepRecords(limit?: number) {
  return useQuery<SleepRecord[]>({
    queryKey: ["/api/sleep-records", limit],
  });
}

export function useCreateSleepRecord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertSleepRecord) => {
      const response = await apiRequest("POST", "/api/sleep-records", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sleep-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });
}

export function useSleepStats() {
  const { data: records } = useSleepRecords();
  
  if (!records || records.length === 0) {
    return {
      averageRating: 0,
      streakDays: 0,
      totalRecords: 0,
    };
  }

  const averageRating = records.reduce((sum, record) => sum + record.rating, 0) / records.length;
  
  // Calculate streak (consecutive days with records)
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streakDays = 0;
  const today = new Date();
  
  for (let i = 0; i < sortedRecords.length; i++) {
    const recordDate = new Date(sortedRecords[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (recordDate.toDateString() === expectedDate.toDateString()) {
      streakDays++;
    } else {
      break;
    }
  }

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    streakDays,
    totalRecords: records.length,
  };
}
