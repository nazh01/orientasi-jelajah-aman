// app/_layout.tsx (root layout)
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { ThemeProvider, useTema } from "../contexts/ThemeContext";

function RootNavigator() {
    const { temaAktif, warna } = useTema();

    return (
        <>
            <StatusBar
                barStyle={temaAktif === "dark" ? "light-content" : "dark-content"}
                backgroundColor={warna.surface}
            />
            
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: warna.surface,
                    },
                    headerTintColor: warna.text,
                    headerTitleStyle: {
                        color: warna.text,
                    },
                    contentStyle: {
                        backgroundColor: warna.background,
                    },
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="detail/[kota]"
                    options={{ title: "Detail Cuaca" }}
                />

                <Stack.Screen
                    name="tambah-favorit"
                    options={{
                        presentation: "modal",
                        title: "Tambah Favorit",
                    }}
                />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <RootNavigator />
        </ThemeProvider>
    );
}
