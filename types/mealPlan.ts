export type MealPlan = {
  id: string;
  user_id: string;
  day: string; // "Mon", "Tue", etc.
  meal: string; // Breakfast | Lunch | Dinner
  recipe_id: string | null;
  created_at: string;
};
