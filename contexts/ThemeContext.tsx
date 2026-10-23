// contexts/ThemeContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { useColorScheme } from "react-native";

export type PilihanTema = "light" | "dark" | "system";

export const WARNA = {
    light: {
        background: "#F5F7FA",
        surface: "#FFFFFF",
        text: "#172033",
        secondaryText: "#64748B",
        border: "#D8E0EA",
        primary: "#168AAD",
        danger: "#DC2626",
        tabBackground: "#FFFFFF",
    },
    dark: {
        background: "#111827",
        surface: "#1F2937",
        text: "#F9FAFB",
        secondaryText: "#CBD5E1",
        border: "#374151",
        primary: "#7DD3FC",
        danger: "#F87171",
        tabBackground: "#1F2937",
    },
};

type ThemeContextType = {
    pilihanTema: PilihanTema;
    temaAktif: "light" | "dark";
    warna: typeof WARNA.light;
    ubahTema: (tema: PilihanTema) => Promise<void>;
    siap: boolean;
};

const KUNCI_TEMA = "@jelajah_aman:tema";

const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const skemaSistem = useColorScheme();

    const [pilihanTema, setPilihanTema] =
        useState<PilihanTema>("system");

    const [siap, setSiap] = useState(false);

    useEffect(() => {
        let aktif = true;

        async function muatTema() {
            try {
                const tersimpan = await AsyncStorage.getItem(KUNCI_TEMA);

                if (
                    aktif &&
                    (tersimpan === "light" ||
                        tersimpan === "dark" ||
                        tersimpan === "system")
                ) {
                    setPilihanTema(tersimpan);
                }
            } catch (error) {
                console.warn("Gagal memuat tema:", error);
            } finally {
                if (aktif) {
                    setSiap(true);
                }
            }
        }

        void muatTema();

        return () => {
            aktif = false;
        };
    }, []);

    const ubahTema = useCallback(
        async (tema: PilihanTema) => {
            // Simpan pilihan ke perangkat sebelum memperbarui state.
            await AsyncStorage.setItem(KUNCI_TEMA, tema);
            setPilihanTema(tema);
        },
        []
    );

    const temaAktif: "light" | "dark" =
        pilihanTema === "system"
            ? skemaSistem === "dark"
                ? "dark"
                : "light"
            : pilihanTema;

    const value = useMemo(
        () => ({
            pilihanTema,
            temaAktif,
            warna: WARNA[temaAktif],
            ubahTema,
            siap,
        }),
        [pilihanTema, temaAktif, ubahTema, siap]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTema() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTema harus digunakan di dalam ThemeProvider."
        );
    }

    return context;
}
