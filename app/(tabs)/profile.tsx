import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/supabase/client";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useProfileActions } from "./_profile.logic";

const AvatarView = ({ profile, uploading, isEditing, onPick, theme }: any) => (
  <View style={styles.avatarSection}>
    <TouchableOpacity onPress={onPick} disabled={uploading || !isEditing}>
      <View>
        {profile?.avatar_url ? (
          <Image
            source={{ uri: `${profile.avatar_url}?t = ${new Date().getTime()} ` }}
            style={styles.avatar}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              styles.placeholderAvatar,
              { backgroundColor: theme.cardBorder },
            ]}
          >
            <Text style={[styles.avatarText, { color: theme.mutedText }]}>
              {profile?.full_name?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>
        )}
        {uploading && (
          <View style={styles.overlay}>
            <ActivityIndicator color="#fff" />
          </View>
        )}
        {isEditing && !uploading && (
          <View style={styles.editBadge}>
            <Ionicons name="camera" size={14} color="#fff" />
          </View>
        )}
      </View>
    </TouchableOpacity>
    <Text style={[styles.emailText, { color: theme.mutedText }]}>
      {profile?.email}
    </Text>
  </View>
);

const ProfileField = ({
  label,
  value,
  isEditing,
  onChangeText,
  theme,
  isId = false,
}: any) => (
  <View style={[styles.row, isId && styles.noBorder]}>
    <Text style={[styles.label, { color: theme.mutedText }]}>{label}</Text>
    {isEditing && !isId ? (
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          { color: theme.text, borderBottomColor: theme.tint },
        ]}
        placeholder="Enter value"
        placeholderTextColor={theme.mutedText}
      />
    ) : (
      <Text
        style={[
          isId ? styles.idText : styles.value,
          { color: isId ? theme.mutedText : theme.text },
        ]}
      >
        {value || (isId ? "" : "Not set")}
      </Text>
    )}
  </View>
);

const PrivacySection = ({ onPolicy, onDelete, theme }: any) => (
  <View style={styles.privacySection}>
    <Text style={[styles.sectionHeader, { color: theme.mutedText }]}>
      Account & Privacy
    </Text>

    <TouchableOpacity style={styles.linkRow} onPress={onPolicy}>
      <Text style={[styles.privacyLinkText, { color: theme.tint }]}>
        Privacy Policy
      </Text>
      <Ionicons name="open-outline" size={16} color={theme.tint} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.linkRow} onPress={onDelete}>
      <Text style={styles.destructiveText}>Delete Account</Text>
      <Ionicons name="trash-outline" size={16} color="#ef4444" />
    </TouchableOpacity>
  </View>
);

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const {
    profile,
    loading,
    uploading,
    saving,
    tempName,
    setTempName,
    updateProfile,
    pickAvatar,
    deleteAccount,
    logout,
    openPrivacyPolicy,
  } = useProfileActions();

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateProfile(() => setIsEditing(false));
  };

  const handleBackup = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      const userId = userData.user.id;

      // Fetch all data
      const [recipes, pantry, grocery, mealPlan] = await Promise.all([
        supabase.from("recipes").select("*").eq("user_id", userId),
        supabase.from("pantry_items").select("*").eq("user_id", userId),
        supabase.from("grocery_list").select("*").eq("user_id", userId),
        supabase.from("meal_plan").select("*").eq("user_id", userId),
      ]);

      const backupData = {
        timestamp: new Date().toISOString(),
        user_id: userId,
        recipes: recipes.data || [],
        pantry: pantry.data || [],
        grocery: grocery.data || [],
        meal_plan: mealPlan.data || [],
      };

      const json = JSON.stringify(backupData, null, 2);
      const fileUri = (FileSystem.documentDirectory || FileSystem.cacheDirectory) + "recipebook_backup.json";

      await FileSystem.writeAsStringAsync(fileUri, json);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          UTI: "public.json",
          mimeType: "application/json",
          dialogTitle: "Save Backup",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create backup.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.center,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.tint} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex1}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Profile
            </Text>
            <TouchableOpacity
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              <Text style={[styles.editBtnText, { color: theme.tint }]}>
                {isEditing ? (saving ? "Saving..." : "Save") : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>

          <AvatarView
            profile={profile}
            uploading={uploading}
            isEditing={isEditing}
            onPick={pickAvatar}
            theme={theme}
          />

          <View
            style={[
              styles.section,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}
          >
            <ProfileField
              label="Full Name"
              value={isEditing ? tempName : profile?.full_name}
              isEditing={isEditing}
              onChangeText={setTempName}
              theme={theme}
            />
            <ProfileField
              label="User ID"
              value={profile?.id ? `${profile.id.slice(0, 8)}...` : ""}
              isEditing={false}
              isId
              theme={theme}
            />
          </View>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.cardBorder }]}
            onPress={logout}
          >
            <Text style={[styles.actionText, { color: theme.text }]}>
              Log Out
            </Text>
          </TouchableOpacity>

          <View
            style={[styles.divider, { backgroundColor: theme.cardBorder }]}
          />

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.tint }]}
            onPress={handleBackup}
          >
            <Ionicons
              name="cloud-download-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.actionText, { color: "#fff" }]}>
              Backup Data (JSON)
            </Text>
          </TouchableOpacity>

          <View
            style={[styles.divider, { backgroundColor: theme.cardBorder }]}
          />

          <PrivacySection
            onPolicy={openPrivacyPolicy}
            onDelete={deleteAccount}
            theme={theme}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 60 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 30, fontWeight: "700" },
  editBtnText: { fontSize: 16, fontWeight: "600" },
  avatarSection: { alignItems: "center", marginVertical: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 30 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#0a7ea4",
    padding: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },
  emailText: { marginTop: 12, fontSize: 14 },
  section: {
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 24,
  },
  row: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noBorder: { borderBottomWidth: 0 },
  label: { fontSize: 15, fontWeight: "500" },
  value: { fontSize: 15, fontWeight: "600" },
  idText: { fontSize: 12 },
  input: {
    fontSize: 15,
    fontWeight: "600",
    minWidth: 150,
    textAlign: "right",
    paddingVertical: 4,
    borderBottomWidth: 1,
  },
  actionButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
  },
  actionText: { fontWeight: "700", fontSize: 16 },
  divider: { height: 1, width: "100%", marginBottom: 24 },
  privacySection: { paddingHorizontal: 20 },
  sectionHeader: {
    fontSize: 12,
    marginBottom: 10,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
  privacyLinkText: { fontSize: 15 },
  destructiveText: { color: "#ef4444", fontSize: 15 },
});
