import { Alert } from "react-native";
import { supabase } from "@/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface MealPlanItem {
  id: string;
  meal: string;
  recipe_id: string;
}

export function useMealPlanQuery(selectedDay: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery<MealPlanItem[], Error>({
    queryKey: ["meal-plan", selectedDay],
    queryFn: async (): Promise<MealPlanItem[]> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error("No user");

      const { data, error } = await supabase
        .from("meal_plan")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("day", selectedDay);

      if (error) throw error;

      return (data ?? []) as MealPlanItem[];
    },

    // ✅ v5 replacement for keepPreviousData
    placeholderData: (prev) => prev,
  });

  // ✅ data is now correctly inferred as MealPlanItem[] | undefined
  const meals: MealPlanItem[] = data ?? [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("meal_plan").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["meal-plan", selectedDay],
      });
    },
    onError: () => {
      Alert.alert("Error", "Could not remove meal");
    },
  });

  return {
    meals,
    loading: isLoading || isFetching,
    removeMeal: deleteMutation.mutate,
  };
}
