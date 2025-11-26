import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Text,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import type { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/recipe/recipeCard";
import { supabase } from "@/supabase/client";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RecipesScreen() {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      // Adding 'void' fixes the "Promise returned is ignored" warning
      void loadRecipes();
    }, []),
  );

  // Filter logic whenever search query or recipes change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(lowerQuery) ||
          recipe.meal_type?.toLowerCase().includes(lowerQuery) ||
          recipe.cuisine?.toLowerCase().includes(lowerQuery),
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, recipes]);

  async function loadRecipes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("recipes")
      .select("*, photos:recipe_photos(photo_url)")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Failed to load recipes:", error.message);
    } else {
      setRecipes(data as Recipe[]);
      setFilteredRecipes(data as Recipe[]); // Initialize filtered list
    }
    setLoading(false);
  }

  const handleNewRecipe = () => {
    router.push("/recipes/create");
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <Stack.Screen
        options={{
          headerTitle: "My Recipes",
          headerRight: () => (
            <TouchableOpacity
              onPress={handleNewRecipe}
              style={styles.headerRightBtn}
            >
              <Ionicons name="add" size={28} color={theme.tint} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.container}>
        {/* SEARCH BAR */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.mutedText}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search recipes (e.g. Pasta, Dinner)..."
            placeholderTextColor={theme.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.text }]}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.mutedText} />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.tint} />
          </View>
        ) : (
          <FlatList
            data={filteredRecipes} // Using the filtered state
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.center}>
                <Ionicons
                  name="book-outline"
                  size={60}
                  color={theme.mutedText}
                />
                <View style={styles.emptySpacer} />
                <Text style={[styles.emptyText, { color: theme.mutedText }]}>
                  {searchQuery ? "No recipes found." : "No recipes yet."}
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.tint }]}
        onPress={handleNewRecipe}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  headerRightBtn: {
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 100,
    gap: 16,
  },
  emptySpacer: {
    height: 10,
  },
  emptyText: {
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
