// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../../contexts/ThemeContext";

export default function TabLayout() {
    const { warna, temaAktif } = useTema();
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: warna.surface,
            },
            headerTintColor: warna.text,
            headerTitleStyle: {
                color: warna.text,
            },
            sceneStyle: {
                backgroundColor: warna.background,
            },
            tabBarStyle: {
                backgroundColor: warna.tabBackground,
                borderTopColor: warna.border,
            },
            tabBarActiveTintColor: warna.primary,
            tabBarInactiveTintColor: warna.secondaryText,
        }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Beranda",
                    tabBarLabel: "Beranda",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="cloud-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="riwayat"
                options={{
                    title: "Riwayat",
                    tabBarLabel: "Riwayat",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="time-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="pengaturan"
                options={{
                    title: "Pengaturan",
                    tabBarLabel: "Pengaturan",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="settings-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="tentang"
                options={{
                    title: "Tentang",
                    tabBarLabel: "Tentang",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="information-circle-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
