import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export const compressImage = async (uri: string, width = 1080) => {
  try {
    // Build a small pipeline to resize and compress images before upload.
    const context = ImageManipulator.manipulate(uri);
    context.resize({ width });
    const imageRef = await context.renderAsync();
    const result = await imageRef.saveAsync({
      compress: 0.7,
      format: SaveFormat.JPEG,
    });

    return result;
  } catch (error) {
    console.error("Image compression failed:", error);
    throw error;
  }
};
