// app/(tabs)/pengaturan.tsx
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTema, PilihanTema } from "../../contexts/ThemeContext";

const PILIHAN: {
    label: string;
    value: PilihanTema;
    ikon: string;
}[] = [
    { label: "Terang", value: "light", ikon: "☀️" },
    { label: "Gelap", value: "dark", ikon: "🌙" },
    { label: "Ikuti Sistem", value: "system", ikon: "📱" },
];

export default function TabPengaturan() {
    const { pilihanTema, temaAktif, warna, ubahTema } = useTema();

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 16,
                backgroundColor: warna.background,
            }}
        >
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: warna.text,
                    marginBottom: 8,
                }}
            >
                Jelajah Aman
            </Text>

            <Text
                style={{
                    color: warna.secondaryText,
                    marginBottom: 24,
                }}
            >
                Versi 1.0.0
            </Text>

            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: warna.text,
                    marginBottom: 12,
                }}
            >
                Tampilan Aplikasi
            </Text>

            <Text
                style={{
                    color: warna.secondaryText,
                    marginBottom: 16,
                }}
            >
                Pilih tema yang nyaman untukmu.
            </Text>

            {PILIHAN.map((item) => {
                const terpilih = pilihanTema === item.value;

                return (
                    <Pressable
                        key={item.value}
                        onPress={() => {
                            void ubahTema(item.value).catch((error) => {
                                console.warn("Gagal mengubah tema:", error);
                            });
                        }}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: terpilih }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 16,
                            marginBottom: 12,
                            borderWidth: 1,
                            borderColor: terpilih
                                ? warna.primary
                                : warna.border,
                            borderRadius: 12,
                            backgroundColor: warna.surface,
                        }}
                    >
                        <Text style={{ fontSize: 22, marginRight: 12 }}>
                            {item.ikon}
                        </Text>

                        <Text
                            style={{
                                flex: 1,
                                fontSize: 16,
                                color: warna.text,
                            }}
                        >
                            {item.label}
                        </Text>

                        <Text
                            style={{
                                color: warna.primary,
                                fontWeight: "bold",
                            }}
                        >
                            {terpilih ? "✓ Dipilih" : ""}
                        </Text>
                    </Pressable>
                );
            })}

            <View
                style={{
                    marginTop: 8,
                    padding: 12,
                    backgroundColor: warna.surface,
                    borderRadius: 8,
                }}
            >
                <Text style={{ color: warna.secondaryText }}>
                    Tema aktif: {temaAktif === "dark" ? "Gelap" : "Terang"}
                </Text>
            </View>
        </SafeAreaView>
    );
}