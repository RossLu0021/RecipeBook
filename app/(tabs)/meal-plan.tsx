import PillSelector from "@/components/recipe/pillSelector";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MealPlanItem, useMealPlanQuery } from "@/hooks/useMealPlanQuery";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MealPlanTab() {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
  const [selectedDay, setSelectedDay] = useState("Mon");

  const { meals, loading, removeMeal } = useMealPlanQuery(selectedDay);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.container}>
        <View style={styles.pillWrapper}>
          <PillSelector selectedDay={selectedDay} onSelect={setSelectedDay} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Meal Plan</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {/* avoids eslint unescaped-entities */}
              {`${selectedDay}\u2019s Menu`}
            </Text>

            <TouchableOpacity onPress={() => router.push("/")}>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={theme.tint}
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={theme.tint} style={styles.mt20} />
          ) : meals.length > 0 ? (
            <View style={styles.mealList}>
              {meals.map((item: MealPlanItem) => (
                <View
                  key={item.id}
                  style={[styles.mealRow, { borderBottomColor: theme.divider }]}
                >
                  <TouchableOpacity
                    style={styles.flex1}
                    onPress={() => router.push(`/recipes/${item.recipe_id}`)}
                  >
                    <View style={styles.mealContent}>
                      <Ionicons
                        name="restaurant-outline"
                        size={18}
                        color={theme.mutedText}
                        style={styles.mr8}
                      />
                      <Text style={[styles.mealText, { color: theme.text }]}>
                        {item.meal}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => removeMeal(item.id)}
                    style={styles.p4}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.cardSubtitle, { color: theme.mutedText }]}>
                No meals planned for {selectedDay}.
              </Text>

              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.tint }]}
                onPress={() => router.push("/")}
              >
                <Text style={styles.addButtonText}>Browse Recipes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },
  pillWrapper: { marginTop: 0, paddingTop: 4, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 12 },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 4,
    minHeight: 200,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: { fontSize: 20, fontWeight: "700" },
  mealList: { gap: 4 },
  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  mealText: { fontSize: 16, fontWeight: "500" },
  emptyState: { marginTop: 20, alignItems: "flex-start" },
  cardSubtitle: { fontSize: 15, marginBottom: 20 },
  addButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  addButtonText: { fontSize: 15, fontWeight: "600", color: "#fff" },
  mt20: { marginTop: 20 },
  flex1: { flex: 1 },
  mealContent: { flexDirection: "row", alignItems: "center" },
  mr8: { marginRight: 8 },
  p4: { padding: 4 },
});
