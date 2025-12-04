import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

const StepList = memo(function StepList({
  steps,
}: {
  steps: { step_number: number; instruction: string }[];
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  if (!steps || steps.length === 0) {
    return (
      <Text style={[styles.emptyText, { color: theme.mutedText }]}>
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
});

export default StepList;

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  emptyText: { fontStyle: "italic" },
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
