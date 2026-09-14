import { View, Text } from "react-native";
import { LaporanUdara } from "../types/cuaca";

interface IndikatorAQIProps {
    laporan: LaporanUdara;
}

export default function IndikatorAQI({
    laporan,
}: IndikatorAQIProps) {
    const warnaAQI = {
        "BAIK": "green",
        "SEDANG": "yellow",
        "TIDAK_SEHAT": "orange",
        "BERBAHAYA": "red",
    };
    return (
        <  View style={{ padding: 16, borderWidth: 1, borderColor: warnaAQI[laporan.tingkat], borderRadius: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: warnaAQI[laporan.tingkat] }}>
                Indeks AQI: {laporan.indeksAQI}
            </Text>
            <Text style={{ fontSize: 14, color: warnaAQI[laporan.tingkat] }}>
                Tingkat AQI: {laporan.tingkat}
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>
                Diperbarui pada: {laporan.diperbaruiPada}
            </Text>
        </View >
    )
}