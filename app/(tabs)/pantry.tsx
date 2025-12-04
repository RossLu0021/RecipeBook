import AddPantryItemModal from "@/components/pantry/AddPantryItemModal";
import { Colors, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import usePantry, { PantryItem } from "@/hooks/usePantry";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PantryScreen() {
    const scheme = useColorScheme() ?? "light";
    const theme = Colors[scheme];
    const { pantryList, loading, addItem, updateItem, deleteItem } = usePantry();

    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

    const openAddModal = () => {
        setEditingItem(null);
        setModalVisible(true);
    };

    const openEditModal = (item: PantryItem) => {
        setEditingItem(item);
        setModalVisible(true);
    };

    const handleSave = (itemData: {
        name: string;
        quantity?: number;
        unit?: string;
        expiry_date?: string;
    }) => {
        if (editingItem) {
            updateItem({ ...editingItem, ...itemData });
        } else {
            addItem(itemData as any);
        }
        setModalVisible(false);
    };

    const renderItem = ({ item }: { item: PantryItem }) => {
        const isExpired =
            item.expiry_date && new Date(item.expiry_date) < new Date();

        return (
            <TouchableOpacity
                style={[styles.itemCard, { backgroundColor: theme.card }]}
                onPress={() => openEditModal(item)}
            >
                <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: theme.text }]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.itemDetails, { color: theme.mutedText }]}>
                        {item.quantity} {item.unit}
                    </Text>
                    {item.expiry_date && (
                        <Text
                            style={[
                                styles.expiryText,
                                { color: isExpired ? "#ef4444" : theme.mutedText },
                            ]}
                        >
                            {isExpired ? "Expired: " : "Expires: "}
                            {item.expiry_date}
                        </Text>
                    )}
                </View>
                <TouchableOpacity
                    onPress={() => deleteItem(item.id)}
                    style={styles.deleteButton}
                >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.background }]}
            edges={["top"]}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>My Pantry</Text>
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: theme.tint }]}
                    onPress={openAddModal}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={theme.tint} style={styles.loader} />
            ) : (
                <FlatList
                    data={pantryList}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={[styles.emptyText, { color: theme.mutedText }]}>
                                Your pantry is empty.
                            </Text>
                        </View>
                    }
                />
            )}

            <AddPantryItemModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSave}
                editingItem={editingItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: { ...Typography.heading },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    loader: { marginTop: 40 },
    listContent: { padding: 16 },
    itemCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    itemInfo: { flex: 1 },
    itemName: { ...Typography.subtitle, marginBottom: 4 },
    itemDetails: { ...Typography.body, fontSize: 14 },
    expiryText: { ...Typography.caption, marginTop: 4 },
    deleteButton: { padding: 8 },
    emptyState: { alignItems: "center", marginTop: 40 },
    emptyText: { ...Typography.body },
});
