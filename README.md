# String Compresser - BackEnd
<h2 align="center">
   Text Compresser
</h2>
<hr>

## Table of Contents
1. [General Info](#general-information)
2. [Creator Info](#creator-information)
3. [Features](#features)
4. [Technologies Used](#technologies-used)
5. [Setup](#setup)
6. [Usage](#usage)
7. [Algorithm](#usage)
8. [Video Capture](#videocapture)
9. [Screenshots](#screenshots)
10. [Structure](#structure)
11. [Project Status](#project-status)
12. [Room for Improvement](#room-for-improvement)
13. [Acknowledgements](#acknowledgements)
14. [Contact](#contact)

<a name="general-information"></a>

## General Information
Sebuah aplikasi berbasis website sederhana yang dapat digunakan untuk melakukan encode dan decode terhadap masukan string tertentu dengan menggunakan 2 pilihan algoritma, yaitu: `LZW (Lempel-Ziv-Welch)` dan `Huffman`. Website ini disusun menggunakan React untuk frontend framework serta Node dan Express untuk backend framework. Tugas ini disusun untuk memenuhi tugas pertama seleksi Lab IRK tahun 2023.
 
<a name="creator-information"></a>

## Creator Information

| Nama                        | NIM      | E-Mail                      |
| --------------------------- | -------- | --------------------------- |
| Mohammad Rifqi Farhansyah   | 13521166 | 13521166@std.stei.itb.ac.id |

<a name="features"></a>

## Features
- Memilih `algoritma` yang akan digunakan, yaitu: `LZW` atau `Huffman`
- Melakukan proses `encode` suatu text masukan menjadi `binary` atau `decimal`
- Melakukan proses `decode` suatu text masukan menjadi `binary` atau `decimal`

<a name="technologies-used"></a>

## Technologies Used
* [Node](https://nodejs.org/en) - versi 16.18.0
* [React](https://react.dev/) - versi 18.2.0

> Note: The version of the libraries above is the version that we used in this project. You can use the latest version of the libraries.

<a name="setup"></a>

## Setup
1. Clone Repository ini dengan menggunakan command berikut
   ```sh
   git clone https://github.com/rifqifarhansyah/CompresserString-WebApp.git
   ```
2. Buka Folder "stringcompresser-backend" di Terminal
3. Install Packages yang diperlukan
   ```sh
   npm i
   ```
4. Untuk menjalankan backend pada localhost, masukkan command
   ```sh
   node index.js
   ```
6. Buka `localhost` yang digunakan pada Browser Anda `(default PORT : 5000)`

<a name="usage"></a>

## Usage
1. Pilih `algoritma` yang akan digunakan menggunakan dropdownButton di bagian atas layar
2. Tentukan opsi program yang hendak dipilih, yaitu: `encode` atau `decode`
3. Ketikkan `masukan string` pada kolom text-field yang telah disediakan
4. Pilih `Output Choice` serta `Input Choice` yang hendak digunakan (Binary atau Decimal)
5. Tekan tombol `Encode` atau `Decode`

<a name="algorithm"></a>

## Algorithm
### Implementasi LZW Proses Encode
1. Inisialisasi tabel dengan setiap karakter tunggal sebagai entri awal dan penomoran indeks 0 hingga 255 (sesuai jumlah karakter ASCII yang digunakan).
2. Inisialisasi variabel p dengan karakter pertama dari inputEncoder.
3. Inisialisasi variabel c dengan string kosong.
4. Inisialisasi variabel code dengan nilai 256 sebagai indeks berikutnya dalam tabel.
5. Inisialisasi array outputCode untuk menyimpan hasil encoding.
6. Lakukan perulangan untuk setiap karakter dalam inputEncoder:
   - Gabungkan karakter saat ini c dengan karakter berikutnya dalam inputEncoder.
   - Periksa apakah kombinasi p + c ada dalam tabel:
         - Jika iya, perbarui p menjadi p + c.
         - Jika tidak, tambahkan kode untuk p ke dalam outputCode, tambahkan p + c sebagai entri baru dalam tabel dengan kode code, dan tingkatkan nilai code sebesar 1. Perbarui p menjadi c.
   - Set c menjadi string kosong untuk iterasi berikutnya.
7. Tambahkan kode untuk p ke dalam outputCode.
8. Jika outputChoice adalah "binary", ubah setiap elemen dalam outputCode menjadi format biner.
9. Kembalikan outputCode sebagai hasil encoding.
### Implementasi LZW Proses Decode
1. Inisialisasi tabel dengan setiap karakter tunggal sebagai entri awal dan penomoran indeks 0 hingga 255.
2. Split inputDecoder menjadi array inputDecoded dengan memisahkan berdasarkan spasi dan menghapus spasi tambahan.
3. Inisialisasi variabel old dengan nilai dari elemen pertama dalam inputDecoded, mengonversinya ke bilangan desimal dengan basis sesuai dengan inputChoice.
4. Inisialisasi variabel n, s, dan decodedString dengan nilai-nilai awal yang sesuai.
5. Inisialisasi variabel count dengan nilai 256 sebagai indeks berikutnya dalam tabel.
6. Lakukan perulangan untuk setiap elemen dalam inputDecoded (kecuali elemen terakhir):
   - Ubah elemen saat ini menjadi bilangan desimal dengan basis sesuai dengan inputChoice.
   - Periksa apakah bilangan n ada dalam tabel:
         - Jika iya, setel entry dengan nilai entri dalam tabel untuk bilangan n.
         - Jika tidak, setel entry dengan gabungan antara entri dalam tabel untuk bilangan old dan karakter pertama dari s.
   - Tambahkan entry ke dalam decodedString.
   - Tambahkan entri baru dalam tabel dengan indeks count, yang merupakan gabungan antara entri dalam tabel untuk bilangan old dan karakter pertama dari entry.
   - Tingkatkan nilai count sebesar 1.
   - Perbarui nilai old menjadi n dan s menjadi entry.
7. Kembalikan decodedString sebagai hasil dekompresi.
### Implementasi Huffman Proses Encode
1. Menghitung frekuensi kemunculan setiap karakter dalam teks inputEncoder menggunakan fungsi getCharacterFrequency.
2. Membangun pohon Huffman menggunakan fungsi buildHuffmanTree berdasarkan frekuensi karakter.
3. Menghasilkan kode Huffman untuk setiap karakter menggunakan fungsi generateHuffmanCodes.
4. Mengonversi teks menjadi kode Huffman menggunakan fungsi encodeText.
5. Jika outputChoice adalah "decimal":
   - Mengonversi kode Huffman menjadi bilangan desimal menggunakan fungsi binaryToDecimal.
   - Menampilkan hasil kompresi dalam bentuk array bilangan desimal.
   - Menyimpan kode Huffman dalam file "file.txt" menggunakan fs.appendFile.
   - Mengembalikan hasil kompresi dalam bentuk string bilangan desimal.
6. Jika outputChoice bukan "decimal":
   - Menampilkan kode Huffman.
   - Menampilkan hasil kompresi dalam bentuk kode Huffman.
   - Menyimpan kode Huffman dalam file "file.txt" menggunakan fs.appendFile.
   - Mengembalikan hasil kompresi dalam bentuk string kode Huffman.
### Implementasi Huffman Proses Decode
1. Membaca file "file.txt" yang berisi kode Huffman.
2. Mengambil informasi kode Huffman dari file dan menyimpannya dalam objek codes.
3. Memecah teks yang dikodekan menjadi array encodedText.
4. Iterasi untuk setiap kode dalam encodedText:
   - Membentuk kode Huffman saat ini (currentCode).
   - Jika codes memiliki kode Huffman tersebut:
         - Menambahkan karakter yang sesuai ke decodedText.
         - Me-reset currentCode.
5. Mengembalikan teks yang sudah didekodekan (decodedText).

<a name="videocapture"></a>

## Video Capture
<nl>

![CompresserString Gif](https://github.com/rifqifarhansyah/StringCompresser-Backend/blob/main/img/textCompresser.gif?raw=true)

<a name="screenshots"></a>

## Screenshots
<p>
  <p>Gambar 1. Landing Page</p>
  <img src="/img/SS1.png/">
  <nl>
  <p>Gambar 2. LZW dengan Binary</p>
  <img src="/img/SS2.png/">
  <nl>
  <p>Gambar 3. LZW dengan Decimal</p>
  <img src="/img/SS3.png/">
  <nl>
   <p>Gambar 4. Huffman dengan Binary</p>
   <img src="/img/SS4.png/">
   <nl>
</p>

<a name="structure"></a>

## Structure
```bash
├───.vscode
├───backend
│   └───node_modules
├───frontend
│   ├───node_modules
│   ├───public
│   └───src
│       ├───components
│       ├───pages
│       │   └───Home
│       └───styles
└───img
```

<a name="project-status">

## Project Status
Project is: _complete_

<a name="room-for-improvement">

## Room for Improvement
Perbaikan yang dapat dilakukan pada program ini adalah:
- Menambahkan algoritma-algoritma serta fungsionalitas lainnya

<a name="acknowledgements">

## Acknowledgements
- Terima kasih kepada Tuhan Yang Maha Esa

<a name="contact"></a>

## Contact
<h4 align="center">
  Kontak Saya : mrifki193@gmail.com<br/>
  2023
</h4>
<hr>
