// src/app/(tabs)/index.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { mintaIzinLokasi, ambilKoordinatSaatIni } from "../../services/locationService";
import { View, Text, ActivityIndicator, Button, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingServices";
import { ambilCuaca } from "../../services/weatherService";
import { ambilKualitasUdara } from "../../services/airQualityService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { HasilGeocoding } from "../../types/geocoding";
import { DataCuacaLengkap, DataKualitasUdara } from "../../types/weather";
import { ambilSemuaFavorit } from "../../services/favoritStorage";
import { DAFTAR_KOTA_LOKAL } from  "../../constants/kotaOffline"
import { simpanCuacaOffline, ambilCuacaOffline, } from "../../services/offlineStorage";
import { simpanRiwayatPencarian, } from "../../services/riwayatStorage";
import { useTema } from "../../contexts/ThemeContext";

export default function HalamanUtama() {
  const { warna } = useTema();

  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [cuaca, setCuaca] = useState<DataCuacaLengkap | null>(null);
  const [kualitasUdara, setKualitasUdara] = useState<DataKualitasUdara | null>(null);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const [sudahFavorit, setSudahFavorit] = useState(false);
  
  const teksTertunda = useDebounce(teksCari, 800);
  const requestIdRef = useRef(0); // pencegah race condition
  const params = useLocalSearchParams<{
    kotaId?: string;
    kotaNama?: string;
    latitude?: string;
    longitude?: string;
    country?: string;
  }>();

  useEffect(() => {
    if (
      !params.kotaId ||
      !params.kotaNama ||
      !params.latitude ||
      !params.longitude
    ) {
      return;
    }

    const kota: HasilGeocoding = {
      id: Number(params.kotaId),
      name: params.kotaNama,
      latitude: Number(params.latitude),
      longitude: Number(params.longitude),
      country: params.country ?? "",
    };

    void pilihKota(kota);
  }, [
    params.kotaId,
    params.kotaNama,
    params.latitude,
    params.longitude,
    params.country,
  ]);

  useEffect(() => {
    const kataKunci = teksTertunda.trim();

    if (kataKunci.length === 0) {
      setHasilPencarian([]);
      return;
    }

    let masihAktif = true;

    async function cariKotaOnline() {
      try {
        // Cari kota menggunakan API Geocoding
        const hasil = await cariKota(kataKunci);

        if (masihAktif) {
          setHasilPencarian(hasil);
        }
      } catch (error) {
        // Jika internet/API gagal, gunakan daftar lokal
        const kata = kataKunci.toLowerCase();

        const hasilLokal = DAFTAR_KOTA_LOKAL.filter((kota) =>
          kota.name.toLowerCase().includes(kata)
        );

        if (masihAktif) {
          setHasilPencarian(hasilLokal);
        }
      }
    }

  cariKotaOnline();

  return () => {
    masihAktif = false;
  };
}, [teksTertunda]);


  useFocusEffect(
    useCallback(() => {
      async function cekFavorit() {
        if (!kotaTerpilih) {
          setSudahFavorit(false);
          return;
        }

        const daftarFavorit = await ambilSemuaFavorit();

        const sudahAda = daftarFavorit.some(
          (kota) => kota.id === kotaTerpilih.id
        );

        setSudahFavorit(sudahAda);
      }

      cekFavorit();
    }, [kotaTerpilih])
  );

  async function pilihKota(kota: HasilGeocoding) {
    setKotaTerpilih(kota);

    const idSaatIni = ++requestIdRef.current;

    setSedangMemuat(true);
    setPesanError(null);

    // catat kota yang dipilih ke riwayat pencarian
    try {
      await simpanRiwayatPencarian(kota);
    } catch (error) {
      console.warn("Gagal menyimpan riwayat pencarian:", error);
    }

    try {
      // Coba mengambil data terbaru dari API
      const [dataCuaca, dataAQI] = await Promise.all([
        ambilCuaca(kota.latitude, kota.longitude),
        ambilKualitasUdara(kota.latitude, kota.longitude),
      ]);

      // Abaikan hasil dari permintaan kota yang sudah tidak aktif
      if (idSaatIni !== requestIdRef.current) return;

      setCuaca(dataCuaca);
      setKualitasUdara(dataAQI);

      // Simpan data berhasil diambil agar bisa dipakai saat offline
      try {
        await simpanCuacaOffline(
          kota.id,
          dataCuaca,
          dataAQI
        );
      } catch (error) {
        console.warn("Gagal menyimpan cache cuaca:", error);
      }
    } catch (error) {
      if (idSaatIni !== requestIdRef.current) return;

      // API gagal, coba gunakan data yang tersimpan di HP
      try {
        const dataLokal = await ambilCuacaOffline(kota.id);

        if (idSaatIni !== requestIdRef.current) return;

        if (dataLokal) {
          setCuaca(dataLokal.cuaca);
          setKualitasUdara(dataLokal.kualitasUdara);

          setPesanError(
            `Mode offline. Data terakhir disimpan: ${
              new Date(dataLokal.waktuSimpan).toLocaleString("id-ID")
            }`
          );
        } else {
          setCuaca(null);
          setKualitasUdara(null);

          setPesanError(
            "Data offline untuk kota ini belum tersedia. Hubungkan internet dan pilih kota ini terlebih dahulu."
          );
        }
      } catch (errorLokal) {
        if (idSaatIni !== requestIdRef.current) return;

        setPesanError(
          "Data cuaca tidak dapat diambil. Periksa koneksi internet dan penyimpanan lokal."
        );
      }
    } finally {
      if (idSaatIni === requestIdRef.current) {
        setSedangMemuat(false);
      }
    }
  }


  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();

    if (status === "denied") {
      setPesanLokasi("Izin lokasi ditolak. Silakan cari kota secara manual di atas.");
      return;
    }
    if (status === "unavailable") {
      setPesanLokasi("Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.");
      return;
    }

    setPesanLokasi(null);
    const koordinat = await ambilKoordinatSaatIni();
    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 16, backgroundColor: warna.background }}>
      <SearchBox onCari={setTeksCari}/>
      <Button title="Gunakan Lokasi Saat Ini" onPress={gunakanLokasiSaatIni} />
      {pesanLokasi && (
        <Text style={{ color: warna.secondaryText }}>
          {pesanLokasi}
        </Text>
      )}

      {hasilPencarian.map((kota) => (
        <TouchableOpacity
            key={kota.id}
            onPress={() => pilihKota(kota)}
            style={{
              padding: 10,
              backgroundColor: warna.surface,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: warna.text }}>
              {kota.name}
            </Text>
        </TouchableOpacity>
      ))}

      {sedangMemuat && <ActivityIndicator />}

      {pesanError && (
        <View>
          <Text style={{ color: warna.text }}>
            {pesanError}
          </Text>
          <Button
            title="Coba Lagi"
            onPress={() => kotaTerpilih && pilihKota(kotaTerpilih)}
          />
        </View>
      )}

      {cuaca && kualitasUdara && kotaTerpilih && !sedangMemuat && (
        <>
          <WeatherCard
            kota={kotaTerpilih.name}
            suhu={cuaca.saatIni.suhu}
            tingkatAQI={konversiTingkatAQI(kualitasUdara.indeksAQI)}
            indeksAQI={kualitasUdara.indeksAQI}
          />
          <Button
            title={
              sudahFavorit
                ? "Sudah di Favoritkan"
                : "Tambahkan ke Favorit"
            }
            disabled={sudahFavorit}
            onPress={() =>
              router.push({
                pathname: "/tambah-favorit",
                params: {
                    id: String(kotaTerpilih.id),
                    nama: kotaTerpilih.name,
                    lat: String(kotaTerpilih.latitude),
                    lon: String(kotaTerpilih.longitude),
                  },
                })
              }
          />
        </>
      )}

      {cuaca && (
        <Text style={{ fontSize: 12, color: warna.secondaryText }}>
          Kondisi: {labelKodeCuaca(cuaca.saatIni.kodeCuaca)} • Angin {cuaca.saatIni.kecepatanAngin} km/j
        </Text>
      )}

      <View>
        <Text style={{ fontSize: 11, color: warna.secondaryText, textAlign: "center" }}>
          PM2.5: {kualitasUdara?.pm25 ?? "-"} µg/m³
        </Text>

        <Text style={{ fontSize: 11, color: warna.secondaryText, textAlign: "center" }}>
          PM10: {kualitasUdara?.pm10 ?? "-"} µg/m³
        </Text>
      </View>

      <AtribusiCuaca/>
    </SafeAreaView>
  );
}