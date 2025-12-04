import { Colors, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface UnitConverterProps {
  visible: boolean;
  onClose: () => void;
}

const CONVERSION_RATES: Record<string, number> = {
  // Weight (base: grams)
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
  // Volume (base: ml)
  ml: 1,
  l: 1000,
  tsp: 4.92892,
  tbsp: 14.7868,
  cup: 236.588,
  floz: 29.5735,
};

const UNITS = {
  Weight: ["g", "kg", "oz", "lb"],
  Volume: ["ml", "l", "tsp", "tbsp", "cup", "floz"],
  Temp: ["C", "F"],
};

export default function UnitConverter({
  visible,
  onClose,
}: UnitConverterProps) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const [category, setCategory] = useState<"Weight" | "Volume" | "Temp">(
    "Weight",
  );
  const [fromUnit, setFromUnit] = useState("g");
  const [toUnit, setToUnit] = useState("oz");
  const [inputValue, setInputValue] = useState("");

  const convert = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "";

    if (category === "Temp") {
      if (fromUnit === "C" && toUnit === "F")
        return ((num * 9) / 5 + 32).toFixed(1);
      if (fromUnit === "F" && toUnit === "C")
        return (((num - 32) * 5) / 9).toFixed(1);
      return num.toString();
    }

    const base = num * CONVERSION_RATES[fromUnit];
    const result = base / CONVERSION_RATES[toUnit];
    return result.toFixed(2);
  };

  const result = convert(inputValue);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.content, { backgroundColor: theme.card }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              Unit Converter
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Category Tabs */}
          <View style={styles.tabs}>
            {(Object.keys(UNITS) as Array<keyof typeof UNITS>).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.tab,
                  category === cat && {
                    backgroundColor: theme.tint,
                    borderColor: theme.tint,
                  },
                  { borderColor: theme.cardBorder },
                ]}
                onPress={() => {
                  setCategory(cat);
                  setFromUnit(UNITS[cat][0]);
                  setToUnit(UNITS[cat][1] || UNITS[cat][0]);
                  setInputValue("");
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: category === cat ? "#fff" : theme.text },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Converter Inputs */}
          <View style={styles.converterRow}>
            <View style={styles.column}>
              <TextInput
                style={[
                  styles.input,
                  { color: theme.text, borderColor: theme.cardBorder },
                ]}
                placeholder="0"
                placeholderTextColor={theme.mutedText}
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <View style={styles.unitSelector}>
                {UNITS[category].map((u) => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => setFromUnit(u)}
                    style={[
                      styles.unitBadge,
                      fromUnit === u && { backgroundColor: theme.tint },
                    ]}
                  >
                    <Text
                      style={{
                        color: fromUnit === u ? "#fff" : theme.mutedText,
                        fontSize: 12,
                      }}
                    >
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Ionicons name="arrow-forward" size={24} color={theme.mutedText} />

            <View style={styles.column}>
              <View
                style={[
                  styles.resultBox,
                  {
                    borderColor: theme.cardBorder,
                    backgroundColor: theme.background,
                  },
                ]}
              >
                <Text style={[styles.resultText, { color: theme.text }]}>
                  {result || "0"}
                </Text>
              </View>
              <View style={styles.unitSelector}>
                {UNITS[category].map((u) => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => setToUnit(u)}
                    style={[
                      styles.unitBadge,
                      toUnit === u && { backgroundColor: theme.tint },
                    ]}
                  >
                    <Text
                      style={{
                        color: toUnit === u ? "#fff" : theme.mutedText,
                        fontSize: 12,
                      }}
                    >
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { ...Typography.subtitle },
  tabs: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: { fontWeight: "600", fontSize: 14 },
  converterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  column: { flex: 1 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  resultBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  resultText: { fontSize: 18, fontWeight: "600" },
  unitSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4,
  },
  unitBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
});
