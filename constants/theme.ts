/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

// Soft iOS-style shadow
const shadowLight = {
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

const shadowDark = {
  shadowColor: "#000",
  shadowOpacity: 0.4,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
};

export const Colors = {
  light: {
    text: "#11181C",
    background: "#ffffff",
    card: "#ffffff",
    cardBorder: "#e5e5e5",
    mutedText: "#6b7280",
    sectionHeader: "#5f6368",
    divider: "#e5e7eb",

    // Tag colors (light)
    tagBackground: {
      meal: "#e0ecff",
      cuisine: "#f8e7d2",
      mastery: "#f3ecc1",
    },
    tagText: {
      meal: "#1b4e8f",
      cuisine: "#8f5a20",
      mastery: "#7a6b2d",
    },

    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,

    pillBg: "#f2f2f7",
    pillText: "#111",
    pillSelectedBg: "#0a7ea4",
    pillSelectedText: "#fff",

    shadow: shadowLight,
  },

  dark: {
    text: "#ECEDEE",
    background: "#121212",
    card: "#1c1c1e",
    cardBorder: "#2c2c2e",
    mutedText: "#9ba1a6",
    sectionHeader: "#d1d1d6",
    divider: "#2c2c2e",

    // Tag colors (dark)
    tagBackground: {
      meal: "#1a2a40",
      cuisine: "#3b2f24",
      mastery: "#3a381f",
    },
    tagText: {
      meal: "#9bc2ff",
      cuisine: "#ffd7aa",
      mastery: "#f3e6aa",
    },

    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    pillBg: "#2c2c2e",
    pillText: "#ccc",
    pillSelectedBg: "#fff",
    pillSelectedText: "#000",

    shadow: shadowDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Typography = {
  heading: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 32,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
  },
  subtitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#6b7280",
  },
};
