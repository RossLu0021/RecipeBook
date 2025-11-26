import { supabase } from "@/supabase/client";
import { uploadImage } from "@/utils/uploadImage";
import { IngredientInput, RecipeStepInput } from "@/types/recipe";

// --- Types ---
export interface RecipeData {
  user_id: string;
  title: string;
  meal_type: string;
  cuisine: string;
  mastery: string;
  cook_time: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// --- Fetch Logic ---
export async function fetchRecipeData(recipeId: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `*, recipe_photos(photo_url), recipe_ingredients(*), recipe_steps(*)`,
    )
    .eq("id", recipeId)
    .single();

  if (error) throw error;
  return data;
}

// --- Save Logic ---
export async function saveRecipeToDb({
  isEditing,
  id,
  userData,
  recipePayload,
  coverImage,
  ingredients,
  steps,
}: {
  isEditing: boolean;
  id: string | string[] | undefined;
  userData: any;
  recipePayload: RecipeData;
  coverImage: string | null;
  ingredients: IngredientInput[];
  steps: RecipeStepInput[];
}) {
  let recipeId = id as string;

  // 1. Insert or Update Recipe
  if (isEditing) {
    const { error } = await supabase
      .from("recipes")
      .update(recipePayload)
      .eq("id", id);
    if (error) throw error;
    // Clear existing relations to re-insert (simplest strategy)
    await supabase.from("recipe_ingredients").delete().eq("recipe_id", id);
    await supabase.from("recipe_steps").delete().eq("recipe_id", id);
  } else {
    const { data, error } = await supabase
      .from("recipes")
      .insert(recipePayload)
      .select()
      .single();
    if (error) throw error;
    recipeId = data.id;
  }

  // 2. Handle Image Upload
  if (coverImage && !coverImage.startsWith("http")) {
    if (isEditing) {
      await supabase.from("recipe_photos").delete().eq("recipe_id", recipeId);
    }
    const publicUrl = await uploadImage(coverImage, userData.user.id, recipeId);
    if (publicUrl) {
      await supabase.from("recipe_photos").insert({
        recipe_id: recipeId,
        photo_url: publicUrl,
      });
    }
  }

  // 3. Insert Ingredients
  if (ingredients.length > 0) {
    await supabase.from("recipe_ingredients").insert(
      ingredients.map((i) => ({
        recipe_id: recipeId,
        name: i.name,
        quantity: Number(i.quantity) || null,
        unit: i.unit,
        category: i.category,
      })),
    );
  }

  // 4. Insert Steps
  if (steps.length > 0) {
    await supabase.from("recipe_steps").insert(
      steps.map((s, index) => ({
        recipe_id: recipeId,
        step_number: index + 1,
        instruction: s.text,
      })),
    );
  }
}
