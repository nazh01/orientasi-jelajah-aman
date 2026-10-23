import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { typeScale, spacing } from "../../constants/styles";
import { useTema } from "../../contexts/ThemeContext";

export default function Tentang() {
    const { warna } = useTema();

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: spacing.sedang,
                backgroundColor: warna.background,
            }}
        >
            <View
                accessible
                accessibilityLabel="Halaman Tentang aplikasi Jelajah Aman"
            >
                <Text
                    style={{
                        fontSize: typeScale.judul,
                        fontWeight: "bold",
                        marginBottom: spacing.kecil,
                        color: warna.text,
                    }}
                >
                    Jelajah Aman
                </Text>

                <Text
                    style={{
                        fontSize: typeScale.subjudul,
                        fontWeight: "bold",
                        marginBottom: spacing.kecil,
                        color: warna.text,
                    }}
                >
                    Tentang Aplikasi
                </Text>

                <Text
                    style={{
                        fontSize: typeScale.isi,
                        marginBottom: spacing.sedang,
                        color: warna.secondaryText,
                    }}
                >
                    Jelajah Aman adalah aplikasi untuk mencari informasi
                    cuaca berdasarkan kota yang dipilih oleh pengguna.
                </Text>

                <Text
                    style={{
                        fontSize: typeScale.isi,
                        marginBottom: spacing.kecil,
                        color: warna.text,
                    }}
                >
                    Versi: 1.0.0
                </Text>

                <Text
                    style={{
                        fontSize: typeScale.isi,
                        color: warna.text,
                    }}
                >
                    Dibuat oleh: Nazhifa Naura Yasmin
                </Text>
            </View>
        </SafeAreaView>
    );
}
