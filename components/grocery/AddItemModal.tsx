import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { GROCERY_CATEGORIES, inferCategory } from "@/utils/groceryUtils"; // Make sure to import this
import { useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddItemModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (item: {
    name: string;
    quantity: number;
    unit: string;
    category: string;
  }) => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("Other"); // Default to Other

  // Auto-predict category when name changes
  useEffect(() => {
    if (name.length > 2) {
      const predicted = inferCategory(name);
      if (predicted !== "Other") {
        setCategory(predicted);
      }
    }
  }, [name]);

  const submit = () => {
    if (!name.trim()) return;
    onSave({
      name,
      quantity: Number(quantity) || 1,
      unit: unit || "",
      category: category || "Other",
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    onClose();
    setName("");
    setQuantity("");
    setUnit("");
    setCategory("Other");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            Add Grocery Item
          </Text>

          {/* Name Input */}
          <TextInput
            placeholder="Item name (e.g. Milk)"
            placeholderTextColor={theme.mutedText}
            value={name}
            onChangeText={setName}
            autoFocus
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.cardBorder,
                backgroundColor: theme.background,
              },
            ]}
          />

          {/* Quantity Row */}
          <View style={styles.row}>
            <TextInput
              placeholder="Qty"
              placeholderTextColor={theme.mutedText}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={[
                styles.input,
                styles.halfInput,
                {
                  color: theme.text,
                  borderColor: theme.cardBorder,
                  backgroundColor: theme.background,
                },
              ]}
            />
            <TextInput
              placeholder="Unit (e.g. lbs)"
              placeholderTextColor={theme.mutedText}
              value={unit}
              onChangeText={setUnit}
              style={[
                styles.input,
                styles.halfInput,
                {
                  color: theme.text,
                  borderColor: theme.cardBorder,
                  backgroundColor: theme.background,
                },
              ]}
            />
          </View>

          {/* Category Selector (Horizontal Scroll) */}
          <Text style={[styles.label, { color: theme.mutedText }]}>
            Category: {category}
          </Text>
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {GROCERY_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                const textStyle = {
                  color: isSelected ? "#fff" : theme.text,
                  fontWeight: isSelected ? "600" : "400",
                } as const;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setCategory(cat);
                      Keyboard.dismiss();
                    }}
                    style={[
                      styles.categoryPill,
                      {
                        backgroundColor: isSelected ? theme.tint : theme.pillBg,
                        borderColor: isSelected ? theme.tint : theme.cardBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.categoryText, textStyle]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={resetAndClose}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={{ color: theme.mutedText }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={submit}
              style={[styles.button, { backgroundColor: theme.tint }]}
            >
              <Text style={styles.saveText}>Save Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 2,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
  },
  categoryContainer: { height: 50, marginBottom: 12 },
  categoryScroll: { gap: 8 },
  categoryText: { fontSize: 13 },
  saveText: { color: "#fff", fontWeight: "bold" },
});
