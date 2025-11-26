import {
  Share,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AddItemModal from "@/components/grocery/AddItemModal";
import CategorySection from "@/components/grocery/CategorySection";
import { useState } from "react";
import useGroceryList from "@/hooks/useGroceryList";

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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]}>
            Grocery List
          </Text>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={clearChecked}>
              <Text style={styles.clearButton}>Clear Done</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={exportList}>
              <Text style={[styles.exportButton, { color: theme.tint }]}>
                Export
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && Object.keys(groupedList).length === 0 ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={theme.tint} />
          </View>
        ) : Object.keys(groupedList).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.icon, fontSize: 16 }}>
              Your grocery list is empty.
            </Text>
            <Text style={[styles.emptySubText, { color: theme.icon }]}>
              Add meals or add items manually.
            </Text>
          </View>
        ) : (
          Object.keys(groupedList).map((category) => (
            <CategorySection
              key={category}
              category={category}
              items={groupedList[category]}
              onToggle={handleToggle} // Pass our wrapper function
              onDelete={removeItem}
              onAddPress={() => setModalVisible(true)}
            />
          ))
        )}

        <TouchableOpacity
          style={[
            styles.addMainButton,
            { borderColor: theme.icon, backgroundColor: theme.card },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.addMainText, { color: theme.tint }]}>
            + Add Item
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
  title: { fontSize: 30, fontWeight: "700" },
  clearButton: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 16,
  },
  exportButton: {
    fontWeight: "600",
    fontSize: 16,
  },

  emptyState: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  emptySubText: {
    marginTop: 4,
    fontSize: 16,
  },

  addMainButton: {
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  addMainText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
