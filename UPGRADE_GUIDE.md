# 🚀 Upgrade Guide: v1.0 → v2.0

Panduan lengkap untuk upgrade WhatsApp Blast CLI dari versi 1.0 ke versi 2.0.

## 📋 Daftar Isi
- [Apa yang Baru](#apa-yang-baru)
- [Persiapan](#persiapan)
- [Langkah-langkah Upgrade](#langkah-langkah-upgrade)
- [Konfigurasi](#konfigurasi)
- [Migrasi Data](#migrasi-data)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## ✨ Apa yang Baru

### Fitur Baru
1. **Retry Mechanism** - Otomatis retry pesan yang gagal
2. **Progress Bar** - Tracking real-time dengan statistik
3. **Logging System** - Log lengkap ke file
4. **Validasi Input** - Validasi nomor telepon sebelum kirim
5. **Error Handling** - Error handling yang lebih baik
6. **Konfigurasi .env** - Configuration file yang mudah
7. **Statistics** - Statistik detail setelah blast
8. **Setup Wizard** - Setup otomatis untuk pengguna baru

### Perbaikan
- Dependencies diupdate ke versi terbaru
- Code structure yang lebih modular dan maintainable
- Memory optimization
- Better session management
- Improved async/await handling

## 🎯 Persiapan

### 1. Backup Project Lama
```bash
# Backup seluruh folder project
cp -r whatsapp-blast-cli whatsapp-blast-cli-backup

# Atau backup file penting saja
mkdir backup
cp -r numberlist backup/
cp -r textlist backup/
cp -r report backup/
cp -r .wwebjs_auth backup/
```

### 2. Cek Node.js Version
```bash
node --version
# Pastikan >= 16.0.0
```

Jika kurang dari 16.0.0, update Node.js:
- Download dari: https://nodejs.org/
- Atau gunakan nvm: `nvm install 16`

## 📦 Langkah-langkah Upgrade

### Opsi 1: Fresh Install (Direkomendasikan)

```bash
# 1. Navigasi ke folder project lama
cd whatsapp-blast-cli

# 2. Backup data penting
mkdir ../backup
cp -r numberlist ../backup/
cp -r textlist ../backup/
cp -r .wwebjs_auth ../backup/

# 3. Download versi baru
cd ..
git clone https://github.com/windantara/whatsapp-blast-cli.git whatsapp-blast-cli-v2
cd whatsapp-blast-cli-v2

# 4. Install dependencies
npm install

# 5. Run setup
npm run setup

# 6. Restore data
cp -r ../backup/numberlist/* ./numberlist/
cp -r ../backup/textlist/* ./textlist/
cp -r ../backup/.wwebjs_auth ./

# 7. Test
npm start
```

### Opsi 2: In-Place Upgrade

```bash
# 1. Navigasi ke folder project
cd whatsapp-blast-cli

# 2. Backup file penting
git stash # jika menggunakan git

# 3. Pull versi terbaru
git pull origin main

# 4. Install dependencies baru
npm install

# 5. Run setup untuk file konfigurasi baru
npm run setup

# 6. Test
npm start
```

### Opsi 3: Manual Update

```bash
# 1. Download file-file baru dari repository
# 2. Replace file-file berikut:
#    - index.js (REPLACE)
#    - package.json (REPLACE)
#    - Tambah file baru:
#      - config.js (NEW)
#      - logger.js (NEW)
#      - utils.js (NEW)
#      - whatsapp.js (NEW)
#      - blast.js (NEW)
#      - setup.js (NEW)
#      - .env.example (NEW)

# 3. Update dependencies
npm install

# 4. Create .env file
cp .env.example .env

# 5. Run setup (opsional)
npm run setup
```

## ⚙️ Konfigurasi

### 1. File .env

Buat file `.env` di root project:

```bash
# Copy dari example
cp .env.example .env

# Edit sesuai kebutuhan
nano .env
```

**Konfigurasi Default:**
```env
# WhatsApp Configuration
HEADLESS_MODE=false              # true = browser tersembunyi
DEFAULT_DELAY=3000               # Delay antar pesan (ms)
MAX_RETRY_ATTEMPTS=3             # Jumlah retry jika gagal
RETRY_DELAY=5000                 # Delay antar retry (ms)

# Logging
LOG_LEVEL=info                   # error, warn, info, debug
LOG_FILE_PATH=./logs             # Lokasi file log

# Session
SESSION_PATH=./.wwebjs_auth      # Lokasi session WhatsApp

# Directories
NUMBERLIST_DIR=./numberlist      # Folder daftar nomor
TEXTLIST_DIR=./textlist          # Folder template pesan
REPORT_DIR=./report              # Folder laporan
```

### 2. Struktur Direktori

Pastikan struktur folder seperti ini:
```
whatsapp-blast-cli/
├── node_modules/
├── numberlist/
│   ├── example.txt
│   └── (file nomor Anda)
├── textlist/
│   ├── example.txt
│   └── (file pesan Anda)
├── report/
│   └── (laporan akan tersimpan di sini)
├── logs/
│   ├── combined.log
│   └── error.log
├── .wwebjs_auth/
│   └── (session WhatsApp)
├── config.js
├── logger.js
├── utils.js
├── whatsapp.js
├── blast.js
├── index.js
├── setup.js
├── package.json
├── .env
├── .gitignore
└── README.md
```

## 📂 Migrasi Data

### Format File Tetap Sama!

**File Nomor (`numberlist/*.txt`):**
```text
6281234567890|John Doe
6281234567891|Jane Smith
```

**File Pesan (`textlist/*.txt`):**
```text
Hello {name}!

This is your message.
```

> ✅ Tidak ada perubahan format! File lama Anda tetap compatible.

### Copy Data dari Backup

```bash
# Copy numberlist
cp -r ../backup/numberlist/* ./numberlist/

# Copy textlist
cp -r ../backup/textlist/* ./textlist/

# Copy session WhatsApp (opsional, bisa login ulang)
cp -r ../backup/.wwebjs_auth ./
```

## 🧪 Testing

### 1. Test dengan Data Kecil

```bash
# Buat file test
echo "6281234567890|Test User" > ./numberlist/test.txt
echo "Hello {name}! This is a test message." > ./textlist/test-message.txt

# Run aplikasi
npm start

# Pilih file test
# Set delay 5000ms (5 detik)
# Confirm dan jalankan
```

### 2. Cek Log Files

```bash
# Cek log
cat ./logs/combined.log
cat ./logs/error.log
```

### 3. Cek Report

```bash
# Cek report terakhir
ls -lt ./report/ | head -5
cat ./report/[filename-terbaru].txt
```

## 🔧 Troubleshooting

### Issue 1: Dependencies Error

**Error:**
```
npm ERR! peer dep missing: ...
```

**Solusi:**
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

### Issue 2: Session Error

**Error:**
```
AUTHENTICATION FAILURE
```

**Solusi:**
```bash
# Hapus session lama
rm -rf .wwebjs_auth

# Jalankan ulang dan scan QR baru
npm start
```

### Issue 3: Module Not Found

**Error:**
```
Error: Cannot find module './config'
```

**Solusi:**
```bash
# Pastikan semua file ada
ls -la config.js logger.js utils.js whatsapp.js blast.js

# Jika ada yang kurang, download ulang dari repo
```

### Issue 4: .env File Not Found

**Error:**
```
Warning: .env file not found
```

**Solusi:**
```bash
# Buat .env dari example
cp .env.example .env

# Atau jalankan setup
npm run setup
```

### Issue 5: Permission Error

**Error:**
```
EACCES: permission denied
```

**Solusi:**
```bash
# Fix permissions
chmod +x index.js
chmod +x setup.js

# Atau run dengan sudo (Linux/Mac)
sudo npm start
```

### Issue 6: Port Already in Use

**Error:**
```
Error: Port 8080 is already in use
```

**Solusi:**
```bash
# Kill process di port 8080
# Linux/Mac:
lsof -ti:8080 | xargs kill

# Windows:
netstat -ano | findstr :8080
taskkill /PID [PID] /F
```

## 📊 Perbandingan Fitur

| Fitur | v1.0 | v2.0 |
|-------|------|------|
| Basic Blast | ✅ | ✅ |
| Random Text | ✅ | ✅ |
| Name Placeholder | ✅ | ✅ |
| Delay Control | ✅ | ✅ |
| Sleep Intervals | ✅ | ✅ |
| Reports | ✅ | ✅ Enhanced |
| Retry Mechanism | ❌ | ✅ NEW |
| Progress Bar | ❌ | ✅ NEW |
| Logging System | ❌ | ✅ NEW |
| Input Validation | ❌ | ✅ NEW |
| Statistics | Basic | ✅ Detailed |
| Error Handling | Basic | ✅ Comprehensive |
| Configuration | Hardcoded | ✅ .env File |
| Setup Wizard | ❌ | ✅ NEW |

## 🎉 Selesai!

Setelah mengikuti panduan ini, project Anda sudah berhasil diupgrade ke v2.0!

### Checklist Final:
- [ ] Backup data lama
- [ ] Install dependencies baru
- [ ] Setup .env file
- [ ] Migrasi numberlist & textlist
- [ ] Test dengan data kecil
- [ ] Cek logs
- [ ] Cek reports
- [ ] Blast production

## 📞 Butuh Bantuan?

- **GitHub Issues**: https://github.com/windantara/whatsapp-blast-cli/issues
- **Email**: [your-email]
- **Documentation**: README.md

---

**Selamat menggunakan WhatsApp Blast CLI v2.0! 🎊**
