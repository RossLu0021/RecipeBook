import { inferCategory } from "@/utils/groceryUtils";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export const processGroceryMerge = (
  currentGroceries: any[],
  recipeIngredients: Ingredient[],
  userId: string,
) => {
  const itemsToInsert: any[] = [];
  const itemsToUpdate: any[] = [];

  recipeIngredients.forEach((ing) => {
    const normName = ing.name.trim().toLowerCase();
    const normUnit = ing.unit ? ing.unit.trim().toLowerCase() : "";

    // Check if exists
    const existingItem = currentGroceries?.find(
      (g) =>
        g.name.trim().toLowerCase() === normName &&
        (g.unit || "").trim().toLowerCase() === normUnit,
    );

    if (existingItem) {
      itemsToUpdate.push({
        id: existingItem.id,
        quantity:
          (Number(existingItem.quantity) || 0) + (Number(ing.quantity) || 0),
      });
    } else {
      let finalCategory = ing.category;
      if (!finalCategory || finalCategory === "Other") {
        finalCategory = inferCategory(ing.name);
      }
      itemsToInsert.push({
        user_id: userId,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        category: finalCategory,
        checked: false,
      });
    }
  });

  return { itemsToInsert, itemsToUpdate };
};
