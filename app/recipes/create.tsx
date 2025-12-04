import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import IngredientEditor from "@/components/ui/IngredientEditor";
import StepEditor from "@/components/ui/StepEditor";
import { supabase } from "@/supabase/client";

// Logic and Components
import {
  MacroInput,
  MenuModal,
  PropertyRow,
  SelectionModal,
} from "./create/_components";
import { useRecipeForm } from "./create/_useRecipeForm";

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
  const {
    loading,
    coverImage,
    setCoverImage,
    title,
    setTitle,
    isFavorite,
    setIsFavorite,
    mealType,
    setMealType,
    cuisine,
    setCuisine,
    mastery,
    setMastery,
    cookTime,
    setCookTime,
    macros,
    setMacros,
    ingredients,
    setIngredients,
    steps,
    setSteps,
    handleSave,
    isEditing,
  } = useRecipeForm(id);

  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    "cuisine" | "meal" | "mastery" | null
  >(null);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  }, [setCoverImage]);

  const handleShare = useCallback(async () => {
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
  }, [isEditing, coverImage, title]);

  const handleDelete = useCallback(async () => {
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
  }, [isEditing, id, router]);

  const openModal = useCallback((type: "cuisine" | "meal" | "mastery") => {
    setModalType(type);
    setSelectionModalVisible(true);
  }, []);

  const handleSelection = useCallback(
    (val: string) => {
      if (modalType === "cuisine") setCuisine(val);
      if (modalType === "meal") setMealType(val);
      if (modalType === "mastery") setMastery(val);
      setSelectionModalVisible(false);
    },
    [modalType, setCuisine, setMealType, setMastery],
  );

  const getCurrentSelection = useCallback(() => {
    if (modalType === "cuisine") return cuisine;
    if (modalType === "meal") return mealType;
    return mastery;
  }, [modalType, cuisine, mealType, mastery]);

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
            accessibilityLabel="Recipe Title"
            accessibilityHint="Enter the name of your recipe"
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
                <Text
                  style={[styles.cookTimeLabel, { color: theme.mutedText }]}
                >
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
                accessibilityLabel="Cook Time"
                accessibilityHint="Enter cooking time in minutes"
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
            accessibilityRole="button"
            accessibilityLabel="Save Recipe"
            accessibilityState={{ disabled: loading }}
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
  cookTimeLabel: { fontSize: 15 },
});
