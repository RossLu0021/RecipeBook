import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";

export interface GroceryItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  category: string;
  checked: boolean;
  user_id: string;
}

export default function useGroceryList() {
  const queryClient = useQueryClient();

  const {
    data: list = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["grocery_list"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error("No user");

      const { data, error } = await supabase
        .from("grocery_list")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as GroceryItem[];
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (item: any) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error("No user");

      const newItem = { ...item, user_id: userData.user.id, checked: false };
      const { data, error } = await supabase
        .from("grocery_list")
        .insert(newItem)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(["grocery_list"], (old: GroceryItem[] = []) => [
        newItem,
        ...old,
      ]);
    },
  });

  const toggleItemMutation = useMutation({
    mutationFn: async ({ id, checked }: { id: string; checked: boolean }) => {
      const { error } = await supabase
        .from("grocery_list")
        .update({ checked })
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, checked }) => {
      // Optimistically mirror the UI toggle before the server responds.
      await queryClient.cancelQueries({ queryKey: ["grocery_list"] });
      const previousList = queryClient.getQueryData(["grocery_list"]);

      queryClient.setQueryData(["grocery_list"], (old: GroceryItem[] = []) =>
        old.map((item) => (item.id === id ? { ...item, checked } : item)),
      );

      return { previousList };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["grocery_list"], context?.previousList);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["grocery_list"] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("grocery_list")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["grocery_list"] });
      const previousList = queryClient.getQueryData(["grocery_list"]);

      queryClient.setQueryData(["grocery_list"], (old: GroceryItem[] = []) =>
        old.filter((item) => item.id !== id),
      );
      return { previousList };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["grocery_list"], context?.previousList);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["grocery_list"] });
    },
  });

  const clearCheckedMutation = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { error } = await supabase
        .from("grocery_list")
        .delete()
        .eq("user_id", userData.user.id)
        .eq("checked", true);

      if (error) throw error;
    },
    onMutate: async () => {
      // Optimistically strip checked items so the list feels instant.
      await queryClient.cancelQueries({ queryKey: ["grocery_list"] });
      const previousList = queryClient.getQueryData(["grocery_list"]);

      queryClient.setQueryData(["grocery_list"], (old: GroceryItem[] = []) =>
        old.filter((item) => !item.checked),
      );

      return { previousList };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["grocery_list"], context?.previousList);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["grocery_list"] });
    },
  });

  // Group items by category for easier rendering in the UI.
  const groupedList: Record<string, GroceryItem[]> = list.reduce(
    (acc, item) => {
      const cat = item.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, GroceryItem[]>,
  );

  return {
    list,
    groupedList,
    loading: isLoading,
    addItem: (name: string, category: string, quantity: any, unit: any) => {
      addItemMutation.mutate({
        name,
        category: category || "Other",
        quantity: quantity ? Number(quantity) : null,
        unit: unit || null,
      });
    },
    toggleItem: (id: string, currentStatus: boolean) => {
      toggleItemMutation.mutate({ id, checked: !currentStatus });
    },
    removeItem: (id: string) => {
      deleteItemMutation.mutate(id);
    },
    clearChecked: () => {
      clearCheckedMutation.mutate();
    },
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: ["grocery_list"] }),
  };
}
