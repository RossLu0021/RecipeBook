import { supabase } from "@/supabase/client";
import { compressImage } from "@/utils/image-optimizer";

export async function uploadImage(
  uri: string,
  userId: string,
  recipeId: string,
) {
  try {
    if (!uri) return null;

    // Compress first to shrink upload size and standardize to JPEG.
    const compressedResult = await compressImage(uri);

    // Optimizer outputs JPEG, so we save with a .jpg extension.
    const path = `recipes/${userId}/${recipeId}/${Date.now()}.jpg`;

    const response = await fetch(compressedResult.uri);
    const arrayBuffer = await response.arrayBuffer();

    // Upload the compressed buffer to Supabase storage.
    const { error } = await supabase.storage
      .from("recipe_photos")
      .upload(path, arrayBuffer, {
        contentType: "image/jpeg", // Optimizer always emits JPEG
        upsert: false,
      });

    if (error) {
      console.log("Supabase Upload Error:", error.message);
      return null;
    }

    // Return the publicly accessible URL for display.
    const { data } = supabase.storage.from("recipe_photos").getPublicUrl(path);

    return data.publicUrl;
  } catch (e) {
    console.log("Upload Failed:", e);
    return null;
  }
}
