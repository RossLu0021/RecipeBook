import { Colors, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/supabase/client";
import { Ionicons } from "@expo/vector-icons";
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView, // Imported for Card layout
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function CookingModeScreen() {
  useKeepAwake(); // Prevent screen from sleeping
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*, recipe_steps(*)")
        .eq("id", id)
        .single();

      if (data) {
        const sortedSteps =
          data.recipe_steps?.sort(
            (a: any, b: any) => a.step_number - b.step_number,
          ) || [];
        setRecipe({ ...data, recipe_steps: sortedSteps });
      }
      setLoading(false);
    };
    fetchRecipe();
  }, [id]);

  const handleNext = () => {
    if (currentStepIndex < (recipe?.recipe_steps?.length || 0) - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Finished
      router.back();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  if (!recipe || !recipe.recipe_steps || recipe.recipe_steps.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          No steps found for this recipe.
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={{ color: theme.tint }}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStep = recipe.recipe_steps[currentStepIndex];
  const isLastStep = currentStepIndex === recipe.recipe_steps.length - 1;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeIcon}
        >
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.progress, { color: theme.mutedText }]}>
          Step {currentStepIndex + 1} of {recipe.recipe_steps.length}
        </Text>
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.stepTitle, { color: theme.text }]}>
            Step {currentStep.step_number}
          </Text>
          <ScrollView contentContainerStyle={styles.cardScroll}>
            <Text style={[styles.stepInstruction, { color: theme.text }]}>
              {currentStep.instruction}
            </Text>
          </ScrollView>
        </View>

        {currentStep.timer_seconds && (
          <View style={[styles.timerContainer, { borderColor: theme.tint }]}>
            <Ionicons name="timer-outline" size={24} color={theme.tint} />
            <Text style={[styles.timerText, { color: theme.tint }]}>
              {Math.floor(currentStep.timer_seconds / 60)} min
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentStepIndex === 0}
          style={[
            styles.navButton,
            { opacity: currentStepIndex === 0 ? 0.3 : 1 },
          ]}
        >
          <Ionicons
            name="arrow-back-circle"
            size={60}
            color={theme.cardBorder}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
          <Ionicons
            name={isLastStep ? "checkmark-circle" : "arrow-forward-circle"}
            size={80}
            color={theme.tint}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeIcon: { padding: 8 },
  progress: { ...Typography.body, fontWeight: "600" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    width: "100%",
    height: "70%", // Take up most of the screen
    borderRadius: 24,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 5,
  },
  cardScroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stepTitle: {
    ...Typography.heading,
    fontSize: 20,
    color: "#888",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  stepInstruction: {
    ...Typography.heading, // Use heading style for readability
    fontSize: 32, // Very large text
    lineHeight: 44,
    textAlign: "center",
    fontWeight: "700",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderRadius: 30,
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  timerText: {
    ...Typography.title,
    fontSize: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  navButton: {
    padding: 10,
  },
  errorText: { ...Typography.body, textAlign: "center", marginTop: 100 },
  closeBtn: { alignSelf: "center", marginTop: 20, padding: 10 },
});
