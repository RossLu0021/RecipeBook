import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "ellipse";

          if (route.name === "index") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "meal-plan") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "grocery") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Recipes" }} />
      <Tabs.Screen name="meal-plan" options={{ title: "Meal Plan" }} />
      <Tabs.Screen name="grocery" options={{ title: "Grocery" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
