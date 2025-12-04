import { supabase } from "@/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export interface PantryItem {
    id: string;
    name: string;
    quantity?: number;
    unit?: string;
    expiry_date?: string;
    user_id: string;
}

export default function usePantry() {
    const queryClient = useQueryClient();

    const {
        data: pantryList = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["pantry_items"],
        queryFn: async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) throw new Error("No user");

            const { data, error } = await supabase
                .from("pantry_items")
                .select("*")
                .eq("user_id", userData.user.id)
                .order("expiry_date", { ascending: true });

            if (error) throw error;
            return data as PantryItem[];
        },
    });

    const addItemMutation = useMutation({
        mutationFn: async (item: Omit<PantryItem, "id" | "user_id">) => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) throw new Error("No user");

            const newItem = { ...item, user_id: userData.user.id };
            const { data, error } = await supabase
                .from("pantry_items")
                .insert(newItem)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ["pantry_items"] });
            const previousList = queryClient.getQueryData(["pantry_items"]);

            const optimisticItem: PantryItem = {
                id: Math.random().toString(),
                ...newItem,
                user_id: "temp-user",
            };

            queryClient.setQueryData(["pantry_items"], (old: PantryItem[] = []) => [
                optimisticItem,
                ...old,
            ]);

            return { previousList };
        },
        onSuccess: (newItem) => {
            queryClient.setQueryData(["pantry_items"], (old: PantryItem[] = []) => [
                newItem,
                ...old.filter((item) => !item.id.startsWith("0.")), // Remove temp items
            ]);
        },
        onError: (err, newItem, context) => {
            queryClient.setQueryData(["pantry_items"], context?.previousList);
            Alert.alert("Error", "Failed to add item to pantry.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["pantry_items"] });
        },
    });

    const updateItemMutation = useMutation({
        mutationFn: async (item: PantryItem) => {
            const { error } = await supabase
                .from("pantry_items")
                .update(item)
                .eq("id", item.id);
            if (error) throw error;
        },
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ["pantry_items"] });
            const previousList = queryClient.getQueryData(["pantry_items"]);

            queryClient.setQueryData(["pantry_items"], (old: PantryItem[] = []) =>
                old.map((item) => (item.id === newItem.id ? newItem : item)),
            );

            return { previousList };
        },
        onError: (err, newItem, context) => {
            queryClient.setQueryData(["pantry_items"], context?.previousList);
            Alert.alert("Error", "Failed to update item.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["pantry_items"] });
        },
    });

    const deleteItemMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("pantry_items")
                .delete()
                .eq("id", id);
            if (error) throw error;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["pantry_items"] });
            const previousList = queryClient.getQueryData(["pantry_items"]);

            queryClient.setQueryData(["pantry_items"], (old: PantryItem[] = []) =>
                old.filter((item) => item.id !== id),
            );

            return { previousList };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(["pantry_items"], context?.previousList);
            Alert.alert("Error", "Failed to delete item.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["pantry_items"] });
        },
    });

    return {
        pantryList,
        loading: isLoading,
        addItem: addItemMutation.mutate,
        updateItem: updateItemMutation.mutate,
        deleteItem: deleteItemMutation.mutate,
    };
}
