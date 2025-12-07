# 📱 DIJABETO CHATBOT - PRAKTIČNI PRIMJERI I TESTIRANJE

## Kako Koristiti Chatbot - Korak po Korak

### 1. Otvaranje Chatbota
- Chatbot se pojavljuje kao **gumb s likoku Dijabete** u donjem desnom kutu
- Prvi put kada otvorite aplikaciju, Dijabeto se **kotlja po ekranu** s animacijom
- Nakon kotljanja, pojavljuje se **govorni balon** s pozdravom
- Kliknite na ikonu ili balon da otvorite chat prozor

---

## 📋 KOMPLETAN KATALOG INTENTA - OD A DO Ž

### A) POZDRAVA
| Intent | Pattern | Primjer Unosa | Odgovor |
|--------|---------|--------------|---------|
| greeting | /^(bok\|hej\|zdravo...)/ | "Bok!" | "Bok! 😊 Drago mi je da si tu!" |

---

### B) KATEGORIJE JELA (Što želite jesti?)

#### 1. DESERTI
```
Intent: category_dessert
Pattern: desert|dessert|kolač|kolac|slatko|brownie|tiramisu|cheesecake

Primjer unosa:
  ✓ "Daj mi nešto slatko"
  ✓ "Trebam desert"
  ✓ "Preporuči mi cheesecake"
  
Odgovor:
  "Mmm, deserti! 🍰 Evo slatkih preporuka:"
  
Rezultati (max 5):
  1. Čokoladni kolač (ocjena: 4.2/5)
  2. Brownies (ocjena: 4.75/5)
  3. Palačinke (ocjena: 4.67/5)
  4. Tiramisu (ocjena: 4.8/5)
  5. Cheesecake (ocjena: 4.75/5)
```

#### 2. PASTA/TJESTENINA
```
Intent: category_pasta
Pattern: pasta|pašta|tjestenin|špaget|spaghetti|carbonara|pesto

Primjer unosa:
  ✓ "Pasta time!"
  ✓ "Trebam što tjestenine"
  ✓ "Napravi mi carbonaru"
  
Odgovor:
  "Pasta vrijeme! 🍝 Evo preporuka:"
  
Rezultati:
  1. Pasta Carbonara (20min, 550 kcal)
  2. Tjestenina s pestom (15min, 400 kcal)
```

#### 3. MESO
```
Intent: category_meat
Pattern: meso|piletina|govedina|gulaš|panceta

Primjer unosa:
  ✓ "Želim meso"
  ✓ "Napravi mi gulaš"
  ✓ "Nešto s piletinom"
  ✓ "Imam pancetu, što mogu?"
  
Odgovor:
  "Evo mesnih recepata za tebe:"
  
Specifične obrade:
  - "piletina" → prikazuje samo recepte s piletinom
  - "gulaš" → prikazuje samo gulaš
  - "panceta" → prikazuje samo recepte s pancetom
```

#### 4. RIBA
```
Intent: category_fish
Pattern: riba|losos|morsk

Primjer unosa:
  ✓ "Trebam ribu"
  ✓ "Preporuči losos"
  
Odgovor:
  "Evo ribljih recepata:"
  
Rezultati:
  1. Pečeni losos s povrćem (30min, 350 kcal)
```

#### 5. SALATE
```
Intent: category_salad
Pattern: salata|salatni|svježi|zeleno

Primjer unosa:
  ✓ "Želim salatu"
  ✓ "Nešto zeleno i svježe"
  ✓ "Salata sa fetom"
  
Odgovor:
  "Evo svježih salata:"
  
Rezultati:
  1. Mediteranska salata s fetom (10min, 280 kcal)
```

#### 6. RIŽOTI (Napredni - Dinamička Detekcija!)
```
Intent: category_risotto
Pattern: riz[oa]t?o?|rižot|riža|gljiv

Primjer unosa:
  ✓ "Rizot"
  ✓ "Rižoto"
  ✓ "Nešto s gljivama"
  ✓ "Riža"
  
Odgovor:
  "Evo rižota i recepata s gljivama:"
  
Rezultati:
  1. Rižot od gljiva (35min, 350 kcal)
```

---

### C) PREHRAMBENE PREFERENCIJE (Kako trebam pojesti?)

#### 1. VEGAN
```
Intent: vegan
Pattern: vegan|vegansko|biljne|trava

Primjer unosa:
  ✓ "Trebam veganski recept"
  ✓ "Samo biljne stvari"
  ✓ "Bez životinjskih proizvoda"
  
Odgovor:
  "Evo veganskih recepata za tebe:"
  
🌱 Veganski recepti u bazi:
  - (Mogu se dodati - trenutno nema)
```

#### 2. BEZ GLUTENA
```
Intent: gluten_free
Pattern: bez glutena|gluten-free|bezglutensk

Primjer unosa:
  ✓ "Trebam bez glutena"
  ✓ "Gluten-free opcije"
  
Odgovor:
  "Evo recepata bez glutena:"
  
🌾 Recepti bez glutena:
  1. Pečena piletina s krumpirom
  2. Gulaš
  3. Pečeni losos s povrćem
```

#### 3. VEGETARIJANSKO
```
Intent: vegetarian
Pattern: vegetarijan|vegetarijansko|bez mesa

Primjer unosa:
  ✓ "Trebam vegetarijansko"
  ✓ "Nešto bez mesa"
  
Odgovor:
  "Evo vegetarijanskih recepata:"
  
🥬 Vegetarijanski recepti:
  1. Rižot od gljiva
  2. Palačinke
  3. Tjestenina s pestom
  4. Mediteranska salata
```

---

### D) MAKRO-NUTRIENTI (Po Nutritivnim Vrijednostima)

#### 1. MALO KALORIJA (Dijeta)
```
Intent: low_calorie
Pattern: nisko kaloric|malo kalorij|bez kalorij|lagan|dijeta|zdravo

Primjer unosa:
  ✓ "Trebam malo kalorija"
  ✓ "Nešto za dijetu"
  ✓ "Zdravo jelo"
  ✓ "Lagano za večeru"
  
Odgovor:
  "Evo recepata s najmanje kalorija - savršeni za dijetu:"
  
Sortira od najmanje prema većoj:
  1. Mediteranska salata (280 kcal) ⭐ Najmanje
  2. Pečeni losos (350 kcal)
  3. Rižot od gljiva (350 kcal)
```

#### 2. PUNO KALORIJA (Energija)
```
Intent: high_calorie
Pattern: puno kalorij|mnogo kalorij|bogato kalorij|energetski

Primjer unosa:
  ✓ "Trebam puno kalorija"
  ✓ "Nešto za energiju"
  ✓ "Калорийну hranu"
  
Odgovor:
  "Evo recepata s puno kalorija - energetski bogato:"
  
Sortira od većih prema manjim:
  1. Pasta Carbonara (550 kcal) ⭐ Najviše
  2. Pečena piletina (600 kcal)
  3. Brownies (450 kcal)
```

#### 3. PUNO PROTEINA (Za Mišiće)
```
Intent: high_protein
Pattern: protein|proteini|puno protein|masa|teretana|vjezba|gym|fitnes

Primjer unosa:
  ✓ "Trebam više proteina"
  ✓ "Nešto za teretanu"
  ✓ "Gram proteina za mišiće"
  ✓ "Fitnes obrok"
  
Odgovor:
  "Evo recepata bogatih proteinima:"
  
Sortira od više prema manjoj:
  1. Pečena piletina (45g) ⭐ Najviše
  2. Gulaš (45g)
  3. Pasta Carbonara (20g)
  4. Losos (30g)
```

#### 4. MALO PROTEINA
```
Intent: low_protein
Pattern: malo protein|nisko protein|bez proteina

Primjer unosa:
  ✓ "Trebam malo proteina"
  ✓ "Nisko protein"
  
Odgovor:
  "Evo recepata s malo proteina:"
  
Sortira od manje prema većoj:
  1. Palačinke (6g) ⭐ Najmanje
  2. Brownies (7g)
  3. Mediteranska salata (10g)
```

#### 5. PUNO UGLJIKOHIDRATA (Energija)
```
Intent: high_carbs
Pattern: puno ugljikohidrat|mnogo ugljikohidrat|bogato ugljikohidrat|ugljenik

Primjer unosa:
  ✓ "Trebam ugljikohidrate"
  ✓ "Puno ugljikohidrata"
  ✓ "Za izdržljivost"
  
Odgovor:
  "Evo recepata bogatih ugljikohidratima:"
  
Sortira od više prema manjoj:
  1. Pasta Carbonara (60g) ⭐ Najviše
  2. Palačinke (35g)
  3. Pečena piletina (45g)
```

#### 6. MALO UGLJIKOHIDRATA (Keto Dijeta)
```
Intent: low_carbs
Pattern: malo ugljikohidrat|nisko ugljikohidrat|bez ugljikohidrat

Primjer unosa:
  ✓ "Trebam malo ugljikohidrata"
  ✓ "Keto recepti"
  ✓ "Bez ugljikohidrata"
  
Odgovor:
  "Evo recepata s malo ugljikohidrata:"
  
Sortira od manje prema većoj:
  1. Pečeni losos (15g) ⭐ Najmanje
  2. Pečena piletina (45g)
```

#### 7. PUNO MASTI (Zdrave Masti)
```
Intent: high_fat
Pattern: puno masti|mnogo masti|bogato masti|masno

Primjer unosa:
  ✓ "Trebam zdrave masti"
  ✓ "Puno masti"
  ✓ "Masnije jelo"
  
Odgovor:
  "Evo recepata bogatih mašću:"
  
Sortira od više prema manjoj:
  1. Cheesecake (25g) ⭐ Najviše
  2. Pasta Carbonara (25g)
  3. Brownies (28g)
```

#### 8. MALO MASTI (Lagane Opcije)
```
Intent: low_fat
Pattern: malo masti|nisko masti|bez masti|odmast

Primjer unosa:
  ✓ "Trebam malo masti"
  ✓ "Odmastiti"
  ✓ "Nisko masti"
  
Odgovor:
  "Evo recepata s malo masti:"
  
Sortira od manje prema većoj:
  1. Pečeni losos (18g) ⭐ Najmanje
  2. Mediteranska salata (22g)
```

---

### E) VRIJEME PRIPREME (Koliko brzo?)

#### BRZO
```
Intent: quick
Pattern: brz|jednostavn|lak|kratko vrijeme|kratak

Primjer unosa:
  ✓ "Trebam nešto brzo"
  ✓ "Nešto jednostavno"
  ✓ "Malo vremena"
  ✓ "Lak recept"
  
Odgovor:
  "Evo najbržih recepata - idealno kad nemaš puno vremena:"
  
Sortira po UKUPNOM vremenu (priprema + kuhanja):
  1. Palačinke (5+10=15 min) ⭐ Najbrže
  2. Tjestenina s pestom (5+10=15 min)
  3. Pasta Carbonara (10+12=22 min)
```

---

### F) RANKING I SORTIRANJE (Kako Odabrati?)

#### NAJNOVIJI
```
Intent: newest
Pattern: najnovij|najnoviji|nov|zadnj|recent

Primjer unosa:
  ✓ "Najnoviji recepti"
  ✓ "Koje su zadnje objave"
  ✓ "Novo"
  
Odgovor:
  "Evo najnovijih recepata:"
  
Sortira po datumu objave (nedavno → starije):
  1. Pečena piletina s krumpirom (2025-02-12)
  2. Gulaš (2025-01-17)
  3. Tiramisu (2024-11-15)
```

#### NAJBOLJE OCIJENJENI
```
Intent: best_rated
Pattern: najbolji|ocijen|popularn|top

Primjer unosa:
  ✓ "Najbolji recepti"
  ✓ "Top recepti"
  ✓ "Najviše ocijenjeni"
  ✓ "Popularni"
  
Odgovor:
  "Evo najbolje ocijenjenih recepata:"
  
Sortira po prosječnoj ocjeni (više → manje):
  1. Tiramisu (4.8/5) ⭐ Najbolje
  2. Brownies (4.75/5)
  3. Cheesecake (4.75/5)
```

#### SVI RECEPTI
```
Intent: all_recipes
Pattern: svi recept|sve recept|popis|lista

Primjer unosa:
  ✓ "Svi recepti"
  ✓ "Prikaži listu"
  ✓ "Sve recepte"
  
Odgovor:
  "Imamo ukupno 12 recepata! Evo nekih popularnih:"
  
Prikazuje: 4 random recepta
```

---

### G) SASTOJCI - DINAMIČKA DETEKCIJA! 🚀

#### KAKO RADI:
Bot dinamički prepoznaje sve sastojke iz recepta! Ne trebate znati točan oblik.

```
Intent: ingredient
Pattern: sa |s |imam |sadrži |sastojak|specifični ingredijenti

Primjer unosa:
  ✓ "kava" (nominativ)
  ✓ "kavom" (instrumental)
  ✓ "s kavom" (prepozicijski)
  ✓ "sa kava" (prepozicijski)
  ✓ "kave" (genitive - kako je u receptu)
  
Odgovor (za sve):
  "Pronašao sam nešto čokoladno za tebe:" (samo za čokoladu)
  ili
  "Evo recepata koji sadrže \"sastojak\":"
```

#### PRIMJERI DOSTUPNIH SASTOJAKA:

**1. ČOKOLADA (Varijacije)**
```
Recepti: Čokoladni kolač, Brownies

Ako napišeš bilo što od toga:
  ✓ "čokolada"      → "Pronašao sam nešto čokoladno za tebe"
  ✓ "cokolada"      → (bez dijakritika radi!)
  ✓ "čokoladno"     → (različiti oblik)
  ✓ "s čokoladom"   → (prepozicijski oblik)
  ✓ "sa čokoladom"  → (alternativa)

Rezultat: 2 recepta
```

**2. KAVA**
```
Recept: Tiramisu (200ml kave)

Ako napišeš:
  ✓ "kava"          → pronalazi
  ✓ "kavom"         → pronalazi
  ✓ "s kavom"       → pronalazi
  ✓ "sa kavom"      → pronalazi
  ✓ "kafe"          → (treba testirati)

Rezultat: Tiramisu
```

**3. SIR/PARMEZAN**
```
Recepti: Pasta Carbonara, Rižot, Tjestenina

Ako napišeš:
  ✓ "sir"           → pronalazi sve sa sirom
  ✓ "parmezan"      → pronalazi
  ✓ "parmez"        → pronalazi
  ✓ "s sirom"       → pronalazi
  ✓ "feta"          → pronalazi (ako je u receptu)

Rezultat: Recepti sa sirom
```

**4. TEMELJAC (Poseban Slučaj!)**
```
Recepti: Rižot od gljiva, Gulaš (koriste "temeljca")

VAŽNO: U receptima piše "temeljca" (genitive)
Ali ako napišeš "temeljac" (nominative), bot će:
  ✓ "temeljac"      → pronalazi (stem match!)
  ✓ "temeljca"      → pronalazi
  ✓ "temeljcom"     → pronalazi
  ✓ "s temeljcom"   → pronalazi

Rezultat: Oba recepta
```

**5. PAPAR**
```
Recepti: Pečena piletina, Gulaš, Pečeni losos (koriste "paprika u prahu" ili "sol i papar")

Ako napišeš:
  ✓ "papar"         → pronalazi
  ✓ "paprom"        → pronalazi
  ✓ "s paprom"      → pronalazi
  ✓ "sa paprom"     → pronalazi

Rezultat: Recepti s paprom
```

**6. RAJČICA**
```
Recept: Mediteranska salata (100g cherry rajčica)

Ako napišeš:
  ✓ "rajčica"       → pronalazi
  ✓ "rajcica"       → pronalazi (bez dijakritika)
  ✓ "rajčicama"     → pronalazi (različiti oblik)
  ✓ "s rajčicom"    → pronalazi

Rezultat: Mediteranska salata
```

**7. GLJIVE**
```
Recepti: Rižot od gljiva

Ako napišeš:
  ✓ "gljive"        → pronalazi
  ✓ "gljivu"        → pronalazi (akuzativ)
  ✓ "s gljivama"    → pronalazi
  ✓ "šampinjone"    → pronalazi (alternativno ime)

Rezultat: Rižot od gljiva
```

---

### H) POMOĆ I INFORMACIJE (Što Bot Može?)

#### POMOĆ
```
Intent: help
Pattern: pomoć|help|kako|što možeš|funkcij

Primjer unosa:
  ✓ "Pomoć"
  ✓ "Što možeš raditi?"
  ✓ "Kako koristiti?"
  ✓ "Funkcije"
  
Odgovor:
  Prikazuje sve što bot može (popis od 4 glavne grupe)
```

#### OCJENJIVANJE
```
Intent: rate
Pattern: ocijen|ocjen|zvjezdic

Primjer unosa:
  ✓ "Kako ocijeniti?"
  ✓ "Zvjezdice?"
  
Odgovor:
  "Za ocjenjivanje recepta, otvori stranicu recepta i klikni na zvjezdice!..."
```

#### KOMENTARI
```
Intent: comment
Pattern: komentar|komentiraj

Primjer unosa:
  ✓ "Kako dodati komentar?"
  ✓ "Komentiraj"
  
Odgovor:
  "Za dodavanje komentara, otvori stranicu recepta..."
```

#### GALERIJA
```
Intent: gallery
Pattern: galerij|slik|foto

Primjer unosa:
  ✓ "Galerija"
  ✓ "Pokaži slike"
  ✓ "Foto"
  
Odgovor:
  "Galeriju možeš pronaći u navigaciji..."
```

---

## 🎯 KOMPLEKSNI PRIMJERI - KOMBINIRANI UPITI

### Primjer 1: Samo Jedna Namjera Detektovana
```
Korisnik: "Trebam nešto vegetarijansko za brzo večer"

Bot detektuje: 'quick' (jer se provjeri prvi u redoslijedu)

Rezultat: Sortira po vremenu, ali NE filtrira na vegetarijansko
          → Dobit ćete najbrže recepte bez obzira na vrstu
          
NAPOMENA: Chatbot detektuje samo PRVI matching intent
          Nije dizajniran za kombinovane upite
```

### Primjer 2: Veganska + Brzo
```
Korisnik: "Trebam veganski recept koji se brzo pravi"

Bot detektuje: 'vegan' (provjerava se prije 'quick')

Rezultat: Samo veganski recepti, sortirani po datumu (ne po vremenu)

Rješenje: Trebali bi kompletniji NLP ili filtriranje po više kriterija
```

### Primjer 3: Sastojak + Makro
```
Korisnik: "Trebam nešto s čokoladom, malo masti"

Bot detektuje: 'ingredient' (detektuje se prije 'low_fat')

Rezultat: Recepti s čokoladom, ali NE filtrirani po masti

Optimalno: Dodati AI redoslijed koji provjerava kombinacije
```

---

## ✨ TESTNA PITANJA - KOMPLETNA LISTA

### Kopiraj-Zalijepi za Testiranje:

```
1. POZDRAVE:
   - "Bok!"
   - "Hej, kako si?"
   - "Zdravo Dijabeto"

2. DESERTI:
   - "Daj mi nešto slatko"
   - "Trebam desert"
   - "Brownies"

3. PASTA:
   - "Pasta time!"
   - "Trebam tjesteninu"
   - "Carbonara"

4. MESO:
   - "Trebam meso"
   - "Napravi mi gulaš"
   - "Nešto s piletinom"

5. MAKRO - KALORIJE:
   - "Malo kalorija"
   - "Trebam za dijetu"
   - "Puno kalorija za energiju"

6. MAKRO - PROTEINI:
   - "Trebam proteina za teretanu"
   - "Puno proteina"
   - "Malo proteina"

7. MAKRO - UGLJIKOHIDRATI:
   - "Malo ugljikohidrata"
   - "Puno ugljikohidrata"

8. MAKRO - MASTI:
   - "Malo masti"
   - "Puno masti"

9. VRIJEME:
   - "Trebam brzo"
   - "Nešto jednostavno"

10. RANKING:
    - "Najbolji recepti"
    - "Najnoviji"
    - "Svi recepti"

11. PREFERENCIJE:
    - "Trebam veganske"
    - "Bez glutena"
    - "Vegetarijansko"

12. SASTOJCI (DINAMIČKI):
    - "kava"
    - "kavom"
    - "s kavom"
    - "čokolada"
    - "s čokoladom"
    - "cokolada" (bez dijakritika)
    - "temeljac"
    - "s temeljcem"
    - "papar"
    - "s paprom"
    - "rajčica"
    - "gljive"
    - "sir"
    - "parmezan"

13. POMOĆ:
    - "Pomoć"
    - "Što možeš raditi?"
    - "Kako se koristi?"
```

---

## 🐛 ZNANI PROBLEMI I RJEŠENJA

### Problem 1: Kombinovani Upiti Ne Rade
```
Upit: "Trebam veganski recept koji je brz"
Očekivano: Brzi veganski recepti
Dobiveno: Samo veganski recepti (random sortirani)

Rješenje: Dodati "fuzzy matching" ili ML model za kombinacije
```

### Problem 2: Jako Kratke Riječi Se Ne Pronalaze
```
Upit: "gm" (za gram)
Očekivano: Filtriranje po gramima
Dobiveno: "Nisam siguran što tražiš"

Razlog: Minimum 3 karaktera za tokene
Rješenje: Smanjiti threshold s 3 na 2 karaktera (ako je brzo)
```

### Problem 3: Plurali i Različiti Padežи
```
Upit: "sa rajčicama"
Očekivano: Pronalazi recepte s rajčicama
Mogućnost: Možda ne pronalazi ako je stem ne poklapa

Rješenje: Proširiti stem generator na više padežnih formi
```

---

## 📊 STATISTIČKE INFORMACIJE

### Broj Intenta: **24**
- Pozdrave: 1
- Kategorije: 6
- Preferencije: 3
- Makro-nutrienti: 8
- Vrijeme: 1
- Ranking: 3
- Sastojci: 1
- Pomoć: 1

### Broj Recepta: **12**
- Deserti: 5
- Pasta: 2
- Meso: 2
- Riba: 1
- Salate: 1
- Rižoti: 1

### Razine Filtriranja:
1. Intent Detection (24 stupnja)
2. Dinamička Detekcija Sastojaka (tokenizacija)
3. Stem Generiranje (8+ varijacija po tokenu)
4. Bidirekcijanalno Sravnjavanje

---

## 🎓 ZAKLJUČAK

Dijabeto je **sofisticiran rule-based chatbot** koji koristi:
- Regex za polje intenta
- Normalizaciju dijakritika
- Dinamičku ekstrakciju tokena
- Stem generiranje
- Bidirekcijanalno sravnjavanje

**Rezultat**: Chatbot koji razumije prirodne varijacije hrvatskog jezika i sprječava korisnice kao što su greške s dijakriticima ili različitim padežima.

**Za bolji rezultat sa kombinovanim upitima**, trebali bi:
- Multi-intent detection
- Vector embeddings (npr. Sentence Transformers)
- Kombinovani filter-chain
