# DIJABETO - Kulinarski AI Chatbot
## Detaljne Dokumentacije Funkcionalnosti

---

## 1. KOJU VRSTU CHATBOTA STE ODABRALI?

**Tip: Regel-bazirani AI Chatbot s Dinamičkim Prepoznavanjem Sastojaka (Hybrid Intent-Driven Bot)**

Odabrali smo **rule-based chatbot** s elementima NLP-a umjesto pure ML modela jer:

### Prednosti ovog pristupa:
- **Kontrolabilnost**: Svaki odgovor je determinstički i predvidljiv
- **Transparentnost**: Lako se vidi zašto je bot dao određeni odgovor
- **Fleksibilnost**: Jednostavno se mogu dodavati novi intentovi bez retrainiranja
- **Performanse**: Brzo radi lokalno bez potrebe za vanjskim API-jima
- **Tolerancija na varijacije**: Koristi regex i normalizaciju za različite oblike istih rijeci

### Arhitektura:
```
Korisnikov unos → Normalizacija → Intent Detection → Matching → Response Generation → Recepti
```

---

## 2. KAKO STE PRILAGODILI STRUKTURU KONVERZACIJE?

### A) Inicijalni Dialog
- Bot se predstavlja samo jednom (sessionStorage za "hasRolledIn")
- Animirana reprezentacija (Dijabeto se kotlja po ekranu)
- Inicijalna pozdrava s primjerima kako koristiti

### B) Tok Konverzacije

**1. Recepcija korisničkog unosa**
```typescript
- Sprema se u Message[]
- Fokus ostaje na input polju
- Automatski scroll na novi upit
```

**2. Obrada unosa (u redu prioriteta)**
- Provjera regex pattern-a za 24 različita intentona
- Ako pattern ne pasuje → dinamička provjera tokena iz recepta
- Ako nema uparen intent → "unknown" fallback sa savjetima

**3. Generiranje odgovora**
- Tekst odgovora prilagođen intentionu
- Filtriranje recepata prema kriterijima
- Sortiranje po relevantnosti
- Maksimalno 3 recepta po odgovoru

**4. Prikaz rezultata**
- Tekst odgovora s emoji-jima
- Kartice recepta s informacijama (vrijeme, ocjena, tagi)
- Klikabilne kartice koje vode na detaljnu stranicu

---

## 3. KOJE STE NAMJERE (INTENTS) DODALI I KAKO POBOLJŠAVAJU ISKUSTVO?

### Ukupno: 24 Intentona

#### **A) POZDRAVE (1)**
- **greeting** - Aktivira se na: "bok", "hej", "zdravo", "pozdrav", "hi", "hello", "cao", "ćao"
- ✅ Čini bot-a prijateljskim i interaktivnim

#### **B) KATEGORIJE JELA (6)**
1. **category_dessert** - "desert", "kolač", "slatko", "brownie", "cheesecake"
   - Vraća 5 deserata sortirano po ocjeni
2. **category_pasta** - "pasta", "tjestenina", "špageti", "carbonara", "pesto"
   - Vraća recepte s tjesteninom
3. **category_meat** - "meso", "piletina", "govedina", "gulaš", "panceta"
   - Specifičan matching za različito meso (piletina, govedina, panceta)
4. **category_fish** - "riba", "losos", "morski"
   - Riblji recepti
5. **category_salad** - "salata", "salatni", "svježe", "zeleno"
   - Lagane i osvježavajuće opcije
6. **category_risotto** - "rižot", "riža", "gljive"
   - Napredna detekcija s normalizacijom za sve oblike

#### **C) PREHRAMBENE PREFERENCIJE (5)**
1. **vegan** - "vegan", "vegansko", "biljne", "trava"
   - Filtrira samo veganske recepte
2. **gluten_free** - "bez glutena", "gluten-free", "bezglutenski"
   - Sigurno za celiake
3. **vegetarian** - "vegetarijansko", "bez mesa"
   - Vegetarijanske opcije (uključuje vegan)
4. **quick** - "brzo", "jednostavno", "kratko vrijeme"
   - Sortira po ukupnom vremenu (priprema + kuhanja)
   - MAX 30 minuta

#### **D) MAKRO-NUTRIENTI (6)**
1. **low_calorie** - "malo kalorija", "dijeta", "zdravo"
   - Sortira od najmanje prema najvećoj
2. **high_calorie** - "puno kalorija", "mnogo kalorija", "energetski"
   - Za one koji trebaju energiju (sportaši, teški fizički rad)
3. **high_protein** - "protein", "masa", "teretana", "gym", "fitnes"
   - Za razvoj mišića i oporavak
4. **low_protein** - "malo proteina", "nisko protein"
   - Za specifične dijete
5. **high_carbs** - "puno ugljikohidrata", "energija"
   - Za izdržljivost i snagu
6. **low_carbs** - "malo ugljikohidrata", "bez ugljikohidrata"
   - Za niskougljikohidratne dijete (keto itd.)
7. **high_fat** - "puno masti", "bogato masti", "masno"
   - Zdrave masti za mozak
8. **low_fat** - "malo masti", "odmastiti"
   - Za one sa ograničenjima na mast

#### **E) RANKING I FILTRIRANJE (3)**
1. **newest** - "najnoviji", "nov", "recent"
   - Sortira po datumu objave (najnoviji prvi)
2. **best_rated** - "najbolji", "top", "popularan"
   - Sortira po prosječnoj ocjeni
3. **all_recipes** - "svi recepti", "popis", "lista"
   - Prikazuje 4 random recepta

#### **F) SASTOJCI - DINAMIČKI (1)**
**ingredient** - Sve sorte:
- Preposicijski oblik: "s/sa kava", "s/sa čokoladom", "s/sa paprom"
- Direktni oblik: "kava", "čokolada", "papar"
- Sa varijacijama: "kavom", "cokolada", "temeljac", "temeljcom"

**Kako radi:**
- Izvlači sve tokene iz recepata (minimum 3 karaktera)
- Generira "stemove" (varijacije):
  - Uklanja završne samoglasnike (kava → kav)
  - Dodaje različite završetke (kavom, kavu, kafe)
  - Svapa "ca" ↔ "ac" (temeljca ↔ temeljac)
- Bivoktralno srovnjava korisnikov unos i tokene iz recepata

#### **G) POMOĆ I KOMENTARI (4)**
1. **help** - "pomoć", "kako", "što možeš", "funkcije"
   - Prikazuje sve što bot može raditi
2. **rate** - "ocijeni", "zvjezdice"
   - Objašnjava kako ocijeniti recepte
3. **comment** - "komentar", "komentiraj"
   - Objašnjava kako dodati komentare
4. **gallery** - "galerija", "slike", "foto"
   - Preusmjerava na stranicu galerije

---

## 4. KAKO STE OBUČILI BOTA ZA PREPOZNAVANJE RAZLIČITIH KORISNIČKIH PITANJA?

### A) Tokenizacija i Normalizacija

**Korak 1: Uklanjanje Dijakritika**
```typescript
normalizeText = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
```
- "čokolada" → "cokolada"
- "Tiramisu" → "tiramisu"
- Osjetljivo na velika/mala slova

**Korak 2: Ekstrakcija Tokena**
```
"200g arborio riže" → ["arborio", "rize"]  (min 3 karaktera)
```

**Korak 3: Generiranje Stemova (Varijacije)**

Za svaki token generiramo sve moguće oblike:
```
Token: "kave"
Stemovi: ["kave", "kav", "kava", "kava", "kavi", "kavo", "kavu", "kavom", "kaveu"]

Token: "temeljca"
Stemovi: ["temeljca", "temelj", "temelj", "temeljcu", "temeljca", "temeljac", ...]
```

**Korak 4: Bidirekcijanalno Sravnjavanje**

Kada korisnik kaže "kavom":
1. Ekstrahujemo "kavom"
2. Normaliziramo na "kavom"
3. Generiramo stemove: ["kavom", "kav", "kava", ...]
4. Iz recepta "200ml kave" ekstrahujemo "kave"
5. Generiramo stemove: ["kave", "kav", "kava", ...]
6. Provjeravamo da li se bilo koji stemovi podudaraju → ✅ DA ("kava" se pojavljuje u oba)

### B) Intent Detection Proces

```
Korisnik: "Hocu nesto s kavom"
         ↓
Normalizacija: "hocu nesto s kavom"
         ↓
Redoslijed provjere (specifičan → generički):
1. ✓ Pasuje "/sa |s /..." → ingredient intent
2. (ostali se preskaču jer je već pronađen)
         ↓
Vraća: 'ingredient'
```

### C) Prioritet Intenta (Redoslijed Provjere)

**Zašto je redoslijed bitan:**
```typescript
// Prvo specifični (duži, konkretniji pattern-i):
if (low_protein) return 'low_protein'   // "malo proteina"
if (high_protein) return 'high_protein' // "protein" (širi pattern)

// Ako ide obrnuto, "malo proteina" bi se poklapao s "protein"
// pa bi vratio 'high_protein' umjesto 'low_protein' ❌
```

---

## 5. ŠTO STE NAUČILI O OPTIMIZACIJI ODGOVORA?

### A) Greške Koje Smo Ispravili

**Greška #1: Direktno Sravnjavanje**
```typescript
// ❌ LOŠE
if (recipe.sastojci.includes("kava")) // Ne pronalazi "kave"

// ✅ DOBRO
stemsFor("kave").includes(stemsFor("kava")) // Pronalazi sve oblike
```

**Greška #2: Redoslijed Provjere**
```typescript
// ❌ LOŠE
if (intents.high_protein.test("malo proteina")) // GREŠNO! Pasuje jer sadrži "protein"
if (intents.low_protein.test(...)) // Nikad se ne dostiže

// ✅ DOBRO - Specifičan PRIJE generičkog
if (intents.low_protein.test("malo proteina")) // ✓
if (intents.high_protein.test(...))
```

**Greška #3: Dijakritici**
```typescript
// ❌ LOŠE
if (unos.includes("cokolada")) // Ne pronalazi "čokolada"

// ✅ DOBRO
if (normalizeText(unos).includes(normalizeText("čokolada")))
```

### B) Optimizacije za UX

**1. Inteligentne Poruke**
- Posebna poruka za čokoladu: "Pronašao sam nešto čokoladno za tebe:"
- Ostali sastojci: "Evo recepata koji sadrže \"papar\":"
- Prilagođeno intentionu

**2. Limitiranje Rezultata**
- Max 3 recepta po odgovoru (osim deserata: 5, salata: 3)
- Sprječava preplavljenost informacijama

**3. Sortiranje**
- Po ocjeni (best_rated)
- Po vremenu (low_calorie najmanje kalorija prvi)
- Po datumu (newest)

**4. Auto-Scroll**
- Odmah prikazuje novi odgovor na vrhu
- Korisnik ne mora ručno scrollati

**5. Loading State**
- Animirane točkice tijekom obrade
- Simulira "razmišljanje" bota

### C) Optimizacije za Performanse

**1. SessionStorage Cache**
```typescript
// Sprječava ponovno animiranje na svakom osvježavanju
sessionStorage.setItem('hasRolledIn', 'true')
```

**2. Deduplikacija Tokena**
```typescript
tokenSet = new Set() // Sprječava duplikate
```

**3. Minimalna Rekalkulacija**
```typescript
// Stemovi se generiraju samo kada trebaju
// Ne generira se za svaki token svaki put
```

---

## 6. PRIMJERI PITANJA I ODGOVORA

### Primjer 1: Pozdrava
**Korisnik:** "Bok!"  
**Bot:** "Bok! 😊 Drago mi je da si tu! Kako ti mogu pomoći danas?..."

**Koji intent:** greeting

---

### Primjer 2: Kategorija - Deserta
**Korisnik:** "Daj mi nešto slatko"  
**Bot:** "Mmm, deserti! 🍰 Evo slatkih preporuka:"  
**Rezultati:** Čokoladni kolač, Brownies, Palačinke, Tiramisu, Cheesecake

**Koji intent:** category_dessert

---

### Primjer 3: Sastojak s Varijacijom
**Korisnik 1:** "kava"  
**Korisnik 2:** "kavom"  
**Korisnik 3:** "s kavom"  
**Bot (za sve tri):** "Pronašao sam nešto čokoladno za tebe:"  
**Rezultat:** Tiramisu (200ml kave)

**Koji intent:** ingredient (dynamic detection za "kave" token)

---

### Primjer 4: Makro-Nutrienti
**Korisnik:** "trebam puno proteina za teretanu"  
**Bot:** "Evo recepata bogatih proteinima:"  
**Rezultati:** Sortira po proteinima (silazno)
1. Pečena piletina (45g)
2. Pasta Carbonara (20g)
3. Losos (30g)

**Koji intent:** high_protein

---

### Primjer 5: Dijakritici i Varijacije
**Korisnik 1:** "cokolada"  
**Korisnik 2:** "čokolada"  
**Korisnik 3:** "čokoladno"  
**Bot (za sve):** "Pronašao sam nešto čokoladno za tebe:"  
**Rezultat:** Čokoladni kolač, Brownies

**Kako radi:** 
- Normalizira sve na "cokolada"
- Ekstrahira tokenom iz recepta "čokolade"
- Generira stemove za oba → poklapanje

---

### Primjer 6: Kombinacija Preferencija
**Korisnik:** "nema mi vremena, trebam brzo nešto veganske"  
**Bot:** (Detektuje: quick intent jer je prvi)  
**Rezultat:** Sortira po vremenu (brži recepti prvi)

---

### Primjer 7: Help
**Korisnik:** "Što možeš raditi?"  
**Bot:** Prikazuje sve mogućnosti s primjerima

---

## 7. TEHNIČKI DETALJI

### Stack
- **Framework:** React + TypeScript
- **UI Components:** Radix UI (accessibility fokus)
- **Icons:** Lucide React
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Storage:** SessionStorage (za sesiju)

### Datoteke
```
src/
├── components/
│   ├── DiabetoChatbot.tsx (1076 linija - glavni komponenta)
│   └── ui/ (Radix UI komponente)
├── data/
│   └── recipes.ts (12 recepta s detaljima)
├── hooks/
│   └── useRecipeStorage.ts (getter za recepte)
└── assets/
    └── diabeto.jpg (maskota)
```

### Stanja (State Management)
```typescript
- isOpen: boolean // Da li je chat otvoren
- messages: Message[] // Sve poruke
- input: string // Trenutni unos
- isTyping: boolean // Simulira pisanje
- hasRolledIn: boolean // Je li animacija već bila
- isRolling: boolean // Animacija u tijeku
- showSpeechBubble: boolean // Prikazi pozdrav
- smokeParticles: SmokeParticle[] // Efekti
```

---

## 8. KAKO DODATI NOVE INTENTIONE

### Korak 1: Dodaj Regex Pattern
```typescript
const intents = {
  ...
  my_new_intent: /pattern1|pattern2|pattern3/i,
}
```

### Korak 2: Dodaj Detekciju
```typescript
if (intents.my_new_intent.test(lowerText)) return 'my_new_intent';
```

### Korak 3: Dodaj Case u generateResponse
```typescript
case 'my_new_intent': {
  const filtered = recipes.filter(/* kriterij */);
  return { text: "Evo...", recipes: filtered };
}
```

---

## 9. ZAKLJUČAK

Dijabeto je **rule-based chatbot** koji koristi:
- ✅ Regex pattern matching za intente
- ✅ Normalizaciju dijakritika za fleksibilnost
- ✅ Dinamičko prepoznavanje sastojaka iz recepta
- ✅ Bidirekcijanalno stem sravnjavanje
- ✅ Prioritetan redoslijed provjere za sprječavanje greške
- ✅ Personalizirane odgovore po intentionu
- ✅ Filtriranje i sortiranje recepti po kriterijima

**Rezultat:** Intuitivan, brz, pouzdljiv chatbot koji razumije prirodne varijacije hrvatske konverzacije.
