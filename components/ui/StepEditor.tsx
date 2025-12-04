import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function StepEditor({
  steps,
  setSteps,
}: {
  steps: { id: string; text: string }[];
  setSteps: (steps: { id: string; text: string }[]) => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  function addStep() {
    setSteps([...steps, { id: Math.random().toString(), text: "" }]);
  }

  function updateStep(id: string, value: string) {
    setSteps(steps.map((s) => (s.id === id ? { ...s, text: value } : s)));
  }

  function removeStep(id: string) {
    setSteps(steps.filter((s) => s.id !== id));
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Instructions
      </Text>

      {steps.map((step, index) => (
        <View
          key={step.id}
          style={[styles.row, { borderColor: theme.cardBorder }]}
        >
          <Text style={[styles.number, { color: theme.text }]}>
            {index + 1}.
          </Text>

          <TextInput
            placeholder="Describe this step..."
            placeholderTextColor={theme.mutedText}
            value={step.text}
            onChangeText={(v) => updateStep(step.id, v)}
            style={[styles.input, { color: theme.text }]}
            multiline
          />

          <TouchableOpacity onPress={() => removeStep(step.id)}>
            <Text style={styles.remove}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        onPress={addStep}
        style={[styles.addButton, { borderColor: theme.cardBorder }]}
      >
        <Text style={[styles.addText, { color: theme.tint }]}>+ Add Step</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 30 },
  addText: { fontWeight: "600" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },
  number: {
    fontSize: 18,
    fontWeight: "700",
    width: 24,
    textAlign: "center",
    paddingTop: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: 40,
  },
  remove: {
    fontSize: 20,
    color: "red",
    fontWeight: "700",
    paddingTop: 4,
  },
  addButton: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
});
