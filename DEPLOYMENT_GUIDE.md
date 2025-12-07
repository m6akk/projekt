# 🚀 DIJABETO CHATBOT - VODIČ ZA OBJAVU NA INTERNET

## 📋 PREDUVJETI

### Što trebate:
1. **Git račun** - GitHub, GitLab ili Bitbucket (besplatno)
2. **Hosting račun** - Vercel, Netlify ili GitHub Pages (preporučujem Vercel - najjednostavnije)
3. **Node.js** - verzija 18+ (već trebate imati)
4. **npm/bun** - za upravljanje paketima

---

## ✅ KORAK 1: PROVJERA PROJEKTA PRIJE OBJAVLJIVANJA

### 1.1 Provjerite build proces lokalno

Prvo testirajte je li projekt spreman za produkciju:

```bash
# Očistite node_modules i cache
rm -r node_modules
rm package-lock.json (ili bun.lockb)

# Instalirajte ponovo
npm install
# ili
bun install

# Pokrenite dev build
npm run build
# ili
bun run build

# Testirajte produkcijsku verziju
npm run preview
# ili
bun run preview
```

**Što trebate vidjeti:**
- ✅ Nema grešaka tijekom build-a
- ✅ `dist/` folder je kreiran s HTML, CSS, JS datotekama
- ✅ Stranica se otvara na `http://localhost:4173` i radi ispravno
- ✅ Chatbot je dostupan
- ✅ Recepti se učitavaju
- ✅ Sve je responzivno na mobilnim uređajima

### 1.2 Provjerite environment varijable

**Datoteka: `.env` (ako postoji)**

Za ovaj projekt trebate:
```
# Ako trebate backend API (sada nije potrebno - sve je lokalno)
VITE_API_URL=https://your-api.com  # (opciono)
```

**Datoteka: `vite.config.ts`** - Provjerite je li ispravno konfiguriran:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // Osnovna URL putanja - obično '/'
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Postavite na false za produkciju (brže)
  },
})
```

---

## 🌐 KORAK 2: ODABIR HOSTING PLATFORME

### Preporuke (od najbolje):

#### **A) VERCEL** (Preporučujem! ⭐⭐⭐⭐⭐)
- Besplatan za male projekte
- Automatski deployment iz GitHub-a
- SSL/HTTPS uključeno
- Serverless funkcije (ako trebate)
- CDN za brže učitavanje
- Dio je Next.js ekosustava (kompatibilno s Vite)

#### **B) NETLIFY** (Dobar izbor ⭐⭐⭐⭐)
- Besplatan za male projekte
- Jednostavno korisničko sučelje
- Automatic deployments
- SSL/HTTPS uključeno
- Form handling (ako trebate)

#### **C) GitHub Pages** (Besplatan, ali kompleksniji ⭐⭐⭐)
- Potpuno besplatan
- Direktno s GitHub repozitorija
- SSL/HTTPS uključeno
- Trebate `gh-pages` paket
- Manje opcije za custom domenu

**ZA OVAJ PROJEKT: Koristim VERCEL jer je najjednostavnije**

---

## 🚀 KORAK 3: DEPLOYMENT S VERCEL (Preporučeni)

### 3.1 Priprema GitHub repozitorija

```bash
# 1. Inicijalizujte git (ako još nije)
git init

# 2. Dodajte sve datoteke
git add .

# 3. Kreirajte prvi commit
git commit -m "Initial commit - Dijabeto chatbot"

# 4. Kreirajte GitHub repozitorij
# - Idite na https://github.com/new
# - Kreirajte novi repozitorij: dijabetova-kuharica
# - NE inicijalizujte sa README.md (imate već)

# 5. Povežite lokalni repo s GitHub-om
git remote add origin https://github.com/VASE_KORISNICKO_IME/dijabetova-kuharica.git
git branch -M main
git push -u origin main
```

### 3.2 Kreiranja Vercel računa

1. Idite na https://vercel.com
2. Kliknite "Sign Up" → odaberite "Continue with GitHub"
3. Autorizujte Vercel pristup vašem GitHub računu
4. Vercel će vas prebaciti na dashboard

### 3.3 Import projekta na Vercel

1. Na Vercel dashboard, kliknite "Add New..." → "Project"
2. Odaberite repozitorij `dijabetova-kuharica`
3. Vercel će automatski detektovati Vite projekt
4. Postavke koje trebate provjeriti:

```
Framework: Vite
Build Command: npm run build (ili bun run build)
Output Directory: dist
Environment Variables: (ostavite prazno osim ako trebate API)
```

5. Kliknite "Deploy"

**Čekajte ~2-3 minute da se projekt deploy-a**

### 3.4 Provjera Deployment-a

Nakon što je gotov:
- ✅ Dobit ćete URL: `https://dijabetova-kuharica.vercel.app`
- ✅ Kliknite na link i testirajte
- ✅ Chatbot bi trebao raditi ispravno

---

## 🎯 KORAK 4: CUSTOM DOMENA (Opciono)

### Ako trebate custom domenu (npr. dijabetova-kuharica.com)

#### 4.1 Kupite domenu
- GoDaddy (https://www.godaddy.com)
- Namecheap (https://www.namecheap.com)
- Hosting.hr (https://www.hosting.hr) - lokalni pružatelj

**Cijena:** 1-10 € godišnje ovisno o ekstenziji

#### 4.2 Povežite domenu s Vercel-om

1. Na Vercel project settings → "Domains"
2. Kliknite "Add Domain"
3. Unesite vašu domenu (npr. dijabetova-kuharica.com)
4. Vercel će dati DNS upute
5. U postavkama domene (GoDaddy/Namecheap), dodajte Vercel DNS:
   ```
   Nameservers:
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
6. Pričekajte 24-48 sati da se DNS propagira

---

## 🔐 KORAK 5: SIGURNOST I OPTIMIZACIJA

### 5.1 SSL/HTTPS
- ✅ Vercel automatski koristi SSL
- ✅ Svi zahtjevi se preusmjeravaju na HTTPS
- ✅ Nije potrebna dodatna konfiguracija

### 5.2 Performanse

**Provjerite na:** https://pagespeed.web.dev/

1. Unesite URL vašeg web sjedišta
2. Trebalo bi vidjeti score >90 za mobile i desktop

**Ako je loše:**
- Optimizirajte slike (Optimize Images)
- Smanjite CSS/JS (već Vite radi automatski)
- Koristite CDN (Vercel koristi CDN)

### 5.3 Analytics

Vercel automatski prati:
- Broj posjeta
- Geografija korisnika
- Performance metrike
- Greške

Dashboard → Analytics tab

---

## 🧪 KORAK 6: TESTIRANJE PRIJE I NAKON OBJAVLJIVANJA

### Pre-deployment checklist:

```
☐ npm run build - Nema grešaka?
☐ npm run preview - Sve radi lokalno?
☐ Responsivnost - Testirajte na mobitelu (F12 → Device Toggle)
☐ Chatbot - Sve 24 intenta radi?
☐ localStorage - Sav chat se čuva?
☐ Animacije - Dijabeto se kotlja?
☐ Links - Sve navigacijske veze rade?
☐ Recepti - Svi se učitavaju?
☐ Slike - Sve se vide?
☐ Performance - Strnica se brzo učitava?
```

### Post-deployment (nakon što je na internetu):

1. **Testirajte u различitим preglednicima:**
   - Chrome / Edge
   - Firefox
   - Safari (ako imate Mac)
   - Mobilni preglednici (Android, iOS)

2. **Testirajte sve intente:**
   ```
   - "Bok" (pozdrava)
   - "Trebam proteina" (high_protein)
   - "S čokoladom" (ingredient)
   - "Trebam brzo" (quick)
   - "Najbolji" (best_rated)
   - itd.
   ```

3. **Provjerite mobilnu verziju:**
   - Je li chat responsive?
   - Je li touch friendly?
   - Je li vidljivo sve na malim ekranima?

4. **Network throttling:**
   - Chrome DevTools → Network → Throttle na "Slow 3G"
   - Strnica bi trebala biti korisna čak i na sporom internetu

---

## 📊 KORAK 7: MONITORING I ODRŽAVANJE

### Continuous Monitoring:

1. **Vercel Dashboard:**
   - Provjerite deployment history
   - Provjerite da li je zadnja verzija u produkciji
   - Monitorujte upozorenja/greške

2. **Google Search Console (opciono):**
   - Registrirajte web sjedište
   - Provjerite je li indeksirana
   - Provjerite Search Performance

3. **Email notifikacije:**
   - Vercel će vas obavijestiti ako nešto krene po zlu

---

## 🔄 KORAK 8: AUTOMATSKE AŽURIRANJA

### Postavljanje automatskih deployments:

**Vercel + GitHub = Automatski deploy pri svakom push-u!**

1. Svaki put kada napravite `git push` na `main` granu
2. GitHub će obavijestiti Vercel
3. Vercel će automatski:
   - Pokrenuti build
   - Testirati projekt
   - Deploy-ati novu verziju
4. Trebalo bi biti gotovo za ~1-2 minute

**Primjer workflow-a:**

```bash
# 1. Napravite promjenu na lokalnom projektu
# 2. Commit promjene
git add .
git commit -m "Fix chatbot scroll"

# 3. Push na GitHub
git push origin main

# 4. Automatski! Vercel počinje deploy...
# 5. Provjerite status na https://vercel.com/dashboard
```

---

## 🐛 TROUBLESHOOTING

### Problem: Build greške

```bash
# Rješenje 1: Očistite cache
rm -r node_modules
rm package-lock.json
npm install

# Rješenje 2: Provjerite TypeScript greške
npm run lint

# Rješenje 3: Provjerite vite.config.ts
```

### Problem: Komponente se ne učitavaju

```
Mogući uzroci:
1. Import path greške
2. Nedostaju UI komponente
3. Asset path greške

Rješenje:
- Provjerite browser console za greške (F12)
- Provjerite Network tab
- Provjerite index.html → da li ima <div id="root"></div>
```

### Problem: Responsive stranica nije dobra

```
Testirajte s Chrome DevTools:
F12 → Toggle device toolbar (Ctrl+Shift+M)
Testirajte iPhone, iPad, Android rezolucije

Tipični problemi:
- Tailwind breakpoints (sm:, md:, lg:)
- Fixed pozicioniranje (bottom-6 right-6)
- Font veličine
```

### Problem: localStorage ne radi

```
Razlog:
- Private/Incognito mode
- Blokiran localStorage u postavkama
- Različiti origin (http vs https)

Rješenje:
- Koristim try/catch blokove (već u kodu)
- Vercel koristi HTTPS → trebalo bi raditi
```

---

## 📈 SLJEDEĆI KORACI NAKON OBJAVLJIVANJA

1. **Analytics:**
   - Postavite Google Analytics
   - Pratite broj posjeta
   - Analizirajte koje intente korisnici najčešće koriste

2. **Feedback:**
   - Dodajte contact formu ili email
   - Skupljajte povratne informacije
   - Kontinuirano poboljšavajte

3. **SEO Optimizacija (opciono):**
   - Dodajte meta tagove
   - Optimizirajte nazive receptata za pretragu
   - Dodajte sitemap.xml

4. **Marketing:**
   - Podijelite na društvenim mrežama
   - Napravite jednostavnu landing page
   - Prikupljajte email-e za newsletter

---

## 🎉 ZAKLJUČAK

**Sažetak koraka:**
1. ✅ Testirajte lokalno (`npm run build` + `npm run preview`)
2. ✅ Push na GitHub
3. ✅ Kreirajte Vercel račun
4. ✅ Povežite GitHub repozitorij
5. ✅ Kliknite "Deploy"
6. ✅ Testirajte javnu verziju
7. ✅ (Opciono) Povežite custom domenu
8. ✅ Postavite monitoring

**Očekivano vrijeme:** 15-30 minuta za prvi put

**Rezultat:** Profesionalno web sjedište dostupno cijelom svijetu 24/7 s:
- ✅ Automatskim deployments
- ✅ SSL/HTTPS sigurošću
- ✅ CDN brzinom
- ✅ Monitoring-om
- ✅ Analytics-om
- ✅ Besplatno ili super jeftino!

---

## 📞 SUPPORT

**Ako trebate pomoć:**
- Vercel Help: https://vercel.com/help
- React Documentation: https://react.dev
- Vite Documentation: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
