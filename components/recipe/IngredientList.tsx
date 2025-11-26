import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function IngredientList({
  ingredients,
}: {
  ingredients: {
    name: string;
    quantity: number | null;
    unit: string | null;
  }[];
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <View style={{ marginTop: 8 }}>
      {ingredients.length === 0 && (
        <Text style={{ color: theme.mutedText, fontStyle: "italic" }}>
          No ingredients listed.
        </Text>
      )}

      {ingredients.map((ing) => (
        <View key={ing.name} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: theme.text }]} />
          <Text style={[styles.text, { color: theme.text }]}>
            {ing.quantity ? `${ing.quantity} ` : ""}
            {ing.unit ? `${ing.unit} ` : ""}
            {ing.name}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 16,
  },
});
