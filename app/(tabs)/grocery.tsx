import AddItemModal from "@/components/grocery/AddItemModal";
import CategorySection from "@/components/grocery/CategorySection";
import { Colors, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import useGroceryList from "@/hooks/useGroceryList";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroceryTab() {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const {
    groupedList,
    loading,
    addItem,
    toggleItem,
    removeItem,
    clearChecked,
  } = useGroceryList();
  const [modalVisible, setModalVisible] = useState(false);

  async function exportList() {
    let text = "My Grocery List\n\n";

    Object.keys(groupedList).forEach((cat) => {
      text += `${cat}\n`;
      groupedList[cat].forEach((i) => {
        text += `- ${i.checked ? "[x]" : "[ ]"} ${i.quantity ?? ""} ${i.unit ?? ""} ${i.name}\n`;
      });
      text += "\n";
    });

    await Share.share({ message: text });
  }

  // Normalize AddItemModal payload into the hook's signature.
  const handleAddItem = (item: {
    name: string;
    quantity: number;
    unit: string;
    category: string;
  }) => {
    addItem(item.name, item.category, item.quantity, item.unit);
  };

  // Toggle requires the current status, so look it up before mutating.
  const handleToggle = (id: string) => {
    let currentStatus = false;
    for (const cat in groupedList) {
      const found = groupedList[cat].find((i) => i.id === id);
      if (found) {
        currentStatus = found.checked;
        break;
      }
    }
    toggleItem(id, currentStatus);
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <FlatList
        data={Object.keys(groupedList)}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.text }]}>
              Grocery List
            </Text>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={clearChecked}
                accessibilityRole="button"
                accessibilityLabel="Clear checked items"
                accessibilityHint="Removes all items marked as done from your list"
              >
                <Text style={styles.clearButton}>Clear Done</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={exportList}
                accessibilityRole="button"
                accessibilityLabel="Export grocery list"
                accessibilityHint="Shares your grocery list as text"
              >
                <Text style={[styles.exportButton, { color: theme.tint }]}>
                  Export
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={theme.tint} />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.icon }]}>
                Your grocery list is empty.
              </Text>
              <Text style={[styles.emptySubText, { color: theme.icon }]}>
                Add meals or add items manually.
              </Text>
            </View>
          )
        }
        renderItem={({ item: category }) => (
          <CategorySection
            category={category}
            items={groupedList[category]}
            onToggle={handleToggle}
            onDelete={removeItem}
            onAddPress={() => setModalVisible(true)}
          />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={[
              styles.addMainButton,
              { borderColor: theme.icon, backgroundColor: theme.card },
            ]}
            onPress={() => setModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Add new item"
            accessibilityHint="Opens a modal to add a new grocery item"
          >
            <Text style={[styles.addMainText, { color: theme.tint }]}>
              + Add Item
            </Text>
          </TouchableOpacity>
        }
      />

      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddItem} // Pass wrapper function
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { paddingHorizontal: 16, paddingBottom: 50 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    paddingTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  title: {
    ...Typography.heading,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    ...Typography.subtitle,
    marginBottom: 8,
  },
  emptySubText: {
    ...Typography.body,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    ...Typography.subtitle,
    fontSize: 14, // Override size for section header if needed, or keep subtitle size
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    ...Typography.body,
    flex: 1,
    marginLeft: 12,
  },
  itemTextChecked: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  addMainButton: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addMainText: {
    ...Typography.subtitle,
  },
  clearButton: {
    ...Typography.caption,
    color: "#ef4444",
  },
  exportButton: {
    ...Typography.caption,
    fontWeight: "600",
  },
});
