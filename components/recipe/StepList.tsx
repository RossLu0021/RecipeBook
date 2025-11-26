import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function StepList({
  steps,
}: {
  steps: { step_number: number; instruction: string }[];
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  if (!steps || steps.length === 0) {
    return (
      <Text style={{ color: theme.mutedText, fontStyle: "italic" }}>
        No instructions added yet.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {steps.map((step) => (
        <View key={step.step_number} style={styles.stepRow}>
          <Text style={[styles.stepNum, { color: theme.text }]}>
            {step.step_number}.
          </Text>
          <Text style={[styles.stepText, { color: theme.text }]}>
            {step.instruction}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  stepNum: {
    fontSize: 18,
    fontWeight: "700",
    width: 26,
    textAlign: "right",
    marginTop: 2,
  },
  stepText: {
    fontSize: 16,
    lineHeight: 22,
    flexShrink: 1,
  },
});
