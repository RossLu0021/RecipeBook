import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function NewRecipeCard() {
  return (
    <TouchableOpacity
      onPress={() => router.push("/recipes/create")}
      style={styles.card}
      activeOpacity={0.8}
    >
      <Text style={styles.plus}>＋</Text>
      <Text style={styles.text}>New Recipe</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    height: 180,
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: "#e3e3e3",
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  plus: {
    fontSize: 38,
    color: "#999",
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: "#777",
  },
});
