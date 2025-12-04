import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

// --- Property Row ---
export const PropertyRow = ({
  icon,
  label,
  value,
  onPress,
  isCheckbox = false,
  isFavorite,
  theme,
}: any) => (
  <View style={styles.propRow}>
    <View style={styles.propLabelContainer}>
      <MaterialCommunityIcons
        name={icon}
        size={18}
        color={theme.mutedText}
        style={styles.mr8}
      />
      <Text style={[styles.text15, { color: theme.mutedText }]}>{label}</Text>
    </View>
    {isCheckbox ? (
      <TouchableOpacity onPress={onPress}>
        <MaterialCommunityIcons
          name={isFavorite ? "checkbox-marked" : "checkbox-blank-outline"}
          size={22}
          color={isFavorite ? theme.tint : theme.mutedText}
        />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={onPress} style={styles.propValueBtn}>
        <Text style={[styles.text15, { color: theme.text }]}>{value}</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={16}
          color={theme.mutedText}
          style={styles.ml4}
        />
      </TouchableOpacity>
    )}
  </View>
);

// --- Macro Input ---
export const MacroInput = ({ label, val, setter, theme }: any) => (
  <View style={[styles.propRow, styles.pv8]}>
    <View style={styles.propLabelContainer}>
      <Text style={[styles.text15, { color: theme.mutedText }]}># {label}</Text>
    </View>
    <TextInput
      value={val}
      onChangeText={setter}
      keyboardType="numeric"
      placeholder="0"
      placeholderTextColor={theme.mutedText}
      style={[styles.macroInput, { color: theme.text }]}
    />
  </View>
);

// --- Selection Modal ---
export const SelectionModal = ({
  visible,
  onClose,
  type,
  options,
  onSelect,
  currentSelection,
  theme,
}: any) => (
  <Modal visible={visible} transparent animationType="fade">
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
        <Text style={[styles.modalHeader, { color: theme.text }]}>
          Select {type}
        </Text>
        <FlatList
          data={options}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => onSelect(item)}
            >
              {/* Fixed: Moved fontSize: 16 to styles.optionText */}
              <Text style={[styles.optionText, { color: theme.text }]}>
                {item}
              </Text>
              {item === currentSelection && (
                <Ionicons name="checkmark" size={20} color={theme.tint} />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </Pressable>
  </Modal>
);

// --- Menu Modal ---
export const MenuModal = ({
  visible,
  onClose,
  onShare,
  onDelete,
  isEditing,
  theme,
}: any) => (
  <Modal visible={visible} transparent animationType="slide">
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <View style={[styles.menuContent, { backgroundColor: theme.card }]}>
        <View style={styles.dragHandle} />
        <TouchableOpacity style={styles.menuItem} onPress={onShare}>
          <Ionicons name="share-outline" size={24} color={theme.text} />
          <Text style={[styles.menuText, { color: theme.text }]}>
            Share Recipe
          </Text>
        </TouchableOpacity>
        {isEditing && (
          <TouchableOpacity style={styles.menuItem} onPress={onDelete}>
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
            {/* Fixed: Moved static color #ef4444 to styles.destructiveText */}
            <Text style={styles.destructiveText}>Delete Recipe</Text>
          </TouchableOpacity>
        )}
        {/* Fixed: Replaced inline border style with styles.noBorder */}
        <TouchableOpacity
          style={[styles.menuItem, styles.noBorder]}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color={theme.mutedText} />
          <Text style={[styles.menuText, { color: theme.mutedText }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  // Prop Row
  propRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    height: 44,
  },
  propLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
  },
  propValueBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(128,128,128, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text15: { fontSize: 15 },
  mr8: { marginRight: 8 },
  ml4: { marginLeft: 4 },
  pv8: { paddingVertical: 8 },

  // Macro Input
  macroInput: { fontSize: 15, textAlign: "right", minWidth: 50 },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "60%",
    borderRadius: 12,
    padding: 16,
    marginBottom: "50%",
  },
  modalHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: { fontSize: 16 },

  // Menu Modal
  menuContent: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  menuText: { fontSize: 18, marginLeft: 16, fontWeight: "500" },
  destructiveText: {
    fontSize: 18,
    marginLeft: 16,
    fontWeight: "500",
    color: "#ef4444",
  },
  noBorder: { borderBottomWidth: 0 },
});
