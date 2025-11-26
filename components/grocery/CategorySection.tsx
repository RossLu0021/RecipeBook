import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import IngredientItem from "./IngredientItem";

export default function CategorySection({
  category,
  items,
  onToggle,
  onDelete,
  onAddPress,
}: {
  category: string;
  items: any[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddPress: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.header, { color: theme.text }]}>
        {category.toUpperCase()}
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card ?? theme.background,
            borderColor: theme.icon,
          },
        ]}
      >
        {items.map((item) => (
          <IngredientItem
            key={item.id}
            {...item}
            onToggle={() => onToggle(item.id)}
            onDelete={() => onDelete(item.id)}
          />
        ))}

        {/* + Add Item Button */}
        <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
          <Text style={[styles.addText, { color: theme.tint }]}>
            + Add item
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  header: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginTop: 4,
  },
  addText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
