// app/(tabs)/riwayat.tsx
import { useState, useCallback } from "react";
import { View, Text, Button, Alert, Platform, ScrollView, TouchableOpacity, } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ambilSemuaFavorit, hapusFavorit, } from "../../services/favoritStorage";
import { ambilRiwayatPencarian, hapusDariRiwayat, } from "../../services/riwayatStorage";
import { hapusCuacaOffline } from "../../services/offlineStorage";

import { KotaFavorit } from "../../types/favorit";
import { HasilGeocoding } from "../../types/geocoding";
import { useTema } from "../../contexts/ThemeContext";

export default function TabRiwayat() {
    const { warna } = useTema();
    const [daftarFavorit, setDaftarFavorit] =
        useState<KotaFavorit[]>([]);

    const [daftarRiwayat, setDaftarRiwayat] =
        useState<HasilGeocoding[]>([]);

    const [sedangMemuat, setSedangMemuat] = useState(true);

    const muatData = useCallback(async () => {
        setSedangMemuat(true);

        try {
            const [favorit, riwayat] = await Promise.all([
                ambilSemuaFavorit(),
                ambilRiwayatPencarian(),
            ]);

            setDaftarFavorit(favorit);
            setDaftarRiwayat(riwayat);
        } catch (error) {
            console.warn("Gagal memuat riwayat:", error);
        } finally {
            setSedangMemuat(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void muatData();
        }, [muatData])
    );

    function bukaKota(kota: HasilGeocoding) {
        router.navigate({
            pathname: "/",
            params: {
                kotaId: String(kota.id),
                kotaNama: kota.name,
                latitude: String(kota.latitude),
                longitude: String(kota.longitude),
                country: kota.country,
            },
        });
    }

    async function hapusCache(kota: HasilGeocoding) {
        const prosesHapus = async () => {
            try {
                await hapusCuacaOffline(kota.id);

                if (Platform.OS === "web") {
                    window.alert(`Cache cuaca ${kota.name} berhasil dihapus.`);
                } else {
                    Alert.alert(
                        "Berhasil",
                        `Cache cuaca ${kota.name} berhasil dihapus.`
                    );
                }
            } catch (error) {
                if (Platform.OS === "web") {
                    window.alert("Cache gagal dihapus.");
                } else {
                    Alert.alert("Gagal", "Cache gagal dihapus.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (window.confirm(
                `Hapus cache cuaca ${kota.name}? Data offline kota ini akan dihapus.`
            )) {
                await prosesHapus();
            }
            return;
        }

        Alert.alert(
            "Konfirmasi Hapus Cache",
            `Hapus cache cuaca ${kota.name}? Data offline kota ini akan dihapus.`,
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: () => {
                        void prosesHapus();
                    },
                },
            ]
        );
    }

    async function hapusRiwayat(kota: HasilGeocoding) {
        try {
            await hapusDariRiwayat(kota.id);

            setDaftarRiwayat((prev) =>
                prev.filter((item) => item.id !== kota.id)
            );
        } catch (error) {
            Alert.alert("Gagal", "Riwayat tidak dapat dihapus.");
        }
    }

    async function hapusKotaFavorit(
        id: number,
        nama: string
    ) {
        const prosesHapus = async () => {
            await hapusFavorit(id);

            setDaftarFavorit((prev) =>
                prev.filter((kota) => kota.id !== id)
            );
        };

        if (Platform.OS === "web") {
            if (window.confirm(`Hapus ${nama} dari favorit?`)) {
                await prosesHapus();
            }
            return;
        }

        Alert.alert(
            "Konfirmasi",
            `Hapus ${nama} dari favorit?`,
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: () => {
                        void prosesHapus();
                    },
                },
            ]
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: warna.background }}>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                <Text style={{ fontSize: 22, fontWeight: "bold", color: warna.text }}>
                    Riwayat Pencarian
                </Text>

                <Text style={{ color: warna.secondaryText }}>
                    Maksimal 10 kota terakhir yang kamu cari.
                </Text>

                {sedangMemuat ? (
                    <Text style={{ color: warna.text }}>
                        Memuat data...
                    </Text>
                ) : daftarRiwayat.length === 0 ? (
                    <Text style={{ color: warna.text }}>
                        Belum ada riwayat pencarian.
                    </Text>
                ) : (
                    daftarRiwayat.map((kota) => (
                        <View
                            key={kota.id}
                            style={{
                                padding: 12,
                                borderWidth: 1,
                                borderColor: warna.border,
                                borderRadius: 8,
                                backgroundColor: warna.surface,
                                gap: 8,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => bukaKota(kota)}
                                accessibilityRole="button"
                                accessibilityLabel={`Buka cuaca ${kota.name}`}
                            >
                                <Text style={{ fontSize: 16, fontWeight: "600", color: warna.text }}>
                                    {kota.name}
                                </Text>
                                <Text style={{ color: warna.secondaryText }}>
                                    Tekan untuk melihat cuaca kembali
                                </Text>
                            </TouchableOpacity>

                            <Button
                                title="Hapus Cache Cuaca"
                                onPress={() => void hapusCache(kota)}
                            />

                            <Button
                                title="Hapus dari Riwayat"
                                onPress={() => void hapusRiwayat(kota)}
                            />
                        </View>
                    ))
                )}

                <View
                    style={{
                        height: 1,
                        backgroundColor: "#cccccc",
                        marginVertical: 12,
                    }}
                />

                <Text style={{ fontSize: 22, fontWeight: "bold", color: warna.text }}>
                    Kota Favorit
                </Text>

                <Text style={{ color: warna.secondaryText }}>
                    Tersimpan {daftarFavorit.length} kota favorit.
                </Text>

                {daftarFavorit.length === 0 ? (
                    <Text style={{ color: warna.secondaryText }}>
                        Belum ada kota favorit.
                    </Text>
                ) : (
                    daftarFavorit.map((kota) => (
                        <View
                            key={kota.id}
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <Text style={{ flex: 1, color: warna.text }}>
                                {kota.nama}
                            </Text>
                            <Button
                                title="Hapus Favorit"
                                onPress={() =>
                                    void hapusKotaFavorit(
                                        kota.id,
                                        kota.nama
                                    )
                                }
                            />
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
