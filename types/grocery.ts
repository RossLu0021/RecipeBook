export type GroceryCategory = {
  category: string;
  items: GroceryItem[];
};
export type GroceryItem = {
  id: string;
  user_id?: string;
  name: string;
  category: string | null;
  quantity?: number | null;
  unit?: string | null;
  checked: boolean;

  created_at?: string;
};
