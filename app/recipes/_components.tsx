import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

// Property Row Component
export const PropertyRow = ({ icon, label, value, theme }: any) => (
  <View style={styles.propRow}>
    <View style={styles.rowCenter}>
      <MaterialCommunityIcons
        name={icon}
        size={18}
        color={theme.mutedText}
        style={styles.mr8}
      />
      <Text style={[styles.fs15, { color: theme.mutedText }]}>{label}</Text>
    </View>
    <Text style={[styles.propValue, { color: theme.text }]}>
      {value || "-"}
    </Text>
  </View>
);

// Macro Summary Component
export const MacroSummary = ({ recipe, theme }: any) => (
  <View style={styles.mb20}>
    <Text style={[styles.macroHeader, { color: theme.mutedText }]}>
      # Macro Summary
    </Text>
    <Text style={[styles.macroBody, { color: theme.text }]}>
      This meal has <Text style={styles.calText}>{recipe.calories || 0}</Text>{" "}
      calories, <Text style={styles.proText}>{recipe.protein || 0}g</Text>{" "}
      protein, <Text style={styles.carbText}>{recipe.carbs || 0}g</Text>{" "}
      carbohydrates, and <Text style={styles.fatText}>{recipe.fats || 0}g</Text>{" "}
      fats.
    </Text>
  </View>
);

// Ingredients List Component
export const IngredientList = ({ ingredients, theme }: any) => (
  <View
    style={[
      styles.listContainer,
      { backgroundColor: theme.card, borderColor: theme.cardBorder },
    ]}
  >
    {ingredients?.length > 0 ? (
      ingredients.map((ing: any, i: number) => (
        <View
          key={ing.id}
          style={[
            styles.ingredientRow,
            i !== ingredients.length - 1 && styles.borderBottom,
          ]}
        >
          <Text style={[styles.ingName, { color: theme.text }]}>
            {ing.name}
          </Text>
          <Text style={[styles.fs16, { color: theme.mutedText }]}>
            {ing.quantity} {ing.unit}
          </Text>
        </View>
      ))
    ) : (
      <Text style={[styles.emptyListText, { color: theme.mutedText }]}>
        No ingredients listed.
      </Text>
    )}
  </View>
);

// Instructions List Component
export const InstructionList = ({ steps, theme }: any) => (
  <View style={styles.stepContainer}>
    {steps?.length > 0 ? (
      steps.map((step: any, index: number) => (
        <View key={step.id} style={styles.stepRow}>
          <Text style={[styles.stepNum, { color: theme.mutedText }]}>
            {index + 1}.
          </Text>
          <Text style={[styles.stepText, { color: theme.text }]}>
            {step.instruction}
          </Text>
        </View>
      ))
    ) : (
      <Text style={{ color: theme.mutedText }}>No instructions listed.</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  propRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
  rowCenter: { flexDirection: "row", alignItems: "center" },
  mr8: { marginRight: 8 },
  fs15: { fontSize: 15 },
  fs16: { fontSize: 16 },
  propValue: { fontSize: 15, fontWeight: "500" },
  mb20: { marginBottom: 20 },
  macroHeader: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  macroBody: { fontSize: 15, lineHeight: 24 },
  calText: { color: "#eab308", fontWeight: "700" },
  proText: { color: "#3b82f6", fontWeight: "700" },
  carbText: { color: "#ef4444", fontWeight: "700" },
  fatText: { color: "#22c55e", fontWeight: "700" },
  listContainer: { borderRadius: 12, overflow: "hidden", borderWidth: 1 },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  ingName: { fontSize: 16, fontWeight: "500" },
  emptyListText: { padding: 12 },
  stepContainer: { gap: 16 },
  stepRow: { flexDirection: "row" },
  stepNum: { fontSize: 16, fontWeight: "600", width: 24, marginTop: 2 },
  stepText: { flex: 1, fontSize: 16, lineHeight: 24 },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
});
