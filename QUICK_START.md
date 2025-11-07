# ⚡ Quick Start Guide - WhatsApp Blast CLI v2.0

Panduan cepat untuk memulai dalam 5 menit!

---

## 🚀 Installation (2 menit)

```bash
# 1. Clone
git clone https://github.com/windantara/whatsapp-blast-cli.git
cd whatsapp-blast-cli

# 2. Install
npm install

# 3. Setup
npm run setup
```

---

## 📝 Setup Files (1 menit)

### 1. Buat File Nomor: `numberlist/my-contacts.txt`
```text
6281234567890|John Doe
6281234567891|Jane Smith
6281234567892|Bob Johnson
```

**Format:** `nomor|nama` (satu per baris)

### 2. Buat File Pesan: `textlist/my-message.txt`
```text
Halo {name}!

Ini adalah pesan dari saya.

Terima kasih!
```

**Tip:** Gunakan `{name}` untuk personalisasi

---

## ▶️ Jalankan (2 menit)

```bash
npm start
```

### Langkah-langkah:
1. **Scan QR Code** dengan WhatsApp di HP
2. **Pilih opsi** sesuai prompt
3. **Confirm** dan mulai blast!

---

## ⚙️ Konfigurasi Cepat

Edit file `.env`:

```env
# Delay antar pesan (ms)
DEFAULT_DELAY=3000

# Jumlah retry jika gagal
MAX_RETRY_ATTEMPTS=3

# Mode headless
HEADLESS_MODE=false
```

---

## 📊 Monitoring

### Cek Progress
- Progress bar muncul otomatis saat blast
- Menampilkan: persentase, jumlah, success/failed

### Cek Logs
```bash
# Semua logs
cat logs/combined.log

# Error only
cat logs/error.log
```

### Cek Report
```bash
# List reports
ls -lt report/

# Baca report terakhir
cat report/[nama-file].txt
```

---

## 🎯 Tips Cepat

### ✅ DO's
```bash
✓ Test dengan 5-10 nomor dulu
✓ Gunakan delay 3-5 detik
✓ Tambahkan sleep setiap 50 pesan
✓ Cek report setelah blast
✓ Backup session WhatsApp
```

### ❌ DON'Ts
```bash
✗ Jangan kirim ke nomor yang tidak kenal
✗ Jangan gunakan delay < 2 detik
✗ Jangan blast tanpa test dulu
✗ Jangan share .env file
✗ Jangan spam
```

---

## 🔧 Troubleshooting Cepat

### QR Code tidak muncul
```bash
# Set headless = false di .env
HEADLESS_MODE=false
```

### Pesan gagal terkirim
```bash
# Cek format nomor (harus ada country code)
# Contoh: 62812... bukan 0812...

# Increase retry
MAX_RETRY_ATTEMPTS=5
```

### Session expired
```bash
# Hapus session dan scan ulang
rm -rf .wwebjs_auth
npm start
```

---

## 📱 Format Nomor

### ✅ Benar
```text
6281234567890
62812-345-678-90
62 812 345 678 90
+6281234567890
```

### ❌ Salah
```text
0812345678901
812345678902
+0812345678903
```

**Rule:** Harus dimulai dengan country code (62 untuk Indonesia)

---

## 🎨 Contoh Pesan

### Pesan Sederhana
```text
Halo {name}!

Terima kasih sudah bergabung.
```

### Pesan dengan Personalisasi
```text
Halo {name}!

Kami ingin memberitahu bahwa akun Anda sudah aktif.

Silakan login dengan nomor ini.

Terima kasih,
Tim Support
```

### Pesan Marketing
```text
Halo {name}! 🎉

Ada promo spesial untuk Anda:
✅ Diskon 50%
✅ Gratis Ongkir
✅ Bonus Voucher

Buruan sebelum kehabisan!

Link: https://example.com/promo

Salam,
Tim Marketing
```

---

## 🔄 Workflow Ideal

```
1. Test Mode (5-10 nomor)
   ↓
2. Review Report
   ↓
3. Fix Issues (jika ada)
   ↓
4. Small Batch (50-100 nomor)
   ↓
5. Review Report
   ↓
6. Production Blast (all)
   ↓
7. Monitor & Report
```

---

## 📈 Best Settings

### Small Blast (< 50 nomor)
```env
DEFAULT_DELAY=3000
MAX_RETRY_ATTEMPTS=3
```
```
Sleep: Tidak perlu
```

### Medium Blast (50-200 nomor)
```env
DEFAULT_DELAY=4000
MAX_RETRY_ATTEMPTS=3
```
```
Sleep: Setiap 50 pesan, 30 detik
```

### Large Blast (> 200 nomor)
```env
DEFAULT_DELAY=5000
MAX_RETRY_ATTEMPTS=5
```
```
Sleep: Setiap 50 pesan, 60 detik
```

---

## 📋 Checklist Pre-Blast

```
□ File nomor sudah ada di numberlist/
□ File pesan sudah ada di textlist/
□ Sudah test dengan nomor sendiri
□ Format nomor sudah benar (country code)
□ Placeholder {name} sudah benar
□ Delay sudah diset (min 3000ms)
□ Sleep interval sudah diset (untuk blast besar)
□ WhatsApp sudah login
□ Internet connection stable
```

---

## 🎯 Shortcut Commands

```bash
# Start
npm start

# Setup ulang
npm run setup

# Development mode (auto-reload)
npm run dev

# Clean session
rm -rf .wwebjs_auth

# View last report
ls -t report/ | head -1 | xargs -I {} cat report/{}

# View errors only
grep ERROR logs/combined.log

# Count success/failed
grep SUCCESS report/[file].txt | wc -l
grep FAILED report/[file].txt | wc -l
```

---

## 💾 Backup Penting

```bash
# Backup session (sebelum update)
cp -r .wwebjs_auth .wwebjs_auth_backup

# Backup data
tar -czf backup-$(date +%Y%m%d).tar.gz numberlist/ textlist/

# Restore session
cp -r .wwebjs_auth_backup .wwebjs_auth
```

---

## 🆘 Emergency Actions

### Stop Blast
```
Ctrl + C (dua kali)
```

### Reset Everything
```bash
# Stop app
Ctrl + C

# Clean
rm -rf node_modules .wwebjs_auth logs/*

# Reinstall
npm install
npm start
```

### Contact Support
```
1. Check logs: logs/error.log
2. Create issue: GitHub Issues
3. Include: error message + system info
```

---

## 📞 Kontak & Resources

### Documentation
- 📖 [README.md](README.md) - Full documentation
- 📖 [UPGRADE_GUIDE.md](UPGRADE_GUIDE.md) - Upgrade help
- 📖 [COMPARISON.md](COMPARISON.md) - v1 vs v2

### Links
- 🔗 GitHub: [windantara/whatsapp-blast-cli](https://github.com/windantara/whatsapp-blast-cli)
- 🔗 Issues: [Report bugs](https://github.com/windantara/whatsapp-blast-cli/issues)
- 🔗 WhatsApp Web.js: [Documentation](https://wwebjs.dev/)

---

## ✅ Success Checklist

Blast berhasil jika:
- [x] QR Code berhasil di-scan
- [x] Progress bar mencapai 100%
- [x] Success rate > 95%
- [x] Report ter-generate
- [x] No critical errors di log
- [x] Penerima menerima pesan

---

## 🎉 You're Ready!

Sekarang Anda siap menggunakan WhatsApp Blast CLI v2.0!

```bash
# Let's go! 🚀
npm start
```

**Good luck with your blast!** 💪

---

**Made with ❤️ by windantara**

⭐ **Star di GitHub jika membantu!**
