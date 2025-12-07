export interface Recipe {
  id: number;
  ime: string;
  kategorije: string[];
  sastojci: string[];
  priprema: string;
  nutritivne_vrijednosti: {
    kalorije: number;
    masti: number;
    ugljikohidrati: number;
    proteini: number;
  };
  jednostavnost: number;
  vrijeme_pripreme: number;
  vrijeme_kuhanja: number;
  broj_serviranja: number;
  vegan: boolean;
  gluten_free: boolean;
  ocjene: number[];
  komentari: { autor: string; tekst: string; datum: string }[];
  datum_objave: string;
  slika?: string;
}

export const recipes: Recipe[] = [
  {
    id: 1,
    ime: "Čokoladni kolač",
    kategorije: ["deserti", "čokoladno"],
    sastojci: [
      "200g tamne čokolade",
      "100g maslaca",
      "3 jaja",
      "100g šećera",
      "50g brašna"
    ],
    priprema: "1. Rastopi čokoladu i maslac na laganoj vatri.\n2. Umuti jaja i šećer dok smjesa ne postane pjenasta.\n3. Umiješaj rastopljenu čokoladu.\n4. Dodaj brašno i lagano promiješaj.\n5. Ulij u kalup i peci 25 min na 180°C.\n6. Ohladi prije rezanja.",
    nutritivne_vrijednosti: {
      kalorije: 400,
      masti: 20,
      ugljikohidrati: 50,
      proteini: 6
    },
    jednostavnost: 3,
    vrijeme_pripreme: 15,
    vrijeme_kuhanja: 25,
    broj_serviranja: 8,
    vegan: false,
    gluten_free: false,
    ocjene: [4, 5, 4, 5, 3],
    komentari: [
      { autor: "Ana", tekst: "Prekrasan kolač, obitelj je oduševljena!", datum: "2024-01-15" },
      { autor: "Marko", tekst: "Jednostavan za napraviti, a tako ukusan.", datum: "2024-02-20" }
    ],
    datum_objave: "2023-11-02"
  },
  {
    id: 2,
    ime: "Pasta Carbonara",
    kategorije: ["pasta", "meso"],
    sastojci: [
      "200g špageta",
      "100g pancete",
      "2 jaja",
      "50g parmezana",
      "sol i papar"
    ],
    priprema: "1. Skuhaj špagete.\n2. Popeci pancetu.\n3. Umuti jaja i parmezan.\n4. Pomiješaj sve dok se ne zgusne.",
    nutritivne_vrijednosti: {
      kalorije: 550,
      masti: 25,
      ugljikohidrati: 60,
      proteini: 20
    },
    jednostavnost: 4,
    vrijeme_pripreme: 10,
    vrijeme_kuhanja: 12,
    broj_serviranja: 2,
    vegan: false,
    gluten_free: false,
    ocjene: [5, 5, 4],
    komentari: [],
    datum_objave: "2024-01-15"
  },
  {
    id: 3,
    ime: "Rižot od gljiva",
    kategorije: ["rizoti", "vegetarijansko"],
    sastojci: [
      "200g arborio riže",
      "200g šampinjona",
      "1 luk",
      "50g parmezana",
      "500ml povrtnog temeljca"
    ],
    priprema: "1. Popržite luk.\n2. Dodajte gljive.\n3. Dodajte rižu.\n4. Postupno dodajte temeljac i miješajte.\n5. Završite parmezanom.",
    nutritivne_vrijednosti: {
      kalorije: 350,
      masti: 10,
      ugljikohidrati: 60,
      proteini: 12
    },
    jednostavnost: 3,
    vrijeme_pripreme: 10,
    vrijeme_kuhanja: 25,
    broj_serviranja: 2,
    vegan: false,
    gluten_free: false,
    ocjene: [4, 4, 5, 3],
    komentari: [
      { autor: "Petra", tekst: "Moj omiljeni rižot!", datum: "2023-10-05" }
    ],
    datum_objave: "2022-09-28"
  },
  {
    id: 4,
    ime: "Pečena piletina s krumpirom",
    kategorije: ["meso", "glavno jelo"],
    sastojci: [
      "1 cijela piletina",
      "500g krumpira",
      "2 žlice maslinovog ulja",
      "sol, papar, začini"
    ],
    priprema: "1. Začini piletinu.\n2. Pripremi krumpire.\n3. Peci 75 minuta na 200°C.",
    nutritivne_vrijednosti: {
      kalorije: 600,
      masti: 30,
      ugljikohidrati: 45,
      proteini: 45
    },
    jednostavnost: 4,
    vrijeme_pripreme: 15,
    vrijeme_kuhanja: 75,
    broj_serviranja: 4,
    vegan: false,
    gluten_free: true,
    ocjene: [5, 5, 5, 4, 5],
    komentari: [],
    datum_objave: "2025-02-12"
  },
  {
    id: 5,
    ime: "Palačinke",
    kategorije: ["deserti", "slatko"],
    sastojci: [
      "2 jaja",
      "200ml mlijeka",
      "100g brašna",
      "1 žlica šećera",
      "maslac"
    ],
    priprema: "1. Umuti sve sastojke.\n2. Ispeci palačinke.\n3. Posluži s nadjevom po želji.",
    nutritivne_vrijednosti: {
      kalorije: 250,
      masti: 10,
      ugljikohidrati: 35,
      proteini: 6
    },
    jednostavnost: 5,
    vrijeme_pripreme: 5,
    vrijeme_kuhanja: 10,
    broj_serviranja: 4,
    vegan: false,
    gluten_free: false,
    ocjene: [5, 4, 5],
    komentari: [],
    datum_objave: "2024-07-03"
  },
  {
    id: 6,
    ime: "Tjestenina s pestom",
    kategorije: ["pasta", "vegetarijansko"],
    sastojci: [
      "200g tjestenine",
      "50g pesto umaka",
      "20g pinjola",
      "50g parmezana"
    ],
    priprema: "1. Skuhaj tjesteninu.\n2. Dodaj pesto, parmezan i pinjole.\n3. Promiješaj i posluži.",
    nutritivne_vrijednosti: {
      kalorije: 400,
      masti: 18,
      ugljikohidrati: 50,
      proteini: 12
    },
    jednostavnost: 5,
    vrijeme_pripreme: 5,
    vrijeme_kuhanja: 10,
    broj_serviranja: 2,
    vegan: false,
    gluten_free: false,
    ocjene: [4, 4],
    komentari: [],
    datum_objave: "2023-03-21"
  },
  {
    id: 7,
    ime: "Cheesecake",
    kategorije: ["deserti", "slatko"],
    sastojci: [
      "200g keksa",
      "100g maslaca",
      "400g krem sira",
      "100g šećera",
      "2 jaja"
    ],
    priprema: "1. Napravi podlogu.\n2. Umuti kremu.\n3. Peci 45 minuta na 160°C.",
    nutritivne_vrijednosti: {
      kalorije: 450,
      masti: 25,
      ugljikohidrati: 45,
      proteini: 10
    },
    jednostavnost: 3,
    vrijeme_pripreme: 20,
    vrijeme_kuhanja: 45,
    broj_serviranja: 10,
    vegan: false,
    gluten_free: false,
    ocjene: [5, 5, 5, 4],
    komentari: [
      { autor: "Ivana", tekst: "Najbolji cheesecake ikad!", datum: "2023-12-25" }
    ],
    datum_objave: "2022-12-18"
  },
  {
    id: 8,
    ime: "Pečeni losos s povrćem",
    kategorije: ["riba", "glavno jelo"],
    sastojci: [
      "200g lososa",
      "200g povrća",
      "2 žlice maslinovog ulja",
      "sol i papar"
    ],
    priprema: "1. Začini lososa.\n2. Pripremi povrće.\n3. Peci 20 minuta na 180°C.",
    nutritivne_vrijednosti: {
      kalorije: 350,
      masti: 18,
      ugljikohidrati: 15,
      proteini: 30
    },
    jednostavnost: 4,
    vrijeme_pripreme: 10,
    vrijeme_kuhanja: 20,
    broj_serviranja: 1,
    vegan: false,
    gluten_free: true,
    ocjene: [5, 4, 5],
    komentari: [],
    datum_objave: "2024-09-09"
  },
  {
    id: 9,
    ime: "Brownies",
    kategorije: ["deserti", "čokoladno"],
    sastojci: [
      "200g čokolade",
      "150g maslaca",
      "200g šećera",
      "3 jaja",
      "100g brašna"
    ],
    priprema: "1. Rastopi čokoladu.\n2. Umuti jaja i šećer.\n3. Dodaj brašno i peci 25 min.",
    nutritivne_vrijednosti: {
      kalorije: 450,
      masti: 28,
      ugljikohidrati: 50,
      proteini: 7
    },
    jednostavnost: 4,
    vrijeme_pripreme: 10,
    vrijeme_kuhanja: 25,
    broj_serviranja: 9,
    vegan: false,
    gluten_free: false,
    ocjene: [5, 5, 4, 5],
    komentari: [],
    datum_objave: "2023-05-26"
  },
  {
    id: 10,
    ime: "Gulaš",
    kategorije: ["meso", "glavno jelo"],
    sastojci: [
      "500g govedine",
      "2 luka",
      "2 mrkve",
      "400ml temeljca",
      "paprika u prahu"
    ],
    priprema: "1. Popržite luk.\n2. Dodajte meso.\n3. Dodajte mrkvu i začine.\n4. Kuhajte 90 minuta.",
    nutritivne_vrijednosti: {
      kalorije: 500,
      masti: 25,
      ugljikohidrati: 25,
      proteini: 45
    },
    jednostavnost: 2,
    vrijeme_pripreme: 20,
    vrijeme_kuhanja: 90,
    broj_serviranja: 4,
    vegan: false,
    gluten_free: true,
    ocjene: [4, 5, 5, 4, 5],
    komentari: [
      { autor: "Josip", tekst: "Pravi domaći okus!", datum: "2025-01-20" }
    ],
    datum_objave: "2025-01-17"
  },
  {
    id: 11,
    ime: "Mediteranska salata s fetom",
    kategorije: ["salate", "vegetarijansko"],
    sastojci: [
      "200g miješane zelene salate",
      "150g feta sira",
      "100g cherry rajčica",
      "1 krastavac",
      "50g maslina",
      "maslinovo ulje i balzamik"
    ],
    priprema: "1. Operite i osušite salatu.\n2. Narežite rajčice i krastavac.\n3. Dodajte masline i fetu.\n4. Prelijte maslinovim uljem i balzamikom.\n5. Lagano promiješajte i poslužite.",
    nutritivne_vrijednosti: {
      kalorije: 280,
      masti: 22,
      ugljikohidrati: 12,
      proteini: 10
    },
    jednostavnost: 5,
    vrijeme_pripreme: 10,
    vrijeme_kuhanja: 0,
    broj_serviranja: 2,
    vegan: false,
    gluten_free: true,
    ocjene: [4, 5, 4],
    komentari: [
      { autor: "Marina", tekst: "Osvježavajuće i zdravo!", datum: "2024-06-15" }
    ],
    datum_objave: "2024-06-10"
  },
  {
    id: 12,
    ime: "Tiramisu",
    kategorije: ["deserti", "talijanska kuhinja"],
    sastojci: [
      "250g mascarpone sira",
      "200g piškota",
      "3 jaja",
      "100g šećera",
      "200ml kave",
      "kakao u prahu"
    ],
    priprema: "1. Skuhajte jaku kavu i ohladite.\n2. Umutite žumanjke sa šećerom.\n3. Dodajte mascarpone i promiješajte.\n4. Umutite bjelanjke u snijeg i umiješajte.\n5. Umočite piškote u kavu i složite slojeve.\n6. Pospite kakaom i ohladite 4 sata.",
    nutritivne_vrijednosti: {
      kalorije: 380,
      masti: 22,
      ugljikohidrati: 38,
      proteini: 8
    },
    jednostavnost: 3,
    vrijeme_pripreme: 30,
    vrijeme_kuhanja: 0,
    broj_serviranja: 8,
    vegan: false,
    gluten_free: false,
    ocjene: [5, 5, 5, 5, 4],
    komentari: [
      { autor: "Luka", tekst: "Talijanski klasik, savršeno!", datum: "2024-11-20" }
    ],
    datum_objave: "2024-11-15"
  }
];

export const getRecipeById = (id: number): Recipe | undefined => {
  return recipes.find(r => r.id === id);
};

export const getAverageRating = (ocjene: number[]): number => {
  if (ocjene.length === 0) return 0;
  return ocjene.reduce((a, b) => a + b, 0) / ocjene.length;
};
