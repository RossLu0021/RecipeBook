import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SectionHeader({ title }: { title: string }) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <Text style={[styles.title, { color: theme.sectionHeader }]}>{title}</Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
});
