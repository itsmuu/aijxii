# Koneksi Google Sheets untuk Ujian STS

Dokumen ini menyiapkan database peserta, nilai, dan log pelanggaran di Google Sheets.

## 1. Buat spreadsheet

1. Buka Google Sheets dan buat spreadsheet baru, misalnya `Database STS MikroTik`.
2. Buka menu **Extensions > Apps Script**.
3. Hapus kode contoh yang ada.
4. Salin seluruh isi file `Code.gs` dari project ini ke editor Apps Script.
5. Klik **Save**.
6. Jalankan fungsi `getSheet_` sekali dari editor Apps Script.
7. Saat diminta izin, pilih akun Google sekolah lalu klik **Advanced > Go to project > Allow**.
8. Kembali ke spreadsheet. Sheet `Peserta` akan dibuat otomatis dengan kolom:

   `nama`, `nis`, `status`, `nilai`, `pelanggaran`, `log_pelanggaran`, `waktu_mulai`, `waktu_selesai`, `updated_at`

## 2. Deploy sebagai Web App

1. Di Apps Script klik **Deploy > New deployment**.
2. Pilih tipe **Web app**.
3. Atur **Execute as** menjadi akun pemilik spreadsheet.
4. Atur **Who has access** sesuai kebutuhan sekolah. Untuk uji coba lintas komputer, pilih akses yang mengizinkan pengguna aplikasi membuka endpoint.
5. Klik **Deploy** dan salin URL yang berakhiran `/exec`.
6. Jangan gunakan URL `/dev` untuk aplikasi siswa karena URL tersebut hanya untuk editor/script owner.

## 3. Uji endpoint sebelum mengubah halaman

Buka URL `/exec` di browser. Respons yang benar berbentuk JSON seperti:

```json
{"ok":true,"data":[]}
```

Untuk menguji data peserta, gunakan Apps Script atau Postman dengan body JSON:

```json
{
  "action": "addParticipant",
  "participant": {
    "name": "Andi Prasetyo",
    "nis": "2024001"
  }
}
```

## 4. Integrasi ke halaman

Endpoint ini belum boleh diisi dengan URL contoh. Setelah deployment berhasil, masukkan URL `/exec` pada konfigurasi API yang akan digunakan oleh `admin.html` dan `sts.html`.

Konfigurasi minimal:

```js
const API_URL = 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec';
```

Operasi yang tersedia:

- `listParticipants`
- `addParticipant`
- `updateParticipant`
- `deleteParticipant`
- `resetParticipant`
- `resetAll`
- `saveResult`
- `saveViolation`

## 5. Hal penting agar tidak error

- Gunakan URL deployment `/exec`, bukan `/dev`.
- Pastikan spreadsheet dan Apps Script berada pada akun yang sama.
- Jangan mengubah urutan header sheet.
- Pastikan NIS disimpan sebagai teks agar angka nol di depan tidak hilang.
- Jangan membuka file HTML dengan skema `file://` jika browser memblokir request cross-origin. Jalankan folder melalui server lokal, misalnya extension Live Server.
- Setelah mengubah kode Apps Script, buat deployment versi baru melalui **Deploy > Manage deployments > Edit > New version**.
- Jangan menaruh password Google atau service-account key di file HTML.

## Catatan keamanan

Web App Apps Script yang dibuka untuk anonymous access bukan sistem autentikasi yang kuat. Untuk ujian resmi dengan data sensitif, gunakan login Google Workspace sekolah atau backend seperti Firebase/Supabase. Password admin yang saat ini berada di JavaScript juga sebaiknya dipindahkan ke Apps Script/backend sebelum dipakai di jaringan produksi.
