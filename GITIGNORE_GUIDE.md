# 📝 .gitignore Configuration Guide

Panduan lengkap tentang konfigurasi .gitignore untuk WhatsApp Blast CLI v2.0.

---

## 🎯 Tujuan

File `.gitignore` digunakan untuk mencegah file-file sensitif, temporary, dan tidak perlu di-commit ke repository Git.

---

## 📋 Struktur .gitignore

### 1. **Node.js Dependencies** 📦
```gitignore
/node_modules/
npm-debug.log*
yarn-debug.log*
package-lock.json
```

**Why?**
- `node_modules/` sangat besar (50-200MB)
- Bisa di-install ulang dengan `npm install`
- Berbeda antar sistem operasi

**Action:** Selalu ignore, tidak perlu di-commit

---

### 2. **WhatsApp Session & Cache** 🔐
```gitignore
/.wwebjs_auth/
/.wwebjs_cache/
session-*.json
```

**Why?**
- Berisi session WhatsApp yang sensitif
- Ukuran besar (50-100MB)
- Personal data
- Security risk jika di-commit

**Action:** **WAJIB** ignore, jangan pernah di-commit!

**⚠️ SECURITY WARNING:**
Jika session files ter-commit, siapapun bisa akses WhatsApp Anda!

---

### 3. **User Data Directories** 📁

#### Number Lists
```gitignore
/numberlist/*
!/numberlist/example.txt
!/numberlist/.gitkeep
```

**Pattern:** Ignore semua, kecuali example dan .gitkeep

**Why?**
- Berisi nomor telepon pelanggan (privacy!)
- Data sensitif
- Bisa berubah-ubah

**Keep:** File example untuk dokumentasi

#### Text/Message Lists
```gitignore
/textlist/*
!/textlist/example.txt
!/textlist/.gitkeep
```

**Pattern:** Sama dengan numberlist

**Why?**
- Template pesan bisa berisi info bisnis rahasia
- Marketing content yang confidential

**Keep:** File example untuk dokumentasi

#### Reports
```gitignore
/report/*
!/report/README.txt
!/report/.gitkeep
```

**Pattern:** Ignore semua report, kecuali README

**Why?**
- Report berisi data blast yang sensitif
- Nomor telepon dan status pengiriman
- Privacy concerns

---

### 4. **Logs** 📊
```gitignore
/logs/
*.log
combined.log
error.log
```

**Why?**
- Log files bisa sangat besar (10MB+)
- Berisi informasi runtime yang tidak perlu di-version
- Regenerated setiap run

**Action:** Always ignore

---

### 5. **Environment Variables** 🔑
```gitignore
.env
.env.local
.env.*.local
```

**Why?**
- Berisi konfigurasi sensitif
- API keys, passwords, tokens
- Berbeda per environment (dev/prod)

**Action:** **WAJIB** ignore!

**Best Practice:**
- Commit `.env.example` (template tanpa nilai sensitif)
- Ignore `.env` (file aktual dengan nilai real)

**Example:**
```bash
# ✅ Commit this (.env.example)
DATABASE_URL=your_database_url_here
API_KEY=your_api_key_here

# ❌ Don't commit this (.env)
DATABASE_URL=postgresql://real_connection_string
API_KEY=sk-real-api-key-12345
```

---

### 6. **IDE & Editor Configurations** 💻

#### Visual Studio Code
```gitignore
.vscode/
```

#### JetBrains (IntelliJ, WebStorm)
```gitignore
.idea/
*.iml
```

#### Others
```gitignore
*.swp          # Vim
*.sublime-*    # Sublime Text
```

**Why?**
- Personal editor preferences
- Berbeda antar developer
- Tidak relevan untuk project

**Exception:** Project-wide settings bisa di-commit
```gitignore
.vscode/
!.vscode/settings.json  # Project settings (optional)
```

---

### 7. **Operating System Files** 💾

#### macOS
```gitignore
.DS_Store
.AppleDouble
```

#### Windows
```gitignore
Thumbs.db
Desktop.ini
```

#### Linux
```gitignore
.directory
```

**Why?**
- OS metadata files
- Tidak berguna untuk project
- Different per OS

---

### 8. **Backup & Temporary Files** 🗑️
```gitignore
*.tmp
*.temp
*.bak
*.backup
*.old
*~
```

**Why?**
- Temporary work files
- Editor backups
- Not needed in version control

---

### 9. **Sensitive Files** 🔒
```gitignore
secrets.json
credentials.json
*.pem
*.key
*.cert
```

**Why?**
- **CRITICAL:** Security credentials
- Never commit these!
- Security breach if exposed

---

## 🚨 Critical Files to NEVER Commit

### 1. WhatsApp Session
```
❌ .wwebjs_auth/
❌ session-*.json
```
**Risk:** Anyone can access your WhatsApp!

### 2. Environment Files
```
❌ .env
❌ credentials.json
```
**Risk:** API keys, passwords exposed!

### 3. User Data
```
❌ numberlist/* (except examples)
❌ report/*
```
**Risk:** Privacy violation, GDPR issues!

### 4. Private Keys
```
❌ *.pem
❌ *.key
❌ *.cert
```
**Risk:** Security breach!

---

## ✅ Files TO Commit

### Configuration Templates
```
✅ .env.example
✅ .gitignore
```

### Documentation
```
✅ README.md
✅ *.md files
```

### Source Code
```
✅ *.js
✅ package.json
```

### Example Files
```
✅ numberlist/example.txt
✅ textlist/example.txt
```

### Directory Keepers
```
✅ */.gitkeep
```

---

## 🛠️ Best Practices

### 1. Review Before Commit
```bash
# Check what will be committed
git status

# Check diff
git diff

# Check if sensitive files are staged
git diff --cached
```

### 2. Use .gitkeep for Empty Folders
```bash
# Git doesn't track empty folders
# Use .gitkeep to preserve folder structure
touch logs/.gitkeep
touch report/.gitkeep
```

### 3. Test Your .gitignore
```bash
# Check if file is ignored
git check-ignore -v [filename]

# Example
git check-ignore -v .env
# Output: .gitignore:45:.env    .env
```

### 4. Global .gitignore (Optional)
```bash
# Create global gitignore for OS/Editor files
git config --global core.excludesfile ~/.gitignore_global

# Add to ~/.gitignore_global
echo ".DS_Store" >> ~/.gitignore_global
echo "Thumbs.db" >> ~/.gitignore_global
echo ".vscode/" >> ~/.gitignore_global
```

---

## 🔧 Common Issues & Solutions

### Issue 1: File Already Committed
**Problem:** Accidentally committed `.env` or session files

**Solution:**
```bash
# Remove from git but keep local file
git rm --cached .env
git rm -r --cached .wwebjs_auth/

# Commit the removal
git commit -m "Remove sensitive files from git"

# Make sure .gitignore includes these
echo ".env" >> .gitignore
echo ".wwebjs_auth/" >> .gitignore

# Push
git push
```

**⚠️ WARNING:** File masih ada di history! Untuk sensitive data:
```bash
# Use git filter-branch or BFG Repo-Cleaner
# See: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
```

### Issue 2: .gitignore Not Working
**Problem:** Files still being tracked

**Solution:**
```bash
# Clear git cache
git rm -r --cached .
git add .
git commit -m "Fix .gitignore"
```

### Issue 3: Want to Track Ignored File
**Problem:** Need to commit a file that matches ignore pattern

**Solution:**
```bash
# Force add
git add -f path/to/file

# Or use negation in .gitignore
# Example:
# /logs/*        # Ignore all
# !/logs/important.log  # Except this one
```

---

## 📊 Folder Structure After .gitignore

```
whatsapp-blast-cli/
├── .git/                    ✅ Git metadata
├── .gitignore              ✅ Ignore rules
├── .env.example            ✅ Config template
├── *.js                    ✅ Source code
├── package.json            ✅ Dependencies
├── *.md                    ✅ Documentation
│
├── numberlist/
│   ├── .gitkeep            ✅ Tracked
│   ├── example.txt         ✅ Tracked
│   ├── customers.txt       ❌ Ignored (has data)
│   └── clients.txt         ❌ Ignored (has data)
│
├── textlist/
│   ├── .gitkeep            ✅ Tracked
│   ├── example.txt         ✅ Tracked
│   ├── promo.txt           ❌ Ignored (has content)
│   └── announcement.txt    ❌ Ignored (has content)
│
├── report/
│   ├── .gitkeep            ✅ Tracked
│   ├── README.txt          ✅ Tracked
│   └── *.txt               ❌ Ignored (has reports)
│
├── logs/
│   ├── .gitkeep            ✅ Tracked
│   ├── combined.log        ❌ Ignored
│   └── error.log           ❌ Ignored
│
├── .wwebjs_auth/           ❌ Ignored (sensitive!)
├── .env                    ❌ Ignored (sensitive!)
└── node_modules/           ❌ Ignored (large)
```

---

## 🎯 Quick Reference

### Always Ignore
```
✓ node_modules/
✓ .wwebjs_auth/
✓ .env
✓ *.log
✓ Actual user data
✓ Reports with data
✓ OS files (.DS_Store, Thumbs.db)
```

### Always Commit
```
✓ Source code (*.js)
✓ package.json
✓ .gitignore
✓ .env.example
✓ Documentation (*.md)
✓ Example files
✓ .gitkeep files
```

### Never Commit
```
✗ Passwords/API keys
✗ WhatsApp sessions
✗ Customer data
✗ Private keys
✗ Credentials
```

---

## 🔍 Verification Checklist

Before pushing to remote:

```
□ Check git status: git status
□ No .env files staged
□ No .wwebjs_auth/ files staged
□ No actual numberlist files (only examples)
□ No reports with data
□ No logs files
□ No node_modules/
□ Review changes: git diff --cached
```

---

## 📚 Additional Resources

- [Git Documentation - .gitignore](https://git-scm.com/docs/gitignore)
- [GitHub .gitignore Templates](https://github.com/github/gitignore)
- [Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

## 💡 Pro Tips

1. **Review .gitignore regularly** as project grows
2. **Test before committing** with `git status`
3. **Use comments** in .gitignore to document rules
4. **Keep it organized** with sections
5. **Share with team** - ensure everyone uses same rules

---

## ⚠️ Final Warning

**NEVER commit:**
- 🚫 .wwebjs_auth/ (WhatsApp session)
- 🚫 .env (Environment variables)
- 🚫 Actual customer data
- 🚫 API keys or passwords
- 🚫 Private keys

**Accidents happen!** If you commit sensitive data:
1. Remove immediately with `git rm --cached`
2. Change all exposed credentials
3. Consider using BFG Repo-Cleaner for history
4. Notify security team if needed

---

**Remember:** Once pushed to remote, assume data is compromised!

Stay safe! 🔐
