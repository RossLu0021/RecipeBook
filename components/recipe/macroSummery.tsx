import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function MacroSummary({
  calories,
  protein,
  carbs,
  fats,
}: {
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  if (!calories && !protein && !carbs && !fats) return null;

  return (
    <Text style={[styles.text, { color: theme.mutedText }]}>
      This meal has {calories ? `${calories} calories` : ""}
      {protein ? `, ${protein}g protein` : ""}
      {carbs ? `, ${carbs}g carbohydrates` : ""}
      {fats ? `, and ${fats}g fats.` : ""}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    marginBottom: 12,
  },
});
