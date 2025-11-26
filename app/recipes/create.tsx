import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { SafeAreaView } from "react-native-safe-area-context";

import IngredientEditor from "@/components/ui/IngredientEditor";
import StepEditor from "@/components/ui/StepEditor";
import { supabase } from "@/supabase/client";
import { IngredientInput, RecipeStepInput } from "@/types/recipe";

// Logic and Components
import { fetchRecipeData, saveRecipeToDb } from "./create/logic";
import {
  PropertyRow,
  MacroInput,
  SelectionModal,
  MenuModal,
} from "./create/components";

const CUISINES = [
  "American",
  "African",
  "Asian",
  "Caribbean",
  "Indian",
  "Italian",
  "Mexican",
  "Middle Eastern",
  "French",
  "Mediterranean",
  "Other",
];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const MASTERY_LEVELS = ["Learning", "Unlearned", "Mastered"];

export default function CreateRecipeScreen() {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    "cuisine" | "meal" | "mastery" | null
  >(null);

  // State
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [mealType, setMealType] = useState("Dinner");
  const [cuisine, setCuisine] = useState("American");
  const [mastery, setMastery] = useState("Learning");
  const [cookTime, setCookTime] = useState("");
  const [macros, setMacros] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [ingredients, setIngredients] = useState<IngredientInput[]>([]);
  const [steps, setSteps] = useState<RecipeStepInput[]>([]);

  useEffect(() => {
    if (isEditing && id) loadExistingRecipe(id as string);
  }, [id, isEditing]);

  async function loadExistingRecipe(recipeId: string) {
    setLoading(true);
    try {
      const data = await fetchRecipeData(recipeId);
      if (data) {
        setTitle(data.title);
        setMealType(data.meal_type || "Dinner");
        setCuisine(data.cuisine || "American");
        setMastery(data.mastery || "Learning");
        setCookTime(data.cook_time?.toString() || "");
        setIsFavorite(data.is_favorite || false);
        setMacros({
          calories: data.calories?.toString() || "",
          protein: data.protein?.toString() || "",
          carbs: data.carbs?.toString() || "",
          fats: data.fats?.toString() || "",
        });
        if (data.recipe_photos?.[0])
          setCoverImage(data.recipe_photos[0].photo_url);
        if (data.recipe_ingredients) {
          setIngredients(
            data.recipe_ingredients.map((ing: any) => ({
              id: ing.id,
              name: ing.name,
              quantity: ing.quantity?.toString() || "",
              unit: ing.unit,
              category: ing.category || "Other",
            })),
          );
        }
        if (data.recipe_steps) {
          const sorted = data.recipe_steps.sort(
            (a: any, b: any) => a.step_number - b.step_number,
          );
          setSteps(sorted.map((s: any) => ({ id: s.id, text: s.instruction })));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  }

  async function handleShare() {
    setMenuModalVisible(false);
    if (!isEditing)
      return Alert.alert(
        "Save First",
        "Please save the recipe before sharing.",
      );
    if (await Sharing.isAvailableAsync())
      await Sharing.shareAsync(coverImage || "", {
        dialogTitle: `Check out my recipe: ${title}`,
      });
  }

  async function handleDelete() {
    setMenuModalVisible(false);
    if (!isEditing) return;
    Alert.alert("Delete Recipe", "Are you sure?", [
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
  }

  async function handleSave() {
    if (!title.trim())
      return Alert.alert("Missing Title", "Please enter a recipe title.");
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      await saveRecipeToDb({
        isEditing,
        id,
        userData,
        coverImage,
        ingredients,
        steps,
        recipePayload: {
          user_id: userData.user.id,
          title,
          meal_type: mealType,
          cuisine,
          mastery,
          cook_time: Number(cookTime) || 0,
          calories: Number(macros.calories) || 0,
          protein: Number(macros.protein) || 0,
          carbs: Number(macros.carbs) || 0,
          fats: Number(macros.fats) || 0,
        },
      });
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  const openModal = (type: "cuisine" | "meal" | "mastery") => {
    setModalType(type);
    setSelectionModalVisible(true);
  };
  const handleSelection = (val: string) => {
    if (modalType === "cuisine") setCuisine(val);
    if (modalType === "meal") setMealType(val);
    if (modalType === "mastery") setMastery(val);
    setSelectionModalVisible(false);
  };
  const getCurrentSelection = () => {
    if (modalType === "cuisine") return cuisine;
    if (modalType === "meal") return mealType;
    return mastery;
  };

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
          <TouchableOpacity
            style={styles.glassButton}
            onPress={() => setMenuModalVisible(true)}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={pickImage} style={styles.coverContainer}>
          {coverImage ? (
            <Image source={{ uri: coverImage }} style={styles.coverImage} />
          ) : (
            <View
              style={[
                styles.coverPlaceholder,
                { backgroundColor: theme.cardBorder },
              ]}
            >
              <MaterialCommunityIcons
                name="image-plus"
                size={30}
                color={theme.mutedText}
              />
              <Text style={[styles.coverText, { color: theme.mutedText }]}>
                Add Cover
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <TextInput
            placeholder="Untitled Recipe"
            placeholderTextColor={theme.mutedText}
            value={title}
            onChangeText={setTitle}
            multiline
            style={[styles.titleInput, { color: theme.text }]}
          />

          <View style={styles.mb24}>
            <PropertyRow
              icon="silverware-fork-knife"
              label="Meal Type"
              value={mealType}
              onPress={() => openModal("meal")}
              theme={theme}
            />
            <PropertyRow
              icon="earth"
              label="Cuisine"
              value={cuisine}
              onPress={() => openModal("cuisine")}
              theme={theme}
            />
            <PropertyRow
              icon="school"
              label="Mastery"
              value={mastery}
              onPress={() => openModal("mastery")}
              theme={theme}
            />
            <View style={styles.propRow}>
              <View style={styles.propLabelContainer}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={18}
                  color={theme.mutedText}
                  style={styles.mr8}
                />
                <Text style={{ color: theme.mutedText, fontSize: 15 }}>
                  Cook Time (min)
                </Text>
              </View>
              <TextInput
                value={cookTime}
                onChangeText={setCookTime}
                placeholder="0"
                placeholderTextColor={theme.mutedText}
                keyboardType="numeric"
                style={[styles.cookTimeInput, { color: theme.text }]}
              />
            </View>
            <PropertyRow
              icon="heart"
              label="Favorite"
              isCheckbox
              isFavorite={isFavorite}
              onPress={() => setIsFavorite(!isFavorite)}
              theme={theme}
            />
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.cardBorder }]}
          />

          <View style={styles.mb20}>
            <Text style={[styles.macroHeader, { color: theme.mutedText }]}>
              # Macro Summary
            </Text>
            <Text style={[styles.macroBody, { color: theme.text }]}>
              This meal has{" "}
              <Text style={styles.calText}>{macros.calories || 0}</Text>{" "}
              calories,{" "}
              <Text style={styles.proText}>{macros.protein || 0}g</Text>{" "}
              protein, <Text style={styles.carbText}>{macros.carbs || 0}g</Text>{" "}
              carbohydrates, and{" "}
              <Text style={styles.fatText}>{macros.fats || 0}g</Text> fats.
            </Text>
          </View>

          <View style={styles.mb24}>
            <MacroInput
              label="Calories"
              val={macros.calories}
              setter={(t: string) => setMacros({ ...macros, calories: t })}
              theme={theme}
            />
            <MacroInput
              label="Protein"
              val={macros.protein}
              setter={(t: string) => setMacros({ ...macros, protein: t })}
              theme={theme}
            />
            <MacroInput
              label="Carbs"
              val={macros.carbs}
              setter={(t: string) => setMacros({ ...macros, carbs: t })}
              theme={theme}
            />
            <MacroInput
              label="Fats"
              val={macros.fats}
              setter={(t: string) => setMacros({ ...macros, fats: t })}
              theme={theme}
            />
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.cardBorder }]}
          />
          <IngredientEditor
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
          <View style={styles.h20} />
          <StepEditor steps={steps} setSteps={setSteps} />

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.tint }]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Save Recipe</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SelectionModal
        visible={selectionModalVisible}
        onClose={() => setSelectionModalVisible(false)}
        type={modalType}
        options={
          modalType === "cuisine"
            ? CUISINES
            : modalType === "meal"
              ? MEAL_TYPES
              : MASTERY_LEVELS
        }
        onSelect={handleSelection}
        currentSelection={getCurrentSelection()}
        theme={theme}
      />

      <MenuModal
        visible={menuModalVisible}
        onClose={() => setMenuModalVisible(false)}
        onShare={handleShare}
        onDelete={handleDelete}
        isEditing={isEditing}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  glassButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  scrollContent: { paddingBottom: 100 },
  coverContainer: { width: "100%", height: 250 },
  coverImage: { width: "100%", height: "100%", resizeMode: "cover" },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  coverText: { marginTop: 8, fontSize: 12 },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  titleInput: { fontSize: 32, fontWeight: "bold", marginBottom: 24 },
  propRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    height: 44,
  },
  propLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
  },
  mr8: { marginRight: 8 },
  cookTimeInput: { fontSize: 15, textAlign: "right", minWidth: 50, padding: 0 },
  divider: { height: 1, width: "100%", marginVertical: 20 },
  mb20: { marginBottom: 20 },
  mb24: { marginBottom: 24 },
  macroHeader: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  macroBody: { fontSize: 15, lineHeight: 24 },
  calText: { color: "#eab308", fontWeight: "700" },
  proText: { color: "#3b82f6", fontWeight: "700" },
  carbText: { color: "#ef4444", fontWeight: "700" },
  fatText: { color: "#22c55e", fontWeight: "700" },
  h20: { height: 20 },
  saveButton: {
    marginTop: 40,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
