import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { typeScale, spacing } from "../../constants/styles";

export default function Tentang() {
  return (
    <SafeAreaView style={{ flex: 1, padding: spacing.sedang }}>
      <View
        accessible
        accessibilityLabel="Halaman Tentang aplikasi Jelajah Aman"
      >
        <Text
          style={{
            fontSize: typeScale.judul,
            fontWeight: "bold",
            marginBottom: spacing.kecil,
          }}
        >
          Jelajah Aman
        </Text>

        <Text
          style={{
            fontSize: typeScale.subjudul,
            fontWeight: "bold",
            marginBottom: spacing.kecil,
          }}
        >
          Tentang Aplikasi
        </Text>

        <Text
          style={{
            fontSize: typeScale.isi,
            marginBottom: spacing.sedang,
          }}
        >
          Jelajah Aman adalah aplikasi untuk mencari informasi
          cuaca berdasarkan kota yang dipilih oleh pengguna.
        </Text>

        <Text
          style={{
            fontSize: typeScale.isi,
            marginBottom: spacing.kecil,
          }}
        >
          Versi: 1.0.0
        </Text>

        <Text
          style={{
            fontSize: typeScale.isi,
          }}
        >
          Dibuat oleh: Nama Kamu
        </Text>
      </View>
    </SafeAreaView>
  );
}