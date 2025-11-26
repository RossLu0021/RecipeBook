import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { RecipeStepInput } from "@/types/recipe";

export default function StepRow({
  number,
  item,
  onChange,
  onRemove,
}: {
  number: number;
  item: RecipeStepInput;
  onChange: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <View style={[styles.row, { borderColor: theme.cardBorder }]}>
      <Text style={[styles.number, { color: theme.text }]}>{number}.</Text>

      <TextInput
        placeholder="Describe this step..."
        placeholderTextColor={theme.mutedText}
        value={item.text}
        onChangeText={(v) => onChange(item.id, v)}
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.cardBorder },
        ]}
        multiline
      />

      <TouchableOpacity onPress={() => onRemove(item.id)}>
        <Text style={styles.remove}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "flex-start",
    gap: 8,
  },
  number: {
    fontSize: 16,
    fontWeight: "700",
    width: 24,
    textAlign: "center",
    marginTop: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
  },
  remove: {
    color: "red",
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 4,
  },
});
