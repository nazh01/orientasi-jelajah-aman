// components/AtribusiCuaca.tsx
import { Text, TouchableOpacity, Linking } from "react-native";
import { useTema } from "../contexts/ThemeContext";

export default function AtribusiCuaca() {
    const { warna } = useTema();

    return (
        <TouchableOpacity
            onPress={() => Linking.openURL("https://open-meteo.com/")}
            accessibilityRole="link"
            accessibilityLabel="Buka situs Open-Meteo"
        >
            <Text
                style={{
                    fontSize: 11,
                    color: warna.secondaryText,
                    textAlign: "center",
                }}
            >
                Data cuaca disediakan oleh Open-Meteo.com
            </Text>
        </TouchableOpacity>
    );
}
