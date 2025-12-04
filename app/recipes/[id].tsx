import { Colors, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/supabase/client";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import extracted logic and components
import UnitConverter from "@/components/UnitConverter";
import { generateRecipePDF } from "@/utils/pdfGenerator";
import {
  IngredientList,
  InstructionList,
  MacroSummary,
  PropertyRow,
} from "./_components";
import { processGroceryMerge } from "./_logic";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RecipeDetailScreen() {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
  const { id } = useLocalSearchParams();

  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [converterVisible, setConverterVisible] = useState(false);
  const [addingToPlan, setAddingToPlan] = useState(false);

  const loadRecipe = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id;

      const { data, error } = await supabase
        .from("recipes")
        .select(
          `*, photos:recipe_photos(photo_url), recipe_ingredients(*), recipe_steps(*)`,
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        const sortedSteps =
          data.recipe_steps?.sort(
            (a: any, b: any) => a.step_number - b.step_number,
          ) || [];
        setRecipe({
          ...data,
          image: data.photos?.[0]?.photo_url ?? null,
          recipe_steps: sortedSteps,
        });
        setIsFavorite(data.is_favorite || false);
        if (currentUserId && data.user_id === currentUserId) setIsOwner(true);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not load recipe.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRecipe();
  }, [loadRecipe]);

  const handleAddToMealPlan = async (day: string) => {
    if (!recipe) return;
    setAddingToPlan(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) throw new Error("User not found");

      const { error: planError } = await supabase.from("meal_plan").insert({
        user_id: userId,
        day,
        meal: recipe.title,
        recipe_id: recipe.id,
      });
      if (planError) throw planError;

      if (recipe.recipe_ingredients.length > 0) {
        const { data: currentGroceries } = await supabase
          .from("grocery_list")
          .select("*")
          .eq("user_id", userId)
          .eq("checked", false);

        const { itemsToInsert, itemsToUpdate } = processGroceryMerge(
          currentGroceries || [],
          recipe.recipe_ingredients,
          userId,
        );

        for (const update of itemsToUpdate) {
          await supabase
            .from("grocery_list")
            .update({ quantity: update.quantity })
            .eq("id", update.id);
        }
        if (itemsToInsert.length > 0) {
          await supabase.from("grocery_list").insert(itemsToInsert);
        }
      }
      setPlanModalVisible(false);
      Alert.alert(
        "Success",
        `Added to ${day}'s meal plan and groceries updated!`,
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setAddingToPlan(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete Recipe", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await supabase.from("recipes").delete().eq("id", id);
          router.replace("/");
        },
      },
    ]);
  };

  const shareRecipe = async () => {
    if (!recipe) return;
    try {
      const pdfUri = await generateRecipePDF(recipe);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
          dialogTitle: `Share ${recipe.title}`,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Could not generate PDF.");
    }
  };

  if (loading || !recipe) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView
        style={styles.floatingHeader}
        edges={["top", "left", "right"]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.glassButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.glassButton}
              onPress={() => setConverterVisible(true)}
            >
              <Ionicons name="calculator-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.glassButton} onPress={shareRecipe}>
              <Ionicons name="share-outline" size={22} color="#fff" />
            </TouchableOpacity>
            {isOwner && (
              <TouchableOpacity
                style={styles.glassButton}
                onPress={() => router.push(`/recipes/create?id=${id}`)}
              >
                <Ionicons name="pencil" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      <UnitConverter
        visible={converterVisible}
        onClose={() => setConverterVisible(false)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          {recipe.image ? (
            <Image
              source={recipe.image}
              style={styles.hero}
              contentFit="cover"
              transition={500}
              cachePolicy="memory-disk"
            />
          ) : (
            <View
              style={[
                styles.hero,
                styles.placeholder,
                { backgroundColor: theme.cardBorder },
              ]}
            >
              <MaterialCommunityIcons
                name="food-variant"
                size={60}
                color={theme.icon}
              />
            </View>
          )}
        </View>

        <View style={[styles.content, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {recipe.title}
          </Text>
          <View style={styles.mb24}>
            <PropertyRow
              icon="silverware-fork-knife"
              label="Meal Type"
              value={recipe.meal_type}
              theme={theme}
            />
            <PropertyRow
              icon="earth"
              label="Cuisine"
              value={recipe.cuisine}
              theme={theme}
            />
            <PropertyRow
              icon="school"
              label="Mastery"
              value={recipe.mastery}
              theme={theme}
            />
            <PropertyRow
              icon="clock-outline"
              label="Cook Time"
              value={`${recipe.cook_time || 0} min`}
              theme={theme}
            />
            <PropertyRow
              icon={isFavorite ? "heart" : "heart-outline"}
              label="Favorite"
              value={isFavorite ? "Yes" : "No"}
              theme={theme}
            />
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.cardBorder }]}
          />

          <MacroSummary recipe={recipe} theme={theme} />

          <View
            style={[styles.divider, { backgroundColor: theme.cardBorder }]}
          />

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Ingredients
          </Text>
          <IngredientList
            ingredients={recipe.recipe_ingredients}
            theme={theme}
          />

          <Text
            style={[styles.sectionTitle, styles.mt24, { color: theme.text }]}
          >
            Instructions
          </Text>
          <InstructionList steps={recipe.recipe_steps} theme={theme} />

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.tint, marginBottom: 16 },
            ]}
            onPress={() => router.push(`/recipes/${id}/cook`)}
            accessibilityRole="button"
            accessibilityLabel="Start Cooking Mode"
            accessibilityHint="Opens a step-by-step cooking view"
          >
            <Ionicons
              name="play-circle-outline"
              size={24}
              color="#fff"
              style={styles.mr8}
            />
            <Text style={styles.actionButtonText}>Start Cooking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card }]}
            onPress={() => setPlanModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Add to Meal Plan"
            accessibilityHint="Opens a modal to select a day to add this recipe to"
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.text}
              style={styles.mr8}
            />
            <Text style={[styles.actionButtonText, { color: theme.text }]}>
              Add to Meal Plan
            </Text>
          </TouchableOpacity>

          {isOwner && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              accessibilityRole="button"
              accessibilityLabel="Delete Recipe"
              accessibilityHint="Permanently deletes this recipe"
            >
              <Text style={styles.deleteText}>Delete Recipe</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal visible={planModalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPlanModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalHeader, { color: theme.text }]}>
              Pick a Day
            </Text>
            <Text style={[styles.mb16, { color: theme.mutedText }]}>
              This will add ingredients to your grocery list.
            </Text>

            {addingToPlan ? (
              <ActivityIndicator color={theme.tint} style={styles.p20} />
            ) : (
              <FlatList
                data={DAYS_OF_WEEK}
                keyExtractor={(item) => item}
                numColumns={3}
                columnWrapperStyle={styles.modalGrid}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      { borderColor: theme.cardBorder },
                    ]}
                    onPress={() => handleAddToMealPlan(item)}
                  >
                    <Text style={[styles.dayText, { color: theme.text }]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerActions: { flexDirection: "row", gap: 10 },
  glassButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: { width: "100%", height: 250 },
  hero: { width: "100%", height: "100%" },
  placeholder: { justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 120 },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  title: {
    ...Typography.heading,
    marginBottom: 24,
    lineHeight: 38,
  },
  divider: { height: 1, width: "100%", marginVertical: 20 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  mt24: { marginTop: 24 },
  sectionTitle: {
    ...Typography.subtitle,
    marginBottom: 12,
  },
  actionButton: {
    marginTop: 40,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButtonText: {
    ...Typography.body,
    color: "#fff",
    fontWeight: "700",
  },
  mr8: { marginRight: 8 },
  deleteBtn: { marginTop: 16, alignItems: "center" },
  deleteText: {
    ...Typography.body,
    color: "#ef4444",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: { width: "85%", borderRadius: 16, padding: 24 },
  modalHeader: {
    ...Typography.subtitle,
    marginBottom: 8,
  },
  modalGrid: { justifyContent: "space-between", gap: 10 },
  p20: { padding: 20 },
  dayButton: {
    width: "30%",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  dayText: {
    ...Typography.body,
    fontWeight: "600",
  },
});
