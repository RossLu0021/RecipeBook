import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { PantryItem } from "@/hooks/usePantry";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
    Keyboard,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const COMMON_UNITS = ["pcs", "kg", "g", "lb", "oz", "L", "ml", "can", "box", "bag"];

interface AddPantryItemModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (item: {
        name: string;
        quantity?: number;
        unit?: string;
        expiry_date?: string;
    }) => void;
    editingItem?: PantryItem | null;
}

export default function AddPantryItemModal({
    visible,
    onClose,
    onSave,
    editingItem,
}: AddPantryItemModalProps) {
    const scheme = useColorScheme() ?? "light";
    const theme = Colors[scheme];

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [expiryDate, setExpiryDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setName(editingItem.name);
            setQuantity(editingItem.quantity?.toString() || "");
            setUnit(editingItem.unit || "");
            setExpiryDate(editingItem.expiry_date ? new Date(editingItem.expiry_date) : null);
        } else {
            resetFields();
        }
    }, [editingItem, visible]);

    const resetFields = () => {
        setName("");
        setQuantity("");
        setUnit("");
        setExpiryDate(null);
    };

    const handleSave = () => {
        if (!name.trim()) return;

        onSave({
            name,
            quantity: quantity ? parseFloat(quantity) : undefined,
            unit,
            expiry_date: expiryDate ? expiryDate.toISOString().split("T")[0] : undefined,
        });
        onClose();
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || expiryDate;
        setShowDatePicker(Platform.OS === "ios");
        setExpiryDate(currentDate);
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={[styles.modal, { backgroundColor: theme.card }]}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>
                            {editingItem ? "Edit Item" : "Add Item"}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.mutedText} />
                        </TouchableOpacity>
                    </View>

                    {/* Name Input */}
                    <TextInput
                        placeholder="Item Name (e.g. Milk)"
                        placeholderTextColor={theme.mutedText}
                        style={[
                            styles.input,
                            { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.background },
                        ]}
                        value={name}
                        onChangeText={setName}
                        autoFocus={!editingItem}
                    />

                    {/* Quantity Row */}
                    <View style={styles.row}>
                        <TextInput
                            placeholder="Qty"
                            placeholderTextColor={theme.mutedText}
                            style={[
                                styles.input,
                                styles.halfInput,
                                { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.background },
                            ]}
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="numeric"
                        />
                        <View style={styles.halfInput}>
                            <Text style={[styles.label, { color: theme.mutedText }]}>Unit</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.unitScroll}>
                                {COMMON_UNITS.map((u) => (
                                    <TouchableOpacity
                                        key={u}
                                        onPress={() => {
                                            setUnit(u);
                                            Keyboard.dismiss();
                                        }}
                                        style={[
                                            styles.unitChip,
                                            {
                                                backgroundColor: unit === u ? theme.tint : theme.pillBg,
                                                borderColor: unit === u ? theme.tint : theme.cardBorder,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.unitText,
                                                { color: unit === u ? "#fff" : theme.text },
                                            ]}
                                        >
                                            {u}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    {/* Expiry Date */}
                    <Text style={[styles.label, { color: theme.mutedText, marginTop: 10 }]}>Expiry Date</Text>
                    <TouchableOpacity
                        style={[
                            styles.dateButton,
                            { borderColor: theme.cardBorder, backgroundColor: theme.background },
                        ]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={20} color={theme.text} />
                        <Text style={[styles.dateText, { color: expiryDate ? theme.text : theme.mutedText }]}>
                            {expiryDate ? expiryDate.toLocaleDateString() : "Select Date"}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={expiryDate || new Date()}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={onDateChange}
                            minimumDate={new Date()}
                            textColor={theme.text}
                        />
                    )}

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: theme.tint }]}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveButtonText}>Save Item</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modal: {
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
    },
    row: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 10,
    },
    halfInput: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 8,
        marginLeft: 2,
    },
    unitScroll: {
        gap: 8,
        paddingBottom: 8,
    },
    unitChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    unitText: {
        fontSize: 14,
        fontWeight: "600",
    },
    dateButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 14,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
    },
    saveButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
