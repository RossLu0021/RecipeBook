import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IngredientInput } from "@/types/recipe";

type Props = {
  item: IngredientInput;
  onChange: (id: string, field: keyof IngredientInput, value: string) => void;
  onRemove: (id: string) => void;
  // New prop to trigger the modal in parent
  onOpenSelector: (id: string, field: "quantity" | "unit") => void;
};

export default function IngredientRow({
  item,
  onChange,
  onRemove,
  onOpenSelector,
}: Props) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <View style={styles.row}>
      {/* 1. Quantity Pill */}
      <TouchableOpacity
        style={styles.pill}
        onPress={() => onOpenSelector(item.id, "quantity")}
      >
        <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14 }}>
          {item.quantity || "1"}
        </Text>
      </TouchableOpacity>

      {/* 2. Unit Pill */}
      <TouchableOpacity
        style={[styles.pill, { marginRight: 8, minWidth: 50 }]}
        onPress={() => onOpenSelector(item.id, "unit")}
      >
        <Text style={{ color: theme.text, fontSize: 14 }}>
          {item.unit || "-"}
        </Text>
      </TouchableOpacity>

      {/* 3. Name Input (Minimalist) */}
      <TextInput
        placeholder="Item name"
        placeholderTextColor={theme.mutedText}
        value={item.name}
        onChangeText={(val) => onChange(item.id, "name", val)}
        style={[
          styles.input,
          {
            color: theme.text,
            borderColor: theme.cardBorder,
            backgroundColor: theme.background,
          },
        ]}
      />

      {/* 4. Remove Button */}
      <TouchableOpacity
        onPress={() => onRemove(item.id)}
        style={styles.removeButton}
      >
        <Ionicons name="close-circle" size={20} color={theme.mutedText} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  // Notion-style Pill
  pill: {
    backgroundColor: "rgba(128,128,128, 0.1)", // Light gray background
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 6,
    minWidth: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    borderBottomWidth: 1, // Clean underline style
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 16,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
});
