// services/riwayatStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HasilGeocoding } from "../types/geocoding";

const KUNCI_RIWAYAT = "@jelajah_aman:riwayat_pencarian";
const MAKSIMAL_RIWAYAT = 10;

export async function ambilRiwayatPencarian(): Promise<HasilGeocoding[]> {
    const json = await AsyncStorage.getItem(KUNCI_RIWAYAT);

    if (!json) {
        return [];
    }

    return JSON.parse(json) as HasilGeocoding[];
}

export async function simpanRiwayatPencarian(
    kota: HasilGeocoding
): Promise<void> {
    // Lokasi perangkat bukan pencarian kota biasa.
    if (kota.id === -1) {
        return;
    }

    const daftarLama = await ambilRiwayatPencarian();

    // Kota yang baru dicari diletakkan di posisi paling atas.
    const daftarBaru = [
        kota,
        ...daftarLama.filter((item) => item.id !== kota.id),
    ].slice(0, MAKSIMAL_RIWAYAT);

    await AsyncStorage.setItem(
        KUNCI_RIWAYAT,
        JSON.stringify(daftarBaru)
    );
}

export async function hapusDariRiwayat(
    idKota: number
): Promise<void> {
    const daftar = await ambilRiwayatPencarian();

    const daftarBaru = daftar.filter(
        (kota) => kota.id !== idKota
    );

    await AsyncStorage.setItem(
        KUNCI_RIWAYAT,
        JSON.stringify(daftarBaru)
    );
}

export async function hapusSemuaRiwayat(): Promise<void> {
    await AsyncStorage.removeItem(KUNCI_RIWAYAT);
}
