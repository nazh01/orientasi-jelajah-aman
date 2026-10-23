// components/SearchBox.tsx
import { useState } from "react";
import { View, TextInput } from "react-native";
import { useTema } from "../contexts/ThemeContext";

interface SearchBoxProps {
    onCari: (teks: string) => void;
}

export default function SearchBox({ onCari }: SearchBoxProps) {
    const [teks, setTeks] = useState("");
    const { warna } = useTema();

    function handleChange(nilaiBaru: string) {
        setTeks(nilaiBaru);
        onCari(nilaiBaru);
    }

    return (
        <View>
            <TextInput
                placeholder="Cari nama kota..."
                placeholderTextColor={warna.secondaryText}
                value={teks}
                onChangeText={handleChange}
                accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
                selectionColor={warna.primary}
                style={{
                    borderWidth: 1,
                    borderColor: warna.border,
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: warna.surface,
                    color: warna.text,
                }}
            />
        </View>
    );
}
