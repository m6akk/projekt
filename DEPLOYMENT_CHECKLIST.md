# ✅ PRE-DEPLOYMENT TEST CHECKLIST

## LOKALNI TESTOVI (PRIJE GITHUB/VERCEL)

### Build & Preview
- [ ] `npm run build` - bez grešaka
- [ ] `dist/` folder je kreiran
- [ ] `npm run preview` - pokrećemo server
- [ ] http://localhost:4173 se učitava

### Funkcionalnost
- [ ] Dijabeto ikona se pojavljuje u donjem desnom uglu
- [ ] Klik na Dijabeto otvara chat prozor
- [ ] Klik na X zatvara chat
- [ ] Dijabeto se kotlja kada se prozor otvori
- [ ] Chat razgovori se prikazuju ispravno

### Chatbot Intenti (testirajte ove poruke)

#### Pozdrave
- [ ] "Bok" → odgovara sa pozdravom
- [ ] "Hej" → odgovara sa pozdravom
- [ ] "Dobar dan" → odgovara sa pozdravom

#### Sastojci
- [ ] "S čokoladom" → preporučuje recepte s čokoladom
- [ ] "S kavom" → preporučuje recepte s kavom
- [ ] "S paparom" → preporučuje recepte s paparom

#### Makro-nutrienti
- [ ] "Trebam više proteina" → sortira po proteinima
- [ ] "Trebam manje kalorija" → sortira po kalorijama
- [ ] "Trebam više masti" → sortira po mastima
- [ ] "Trebam više ugljikohidrata" → sortira po ugljikohidratima

#### Brzina
- [ ] "Trebam brzo" → preporučuje brze recepte
- [ ] "Ne trebam dugo čekati" → preporučuje brze recepte

#### Popularnost
- [ ] "Preporučite najbolje" → sortira po ocjeni
- [ ] "Koje su najpoznatije?" → sortira po komentarima
- [ ] "Što je najpopularnije?" → sortira po ocjeni

#### Kategorije
- [ ] "Trebam ribu" → preporučuje samo ribu
- [ ] "Trebam meso" → preporučuje samo meso
- [ ] "Trebam deserje" → preporučuje samo deserje

#### Dijetne opcije
- [ ] "Trebam veganski" → preporučuje vegansko
- [ ] "Trebam vegetarijansko" → preporučuje vegetarijansko
- [ ] "Trebam bez mlijeka" → preporučuje bez mlijeka

#### Pomoć
- [ ] "Kako funkcionira chatbot?" → prikazuje upute
- [ ] "Koje intente mogu koristiti?" → prikazuje listu
- [ ] "Trebam pomoć" → prikazuje upute

### localStorage Test
- [ ] Pošaljite nešto u chatbot (npr. "Bok")
- [ ] Osvježite stranicu (F5 ili Ctrl+R)
- [ ] Vaša poruka bi trebala biti tu (chat history)
- [ ] Recimo i bot odgovore trebaju biti tu
- [ ] Kliknite na nešto u recepta, vratite se → chat je tu

### Responsive Design
1. Otkodjte F12 (DevTools)
2. Kliknite na device icon (Ctrl+Shift+M)
3. Testirajte rezolucije:
   - [ ] iPhone 12 (390x844) - trebalo bi biti OK
   - [ ] iPad (768x1024) - trebalo bi biti OK
   - [ ] Android (412x915) - trebalo bi biti OK
   - [ ] Desktop (1920x1080) - trebalo bi biti OK

### Navigacija
- [ ] "Home" link → vodi na početnu stranicu
- [ ] "Recepti" link → vodi na listu receptata
- [ ] "Galerija" link → vodi na galeriju
- [ ] "O nama" link → vodi na About stranicu
- [ ] "Kontakt" link → vodi na Kontakt stranicu
- [ ] Nazad na početnu s bilo koje stranice

### Recepti
- [ ] Klik na recept otvara detail stranicu
- [ ] Detail stranicu prikazuje sve podatke:
  - [ ] Ime recepte
  - [ ] Kategorije
  - [ ] Slika
  - [ ] Pripremanje
  - [ ] Sastojci
  - [ ] Nutritivne vrijednosti
  - [ ] Vrijeme pripremanja
  - [ ] Ocjena i komentari
- [ ] Natrag link vodi na listu

### Animacije
- [ ] Početna stranica se animira (rolling, smoke)
- [ ] Dijabeto se animira kada otvorite chat
- [ ] Chat poruke se pojavljuju glatko
- [ ] Nema "jumpy" animacija

### Performanse
- [ ] Stranica se brzo učitava (<2 sekunde)
- [ ] Nema lag-a pri klikanju
- [ ] Chat je responsivan (bez kašnjenja)
- [ ] Nema console grešaka (F12 → Console tab)

### Browser Console (F12)
- [ ] Nema crvenih grešaka
- [ ] Nema waringa koja bi mogla biti problematična
- [ ] Nema undefined reference greški

---

## GITHUB TESTOVI (NAKON PUSH)

### Git Setup
- [ ] `git init` - repozitorij inicijaliziran
- [ ] `git add .` - sve datoteke added
- [ ] `git commit` - prvi commit
- [ ] `git remote add origin` - remote je postavljen
- [ ] `git push origin main` - datoteke su na GitHub-u

### GitHub Provjera
- [ ] Idite na https://github.com/VASE_IME/dijabetova-kuharica
- [ ] Svi fileovi su vidljivi (src/, public/, itd.)
- [ ] `package.json` je vidljiv
- [ ] `vite.config.ts` je vidljiv
- [ ] Build proces je vidljiv u `dist/`
- [ ] `DEPLOYMENT_GUIDE.md` je vidljiv
- [ ] README.md je vidljiv

---

## VERCEL DEPLOYMENT TESTOVI

### Vercel Setup
- [ ] Kreirajte Vercel račun (https://vercel.com)
- [ ] GitHub autentifikacija je uspješna
- [ ] Projekt je importan
- [ ] Build settings su automatski detektirani:
  - [ ] Framework: Vite
  - [ ] Build Command: npm run build
  - [ ] Output Directory: dist
- [ ] Deploy je pokrenut
- [ ] Čekajte 2-3 minute...
- [ ] Deploy je gotov (trebalo bi vidjeti "Production" status)

### Javna URL Provjera
- [ ] Vercel vam daje URL (npr. https://dijabetova-kuharica.vercel.app)
- [ ] Kliknite na URL
- [ ] Stranica se učitava
- [ ] Nema "404 Not Found" greške
- [ ] Nema Vercel error page-a

### Funkcionalnost na Javnom Sjedištu
- [ ] Chat funkcionira
- [ ] Intenti funkcioniraju
- [ ] Recepti se učitavaju
- [ ] Sve veze funkcioniraju
- [ ] Slike se vide
- [ ] Animacije rade

### localStorage na Javnom Sjedištu
- [ ] Otvorite chat
- [ ] Pošaljite poruku
- [ ] Osvježite stranicu (F5)
- [ ] Poruka je tu (chat history je sačuvan)

### Različiti Preglednici
- [ ] Chrome - sve radi
- [ ] Firefox - sve radi
- [ ] Edge - sve radi
- [ ] Safari (ako imate Mac) - sve radi

### Mobilni Uređaji
- [ ] Otvorite javni URL na mobitelu (Android)
- [ ] Sve funkcionira
- [ ] Chatbot je dostupan
- [ ] Nije horizontalnog scrollanja
- [ ] Otvorite javni URL na iOS uređaju (ako imate)
- [ ] Sve funkcionira

### Performance
- [ ] Stranica se brzo učitava (~1-2 sekunde)
- [ ] Nema dugo čekanja
- [ ] Ani keširanje ne uspori stranicu

### Network Throttling Test
1. F12 → Network tab
2. Throttle na "Slow 3G"
3. Osvježite stranicu
4. [ ] Stranica se učitava (čak i na sporom internetu)
5. [ ] Chatbot je dostupan
6. [ ] Chat je responsivan

---

## PROBLEMI KOJE TREBATE PROVJERITI

### Ako stranica ne radi:
- [ ] Provjerite build log na Vercel
- [ ] Provjerite F12 Console za greške
- [ ] Provjerite Network tab za 404 greške
- [ ] Provjerite `dist/` folder lokalno

### Ako chat ne radi:
- [ ] Provjerite je li DiabetoChatbot komponenta importana
- [ ] Provjerite je li localStorage dostupan
- [ ] Provjerite F12 Console za greške
- [ ] Provjerite nije li u private/incognito modusu

### Ako recepti se ne učitavaju:
- [ ] Provjerite `src/data/recipes.ts`
- [ ] Provjerite da su importirani u komponentu
- [ ] Provjerite F12 Console za greške
- [ ] Provjerite da su datoteke dostupne

### Ako se slike ne vide:
- [ ] Provjerite da su u `/public` folderu
- [ ] Provjerite path-eve u HTML
- [ ] Provjerite Network tab da vidite 404 greške
- [ ] Provjerite je li `/public/robots.txt` dostupan

---

## ZAKLJUČAK

Ako su SVI BOXOVI čekirani ✓, projekt je spreman za produkciju!

**Čestitam! Vaša stranica je live! 🚀**

---

## DODATNI RESURSI

- **Vercel Help:** https://vercel.com/help
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Tailwind CSS:** https://tailwindcss.com
