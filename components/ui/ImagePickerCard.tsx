import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Ensure this is installed: npx expo install expo-image-picker
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ImagePickerCard({
  images,
  setImages,
}: {
  images: string[];
  setImages: (imgs: string[]) => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImages([...images, uri]);
    }
  }

  function removeImage(uri: string) {
    setImages(images.filter((img) => img !== uri));
  }

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={[styles.label, { color: theme.mutedText }]}>Images</Text>
      <View style={styles.row}>
        {/* Existing Images */}
        {images.map((uri) => (
          <View key={uri} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              onPress={() => removeImage(uri)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Button */}
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.addButton, { borderColor: theme.cardBorder }]}
        >
          <Text style={{ color: theme.tint, fontSize: 30 }}>＋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 22,
    height: 22,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "white",
    fontWeight: "700",
    marginTop: -1,
  },
  addButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
