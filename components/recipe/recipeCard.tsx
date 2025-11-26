import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import type { Recipe } from "@/types/recipe";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const MACRO_COLORS = {
  calories: "#eab308",
  protein: "#3b82f6",
  carbs: "#ef4444",
  fats: "#22c55e",
};

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const imageUrl = recipe.photos?.[0]?.photo_url ?? null;

  const tags = [
    { text: recipe.cuisine, type: "cuisine" as const },
    { text: recipe.meal_type, type: "meal" as const },
    { text: recipe.mastery, type: "mastery" as const },
    {
      text: recipe.cook_time ? `${recipe.cook_time} min` : null,
      type: "default" as const,
    },
  ].filter((t) => t.text);

  const getTagStyles = (type: "cuisine" | "meal" | "mastery" | "default") => {
    if (type === "default") return { bg: theme.pillBg, text: theme.pillText };
    return { bg: theme.tagBackground[type], text: theme.tagText[type] };
  };

  // Handle Edit Navigation
  const handleEdit = (e: any) => {
    e.stopPropagation();
    router.push(`/recipes/create?id=${recipe.id}`);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
        theme.shadow,
      ]}
      onPress={() => router.push(`/recipes/${recipe.id}`)}
      activeOpacity={0.9}
    >
      {imageUrl ? (
        <Image
          source={imageUrl}
          style={styles.image}
          contentFit="cover"
          transition={500}
          cachePolicy="memory-disk"
        />
      ) : (
        <View
          style={[
            styles.image,
            styles.placeholder,
            { backgroundColor: theme.pillBg },
          ]}
        >
          <MaterialCommunityIcons
            name="food-variant"
            size={40}
            color={theme.icon}
          />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleWrapper}>
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={18}
              color={theme.sectionHeader}
              style={styles.titleIcon}
            />
            <Text
              numberOfLines={1}
              style={[styles.title, { color: theme.text }]}
            >
              {recipe.title}
            </Text>
          </View>

          {/* Edit Button */}
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color={theme.tint}
            />
          </TouchableOpacity>
        </View>

        {/* FULL MACRO SUMMARY */}
        <Text style={[styles.macroText, { color: theme.mutedText }]}>
          This meal has <Text style={styles.hlCal}>{recipe.calories || 0}</Text>{" "}
          calories, <Text style={styles.hlPro}>{recipe.protein || 0}g</Text>{" "}
          protein, <Text style={styles.hlCarb}>{recipe.carbs || 0}g</Text>{" "}
          carbohydrates, and{" "}
          <Text style={styles.hlFat}>{recipe.fats || 0}g</Text> fats.
        </Text>

        <View style={styles.tagsRow}>
          {tags.map((tag, index) => {
            const style = getTagStyles(tag.type);
            return (
              <View
                key={index}
                style={[styles.tag, { backgroundColor: style.bg }]}
              >
                <Text style={[styles.tagText, { color: style.text }]}>
                  {tag.text}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 180,
  },
  placeholder: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  titleIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  macroText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  // Macro Highlights
  hlCal: { color: MACRO_COLORS.calories, fontWeight: "700" },
  hlPro: { color: MACRO_COLORS.protein, fontWeight: "700" },
  hlCarb: { color: MACRO_COLORS.carbs, fontWeight: "700" },
  hlFat: { color: MACRO_COLORS.fats, fontWeight: "700" },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
  },
  editButton: {
    padding: 8,
    marginLeft: 4,
  },
});
