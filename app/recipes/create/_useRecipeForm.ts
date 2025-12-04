import { supabase } from "@/supabase/client";
import { IngredientInput, RecipeStepInput } from "@/types/recipe";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { fetchRecipeData, saveRecipeToDb } from "./_logic";

export function useRecipeForm(id: string | string[] | undefined) {
  const router = useRouter();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
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

  return {
    loading,
    setLoading,
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
  };
}
