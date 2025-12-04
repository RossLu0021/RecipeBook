import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

const IngredientList = memo(function IngredientList({
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
    <View style={styles.container}>
      {ingredients.length === 0 && (
        <Text style={[styles.emptyText, { color: theme.mutedText }]}>
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
});

export default IngredientList;

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  emptyText: { fontStyle: "italic" },
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
