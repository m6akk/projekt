# ⚡ BRZA OBJAVA - 5 MINUTA DO INTERNETA

## TL;DR - Ako trebate samo objavu, bez priče:

### 1️⃣ Build projekt
```bash
npm install
npm run build
npm run preview  # Testirajte - trebalo bi raditi
```

### 2️⃣ Push na GitHub
```bash
git init
git add .
git commit -m "Initial"
git remote add origin https://github.com/VASE_IME/dijabetova-kuharica.git
git branch -M main
git push -u origin main
```

### 3️⃣ Kreirajte Vercel račun
- Idite na https://vercel.com
- "Sign Up" → "Continue with GitHub"
- Autorizujte

### 4️⃣ Deploy s Vercel
- Dashboard → "Add New Project"
- Odaberite `dijabetova-kuharica` repozitorij
- "Deploy"
- Gotovo! 🎉

**Vaša URL:** `https://dijabetova-kuharica.vercel.app`

---

## ⚙️ Ako što ide krivo:

### Build greška?
```bash
npm run lint  # Provjerite tipske greške
rm -r node_modules && npm install  # Očistite
npm run build  # Pokušajte ponovno
```

### Komponente se ne učitavaju?
- Otvorite F12 (DevTools)
- Pogledajte "Console" tab
- Trebalo bi vidjeti greške

### Responsivnost je loša?
- Koristim Tailwind CSS - trebalo bi biti OK
- Testirajte: F12 → Device Toggle (Ctrl+Shift+M)

---

## 🎯 Što je uključeno u projektu:

✅ 12 receptata  
✅ 24 chatbot intenta  
✅ Dinamičko prepoznavanje sastojaka  
✅ Filtriranje po makro-nutrientima  
✅ Verzija s chat historijom (localStorage)  
✅ Animacije (rolling, bouncing, particles)  
✅ Mobile responsive  
✅ SEO gotovo  
✅ Performance gotovo  

---

## 🚀 Brzina:

- Početno učitavanje: ~1-2 sekunde (Vercel CDN)
- Interakcije: Trenutne (sve u pregledniku)
- Chat: Instant (nema API-ja)

---

## 🔐 Sigurnost:

- SSL/HTTPS: Vercel brinete
- Podatci: Samo u vašem pregledniku (localStorage)
- Nema external API-ja
- Nema broja kartice/osjetljivih podataka

---

## 📱 Mobile:

- Testirajte: Tablet, Smartphone
- Trebalo bi biti potpuno responsive
- Touch friendly

---

## ❓ FAQ

**Q: Trebam li server?**  
A: Ne. Sve je u pregledniku. Vercel je CDN.

**Q: Mogu li malo promijeniti kod?**  
A: Da. Svaki `git push` se automatski deploy-a.

**Q: Koliko koštanja?**  
A: Besplatan za <100GB mjesečno. Za vas besplatno zauvijek.

**Q: Mogu li custom domenu?**  
A: Da. Vercel će vas pokazati kako. ~1€/god za domenu.

**Q: Gdje se čuvaju podaci?**  
A: U vašem pregledniku (localStorage). Nema baze podataka.

**Q: Je li javno dostupno?**  
A: Da. Javna URL. Svi mogu vidjeti.

**Q: Mogu li dodati login?**  
A: Trebali biste backend (Firebase, Supabase). Nije uključeno.

---

## 📊 Monitoring nakon objavljivanja:

1. Vercel Dashboard - provjerite statusne
2. Performance - trebalo bi >90 na PageSpeed
3. Mobilna verzija - trebala bi raditi savršeno

---

## 🎉 To je to!

Vaše web sjedište je live! 🚀

Podijelite link:
```
https://dijabetova-kuharica.vercel.app
```

Ili s custom domenom nakon što povežete.
