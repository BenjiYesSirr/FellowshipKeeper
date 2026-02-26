import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateQuestInput, type QuestResponse } from "@shared/routes";

// Helper to safely parse dates from JSON
const parseQuestDates = (quest: any): QuestResponse => ({
  ...quest,
  startTime: new Date(quest.startTime),
  returnedAt: quest.returnedAt ? new Date(quest.returnedAt) : null,
});

export function useQuests() {
  return useQuery({
    queryKey: [api.quests.list.path],
    queryFn: async () => {
      const res = await fetch(api.quests.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch quests");
      const data = await res.json();
      return data.map(parseQuestDates);
    },
  });
}

export function useCreateQuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateQuestInput) => {
      const res = await fetch(api.quests.create.path, {
        method: api.quests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create quest");
      const json = await res.json();
      return parseQuestDates(json);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.quests.list.path] });
    },
  });
}

export function useReturnQuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.quests.return.path, { id });
      const res = await fetch(url, {
        method: api.quests.return.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to return pencil");
      const json = await res.json();
      return parseQuestDates(json);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.quests.list.path] });
    },
  });
}
