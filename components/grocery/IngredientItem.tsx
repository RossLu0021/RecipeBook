import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export type IngredientItemProps = {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export default function IngredientItem({
  name,
  quantity,
  unit,
  checked,
  onToggle,
  onDelete,
}: IngredientItemProps) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const deleteAction = () => (
    <View style={styles.deleteContainer}>
      <Ionicons name="trash" size={24} color="#fff" />
    </View>
  );

  return (
    <Swipeable
      renderRightActions={deleteAction}
      onSwipeableRightOpen={onDelete}
    >
      <TouchableOpacity style={styles.row} onPress={onToggle}>
        {/* Apple Reminders Circular Checkbox */}
        <View
          style={[
            styles.checkbox,
            checked && { backgroundColor: theme.tint, borderColor: theme.tint },
          ]}
        >
          {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>

        <Text
          style={[
            styles.text,
            { color: theme.text, opacity: checked ? 0.4 : 1 },
          ]}
        >
          {quantity ? `${quantity} ` : ""}
          {unit ? `${unit} ` : ""}
          {name}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    flexShrink: 1,
  },
  deleteContainer: {
    backgroundColor: "#e63946",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 10,
    marginVertical: 4,
  },
});
