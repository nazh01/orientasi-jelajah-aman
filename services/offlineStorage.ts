import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    DataCuacaLengkap,
    DataKualitasUdara,
} from "../types/weather";

export interface DataCuacaOffline {
    cuaca: DataCuacaLengkap;
    kualitasUdara: DataKualitasUdara;
    waktuSimpan: string;
}

function buatKunciKota(idKota: number | string): string {
    return `cuaca_offline_${idKota}`;
}

export async function simpanCuacaOffline(
    idKota: number | string,
    cuaca: DataCuacaLengkap,
    kualitasUdara: DataKualitasUdara
): Promise<void> {
    const data: DataCuacaOffline = {
        cuaca,
        kualitasUdara,
        waktuSimpan: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
        buatKunciKota(idKota),
        JSON.stringify(data)
    );
}

export async function ambilCuacaOffline(
    idKota: number | string
): Promise<DataCuacaOffline | null> {
    const json = await AsyncStorage.getItem(buatKunciKota(idKota));

    if (!json) {
        return null;
    }

    return JSON.parse(json) as DataCuacaOffline;
}

export async function hapusCuacaOffline(
    idKota: number | string
): Promise<void> {
    await AsyncStorage.removeItem(buatKunciKota(idKota));
}