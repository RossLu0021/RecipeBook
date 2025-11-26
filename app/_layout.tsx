import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  Slot,
  usePathname,
  useRouter,
  useRootNavigationState,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSession } from "@/hooks/useSession";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // Keep unused data in cache for 24 hours
      staleTime: 1000 * 60 * 5, // Data is "fresh" for 5 minutes (don't refetch)
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const inAuth = pathname?.startsWith("/auth");

  useEffect(() => {
    // Wait for navigation to be ready and route users based on session state.
    if (!rootNavigationState?.key) return;
    if (session === undefined) return;

    const performNavigation = () => {
      if (session && inAuth) {
        router.replace("/");
      } else if (!session && !inAuth) {
        router.replace("/auth/login");
      }
    };

    const timer = setTimeout(() => {
      performNavigation();
    }, 0);

    return () => clearTimeout(timer);
  }, [session, inAuth, rootNavigationState?.key, router]);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Slot />
          <StatusBar style="auto" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  );
}
