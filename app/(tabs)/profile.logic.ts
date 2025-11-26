import { useState, useEffect, useCallback } from "react";
import { Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/supabase/client";

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email?: string;
}

export function useProfileActions() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tempName, setTempName] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      if (data) {
        setProfile({
          ...data,
          email: userData.user.email,
          full_name: data.full_name || "",
        });
        setTempName(data.full_name || "");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function updateProfile(onSuccess: () => void) {
    if (!profile) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: tempName, updated_at: new Date() })
        .eq("id", profile.id);

      if (error) throw error;
      setProfile({ ...profile, full_name: tempName });
      onSuccess(); // Callback to close edit mode
      Alert.alert("Success", "Profile updated!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  }

  async function pickAvatar() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (result.canceled || !result.assets || result.assets.length === 0)
        return;

      const image = result.assets[0];
      setUploading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const ext = image.uri.split(".").pop()?.toLowerCase() ?? "jpg";
      const filePath = `${user.id}/avatar.${ext}`;

      // Convert the picked asset into raw bytes for upload.
      const response = await fetch(image.uri);
      const arrayBuffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, arrayBuffer, {
          contentType: image.mimeType ?? "image/jpeg",
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase.from("profiles").upsert({
        id: user.id,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      });
      if (updateError) throw updateError;

      setProfile((prev) => ({
        ...prev!,
        id: user.id,
        avatar_url: publicUrl,
        full_name: prev?.full_name || "",
        email: prev?.email || user.email,
      }));
    } catch (error: any) {
      Alert.alert("Upload Failed", error.message);
    } finally {
      setUploading(false);
    }
  }

  async function deleteAccount() {
    Alert.alert("Delete Account?", "This is permanent.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete Everything",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase
              .from("profiles")
              .delete()
              .eq("id", user.id);
            if (error) throw error;
            await supabase.auth.signOut();
          } catch (error: any) {
            Alert.alert("Error", error.message);
            setLoading(false);
          }
        },
      },
    ]);
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Error", error.message);
  }

  function openPrivacyPolicy() {
    Linking.openURL(
      "https://docs.google.com/document/d/1KZh_hzhWBXb--ZRMKvhmhTGHPQo75BaETSXeWtnkV00/edit?usp=sharing",
    );
  }

  return {
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
  };
}
