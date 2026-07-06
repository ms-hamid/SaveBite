
export function set_to_hour(timestamps: string) :string 
{
  return new Date(timestamps).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function format_price(price: number | string | null | undefined) {
  const value = Number(price ?? 0);

  return `Rp ${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function get_close_text(close_time: string) : string {
  const now = new Date();
  const close = new Date(close_time);

  const diff_ms = close.getTime() - now.getTime();
  const diff_total_mnt = Math.floor(diff_ms / 1000 / 60);

  if (diff_total_mnt <= 0) {
    return "Ended";
  }

  if (diff_total_mnt < 60) {
    return `Ends in ${diff_total_mnt}m`;
  }

  const diff_hour = Math.floor(diff_total_mnt / 60);
  const mnt_left = diff_total_mnt % 60;

  return `Ends in ${diff_hour}h ${mnt_left}m`;
}

export function get_remaining_time(target_time: string): string {
  const now = new Date();
  const target = new Date(target_time);

  const diff_ms = target.getTime() - now.getTime();
  const diff_total_mnt = Math.floor(diff_ms / 1000 / 60);

  if (diff_total_mnt <= 0) {
    return "Pickup closed";
  }

  const hours = Math.floor(diff_total_mnt / 60);
  const minutes = diff_total_mnt % 60;

  if (hours === 0) {
    return `Pickup in ${minutes}m`;
  }

  return `[Pickup in ${hours}h ${minutes}m`;
}

/**
 * Menghitung jarak antara dua koordinat menggunakan rumus Haversine.
 * * @param {number} lat1 - Latitude lokasi awal (kamu)
 * @param {number} lon1 - Longitude lokasi awal (kamu)
 * @param {number} lat2 - Latitude lokasi tujuan
 * @param {number} lon2 - Longitude lokasi tujuan
 * @returns {number} Jarak dalam satuan kilometer (km)
 */
export function get_distance(lat1: number, lon1: number, lat2: number | null, lon2: number | null) {
    // Jari-jari bumi dalam kilometer
    const R = 6371; 

    // Mengubah derajat ke radian
    const dLat = (lat2 ?? 0 - lat1) * Math.PI / 180;
    const dLon = (lon2 ?? 0 - lon1) * Math.PI / 180;

    const rLat1 = lat1 * Math.PI / 180;
    const rLat2 = (lat2 ?? 0) * Math.PI / 180;

    // Rumus inti Haversine
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Hasil akhir (jarak dalam km)
    const jarak = R * c; 

    return jarak;
}


/**
 * Mengambil koordinat lokasi saat ini.
 * @returns {Promise<{lat: number, lon: number}>}
 */
export function get_current_location() {
    return new Promise((resolve, reject) => {
        // Cek apakah browser mendukung Geolocation
        if (!navigator.geolocation) {
            reject(new Error("Browser kamu tidak mendukung Geolocation."));
            return;
        }

        const opsi = {
            enableHighAccuracy: true, // Minta akurasi tinggi (GPS jika tersedia)
            timeout: 5000,            // Waktu tunggu maksimal 5 detik
            maximumAge: 0             // Jangan gunakan cache lokasi lama
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Berhasil mendapatkan lokasi
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                // Gagal (karena ditolak user, timeout, atau sinyal hilang)
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        reject(new Error("User menolak akses lokasi."));
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject(new Error("Informasi lokasi tidak tersedia."));
                        break;
                    case error.TIMEOUT:
                        reject(new Error("Waktu permintaan lokasi habis (timeout)."));
                        break;
                    default:
                        reject(new Error("Terjadi kesalahan yang tidak diketahui."));
                }
            },
            opsi
        );
    });
}


/**
 * Fungsi untuk menyalin teks ke clipboard
 * @param {string} text - Teks yang ingin disalin
 * @returns {Promise<boolean>} - Mengembalikan true jika berhasil, false jika gagal
 */
export async function copyToClipboard(text: string) {
  if (!text) return false;
  
  try {
    // Menghapus spasi jika teksnya berupa nomor rekening/VA (opsional, seperti kodemu)
    const cleanText = text.toString().replace(/\s/g, "");
    
    await navigator.clipboard.writeText(cleanText);
    return true;
  } catch (err) {
    console.error("Gagal menyalin teks: ", err);
    return false;
  }
}