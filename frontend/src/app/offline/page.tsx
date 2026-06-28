"use client";
export default function OfflinePage() {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-background">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Kamu sedang offline</h1>
  
          <p className="text-sm text-gray-600">
            Beberapa fitur mungkin tidak tersedia. Silakan cek koneksi internet
            lalu coba kembali.
          </p>
  
          <a
            href="/"
            className="inline-flex rounded-xl px-4 py-2 bg-primary text-white font-medium"
          >
            Kembali ke Beranda
          </a>
        </div>
      </main>
    );
  }