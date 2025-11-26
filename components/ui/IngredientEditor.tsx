import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  Keyboard,
} from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import { IngredientInput } from "@/types/recipe";
import IngredientRow from "@/components/recipe/IngredientRow";

// --- OPTIONS ---
const QUANTITIES = [
  "0.25",
  "0.5",
  "0.75",
  "1",
  "1.25",
  "1.5",
  "1.75",
  "2",
  "2.5",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "16",
  "24",
  "32",
];

const UNITS = [
  "-",
  "cup",
  "tbsp",
  "tsp",
  "oz",
  "lb",
  "g",
  "kg",
  "ml",
  "l",
  "clove",
  "slice",
  "piece",
  "can",
  "pinch",
  "dash",
  "bunch",
  "package",
  "stick",
];

type Props = {
  ingredients: IngredientInput[];
  setIngredients: (items: IngredientInput[]) => void;
};

export default function IngredientEditor({
  ingredients,
  setIngredients,
}: Props) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<"quantity" | "unit" | null>(
    null,
  );

  function addIngredient() {
    setIngredients([
      ...ingredients,
      {
        id: Math.random().toString(),
        name: "",
        quantity: "1",
        unit: "-",
        category: "Other",
      },
    ]);
  }

  function updateIngredient(
    id: string,
    field: keyof IngredientInput,
    value: string,
  ) {
    setIngredients(
      ingredients.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    );
  }

  function removeIngredient(id: string) {
    setIngredients(ingredients.filter((i) => i.id !== id));
  }

  // --- MODAL HANDLERS ---
  function openSelector(id: string, field: "quantity" | "unit") {
    // Dismiss keyboard so it doesn't block the modal
    Keyboard.dismiss();
    setActiveId(id);
    setActiveField(field);
    setModalVisible(true);
  }

  function handleSelection(value: string) {
    if (activeId && activeField) {
      updateIngredient(activeId, activeField, value);
    }
    setModalVisible(false);
  }

  const getOptions = () => {
    if (activeField === "quantity") return QUANTITIES;
    if (activeField === "unit") return UNITS;
    return [];
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.mutedText }]}>
        INGREDIENTS
      </Text>

      {ingredients.map((i) => (
        <IngredientRow
          key={i.id}
          item={i}
          onChange={updateIngredient}
          onRemove={removeIngredient}
          // Pass the trigger function down
          onOpenSelector={openSelector}
        />
      ))}

      <TouchableOpacity
        onPress={addIngredient}
        style={[styles.addButton, { borderColor: theme.cardBorder }]}
      >
        <Text style={{ color: theme.tint, fontWeight: "600" }}>
          + Add Ingredient
        </Text>
      </TouchableOpacity>

      {/* --- SELECTION MODAL --- */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalHeader, { color: theme.text }]}>
              Select {activeField === "quantity" ? "Quantity" : "Unit"}
            </Text>
            <FlatList
              data={getOptions()}
              keyExtractor={(item) => item}
              numColumns={3}
              columnWrapperStyle={{ gap: 10 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    { borderColor: theme.cardBorder },
                  ]}
                  onPress={() => handleSelection(item)}
                >
                  <Text style={{ color: theme.text, fontSize: 16 }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "60%",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
});
