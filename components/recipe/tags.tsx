import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function Tags({
  mealType,
  cuisine,
  mastery,
}: {
  mealType?: string;
  cuisine?: string;
  mastery?: string;
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <View style={styles.row}>
      {mealType && (
        <View
          style={[styles.tag, { backgroundColor: theme.tagBackground.meal }]}
        >
          <Text style={[styles.tagText, { color: theme.tagText.meal }]}>
            {mealType}
          </Text>
        </View>
      )}

      {cuisine && (
        <View
          style={[styles.tag, { backgroundColor: theme.tagBackground.cuisine }]}
        >
          <Text style={[styles.tagText, { color: theme.tagText.cuisine }]}>
            {cuisine}
          </Text>
        </View>
      )}

      {mastery && (
        <View
          style={[styles.tag, { backgroundColor: theme.tagBackground.mastery }]}
        >
          <Text style={[styles.tagText, { color: theme.tagText.mastery }]}>
            {mastery}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
