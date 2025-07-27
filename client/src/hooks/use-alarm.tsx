import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Alarm, InsertAlarm } from "@shared/schema";

export function useAlarms() {
  return useQuery<Alarm[]>({
    queryKey: ["/api/alarms"],
  });
}

export function useCreateAlarm() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertAlarm) => {
      const response = await apiRequest("POST", "/api/alarms", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alarms"] });
    },
  });
}

export function useUpdateAlarm() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertAlarm> }) => {
      const response = await apiRequest("PUT", `/api/alarms/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alarms"] });
    },
  });
}

export function useDeleteAlarm() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/alarms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alarms"] });
    },
  });
}
