import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SegmentedControl({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <View style={[styles.container, { borderColor: theme.cardBorder }]}>
      {options.map((option) => {
        const active = option === selected;

        return (
          <TouchableOpacity
            key={option}
            style={[styles.item, active && { backgroundColor: theme.tint }]}
            onPress={() => onChange(option)}
          >
            <Text
              style={[styles.label, { color: active ? "#FFF" : theme.text }]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 4,
  },
  item: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
