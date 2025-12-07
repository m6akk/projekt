# 🗺️ MAPA DEPLOYMENTS PROCESA

## KORAK ZA KORAKOM

```
┌─────────────────────────────────────────────────────────┐
│         1. LOKALNA PROVJERA (2-3 min)                   │
│                                                         │
│  ✓ npm run build → dist/ folder kreiran                │
│  ✓ npm run preview → http://localhost:4173             │
│  ✓ Testirajte chatbot i recepte                        │
│  ✓ Provjerite localStorage (osvježite stranicu)        │
│  ✓ Provjerite mobilnu verziju (F12)                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         2. GITHUB REPOZITORIJ (3-5 min)                 │
│                                                         │
│  ✓ Kreirajte GitHub račun (https://github.com)         │
│  ✓ git init → git add . → git commit                   │
│  ✓ git push na https://github.com/VAS_IME/repo         │
│  ✓ Provjerite da su sve datoteke na GitHub-u           │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         3. VERCEL DEPLOYMENT (5-7 min)                  │
│                                                         │
│  ✓ Kreirajte Vercel račun (https://vercel.com)         │
│  ✓ "Sign Up" → "Continue with GitHub"                  │
│  ✓ "Add New Project" → Odaberite repo                  │
│  ✓ Framework: Vite (automatski detektovano)            │
│  ✓ Kliknite "Deploy"                                   │
│  ✓ Čekajte 2-3 minute                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         4. JAVNA TESTIRANJA (5-10 min)                  │
│                                                         │
│  ✓ Kliknite na Vercel URL:                             │
│    https://dijabetova-kuharica.vercel.app              │
│  ✓ Testirajte sve funkcionalnosti                      │
│  ✓ Testirajte na mobilnom (Android + iOS)             │
│  ✓ Testirajte u različitim preglednicima              │
│  ✓ Provjerite localStorage (persistent chat)           │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         5. OPCIONO: CUSTOM DOMENA (5-10 min)            │
│                                                         │
│  ✓ Kupite domenu (GoDaddy, Namecheap, Hosting.hr)     │
│  ✓ U Vercel: Domains → Add Domain                      │
│  ✓ Povežite DNS                                        │
│  ✓ Čekajte 24-48 sati da se DNS propagira             │
│                                                         │
└─────────────────────────────────────────────────────────┘

UKUPNO VRIJEME: 20-35 minuta
```

---

## KOMANDE KOJE TREBATE

### Lokalni Build:
```bash
cd c:\dijabetova-kuharica\dijabetova-kuharica-main
npm install          # Instalirajte pakete
npm run build        # Buildajte projekt
npm run preview      # Testirajte lokalno
```

### Git Setup:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VASE_IME/dijabetova-kuharica.git
git branch -M main
git push -u origin main
```

### Vercel (Web):
1. https://vercel.com
2. Sign Up → GitHub
3. Add Project → Select Repo
4. Deploy ✓

---

## ŠTO STE DOBILI

### Datoteke:
- ✅ `DEPLOYMENT_GUIDE.md` - Detaljan vodič (270 redaka)
- ✅ `QUICK_DEPLOY.md` - Brz pregled (80 redaka)
- ✅ `DEPLOYMENT_STATUS.md` - Trenutni status
- ✅ `vercel.json` - Vercel konfiguracija
- ✅ `.vercelignore` - Datoteke za ignoriranje
- ✅ `netlify.toml` - Netlify alternativa
- ✅ `public/sitemap.xml` - SEO sitemap
- ✅ `vite.config.ts` - Optimizovana build konfiguracija

### Build:
- ✅ `dist/` folder s produkcijskim datotekama
- ✅ Veličina: 165 KB (gzip) - BRZO!
- ✅ 4 JS bundlea za optimalni performance

### SEO:
- ✅ Meta tagovi u `index.html`
- ✅ Open Graph tagovi
- ✅ Twitter Card tagovi
- ✅ Sitemap.xml s 17 URL-a
- ✅ Robots.txt za search engine crawlers

### Security:
- ✅ HTTPS/SSL (Vercel se brinete)
- ✅ Security headers (X-Content-Type-Options, X-Frame-Options, itd.)
- ✅ Cache strategija
- ✅ Nema hardkodirani API tokeni ili tajne

---

## PROBLEMI I RJEŠENJA

### "Build not found"
```
Možda trebate npm install
npx npm install
```

### "localhost:4173 ne radi"
```
Možda nije pokrenut preview server
npm run preview
```

### "Chatbot ne radi na javnom sjedištu"
```
Provjerite F12 → Console za greške
Vercel automatski deploy-a build/ folder
Trebalo bi raditi kao na localhost
```

### "Slike se ne vide"
```
Provjerite /public folder
Vercel trebao bi servirati static datoteke
```

---

## NAKON OBJAVE

### Monitoriranje:
1. Vercel Dashboard → Analytics
2. Google Search Console
3. Google Analytics
4. Performance monitoring

### Automatski deployments:
- Svaki `git push` se automatski deploy-a
- Nema dodatnih koraka trebano!

### Ažuriranje:
```bash
# Lokalno
git add .
git commit -m "Update message"
git push origin main

# Automatski na Vercel! 🚀
```

---

## VAŽNE VEZE

- **GitHub:** https://github.com/signup
- **Vercel:** https://vercel.com
- **Netlify:** https://netlify.com (alternativa)
- **GoDaddy:** https://www.godaddy.com (domena)
- **Namecheap:** https://www.namecheap.com (domena)

---

## ŠTO DALJE?

1. ✅ Slijedi QUICK_DEPLOY.md ili DEPLOYMENT_GUIDE.md
2. ✅ Inicijalizuj Git
3. ✅ Push na GitHub
4. ✅ Deploy s Vercel
5. ✅ Testiraj javnu verziju
6. ✅ Podijelite link

**Gotovo! 🎉**
