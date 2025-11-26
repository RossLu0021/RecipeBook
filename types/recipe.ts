// -----------------------------
// PHOTO
// -----------------------------
export type RecipePhoto = {
  id: string;
  recipe_id: string;
  photo_url: string;
};

// -----------------------------
// INGREDIENT
// -----------------------------
export type RecipeIngredient = {
  id: string;
  recipe_id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
};

// Input version (Create/Edit)
export type RecipeIngredientInput = {
  name: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
};

// Input version used in IngredientEditor (contains generated ID)
export type IngredientInput = {
  id: string;
  name: string;
  quantity: string | number;
  unit: string;
  category: string;
};

// -----------------------------
// STEPS
// -----------------------------
export type RecipeStep = {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
};

// -----------------------------
// MAIN RECIPE
// -----------------------------
export type Recipe = {
  id: string;
  user_id: string;

  title: string;
  description: string | null;

  cuisine: string | null;
  meal_type: string | null;
  mastery: string | null;

  cook_time: number | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fats: number | null;

  created_at: string;

  // Joins
  photos?: RecipePhoto[];
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
};

// Input version used in StepEditor (contains generated ID)
export type RecipeStepInput = {
  id: string;
  text: string;
};
