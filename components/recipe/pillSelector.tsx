import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PillSelector({
  selectedDay,
  onSelect,
}: {
  selectedDay: string;
  onSelect: (day: string) => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const bg = theme.pillBg ?? (scheme === "light" ? "#F2F2F6" : "#2A2A2C");
  const bgSelected = theme.pillSelectedBg ?? theme.tint;
  const textColor = theme.pillText ?? theme.text;
  const textSelected = theme.pillSelectedText ?? "#FFF";

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      <View style={styles.row}>
        {days.map((day) => {
          const active = day === selectedDay;
          return (
            <TouchableOpacity
              key={day}
              onPress={() => onSelect(day)}
              style={[
                styles.pill,
                { backgroundColor: active ? bgSelected : bg },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  { color: active ? textSelected : textColor },
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingRight: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  /* FINAL SMALL PILL SIZE */
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 16,
  },

  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
