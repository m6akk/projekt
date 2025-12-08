import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getStoredRecipes } from '@/hooks/useRecipeStorage';
import { Recipe, getAverageRating } from '@/data/recipes';
import { Link, useLocation } from 'react-router-dom';
import diabetoImage from '@/assets/diabeto.jpg';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  recipes?: Recipe[];
}

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

// Intent recognition patterns
const intents = {
  greeting: /^(bok|hej|zdravo|pozdrav|hi|hello|cao|ćao|dobar dan)/i,
  category_dessert: /(desert|dessert|kolač|kolac|slatko|slatk[oć]|brownie|tiramisu|palačink|palacink|cheesecake|cheescake)/i,
  category_pasta: /(pasta|pašta|tjestenin|testenin|testenine|špaget|špageti|spageti|spaghetti|spaget|carbonara|pesto)/i,
  category_meat: /(meso|piletina|govedina|gulaš|panceta)/i,
  category_fish: /(riba|losos|morsk)/i,
  category_salad: /(salat[an]?o?|salatni|salatna|svjež|sveze|zeleno)/i,
  category_risotto: /(riz[oa]t?o?|rižot|riža|gljiv)/i,
  vegan: /(vegan|vegansko|biljn[oa]|biljne|trava|ne.?zivotinsko|nezivotinsko)/i,
  gluten_free: /(bez glutena|gluten.?free|bezglutensk)/i,
  vegetarian: /(vegetarijan|vegetarijansko|vegeterijansko|vegetarijan|bez mesa)/i,
  low_calorie: /(nisko.?kaloric|malo kalorij|bez kalorij|bez debljanja|lagan|dijeta|zdravo)/i,
  high_calorie: /(puno.?kalorij|mnogo kalorij|bogato kalorij|energetski bogato)/i,
  low_protein: /(malo protein|nisko protein|bez proteina)/i,
  high_protein: /(protein|proteini|puno protein|masa|teretana|vjezba|vjzbanje|gym|fitnes|muskulac)/i,
  low_carbs: /(malo.?ugljikohidrat|nisko.?ugljikohidrat|bez ugljikohidrat)/i,
  high_carbs: /(puno.?ugljikohidrat|mnogo ugljikohidrat|bogato ugljikohidrat|ugljenik)/i,
  low_fat: /(malo.?masti|nisko.?masti|bez masti|odmast)/i,
  high_fat: /(puno.?masti|mnogo masti|bogato masti|masno)/i,
  quick: /(brz|jednostavn|lak|kratko vrijeme|kratak)/i,
  simple: /(jednostav|jednostavno|jednostavni|jednostavan)/i,
  newest: /(najnovij|najnoviji|nov|zadnj|recent)/i,
  best_rated: /(najbolj|ocjen|popularn|top)/i,
  ingredient: /(sa |s |imam |sadrži |sastojak|\b(sir|cheese|mascarpone|parmezan|parmez|feta|cokolad[a-z]*|čokolad[a-z]*)\b)/i,
  help: /(pomoć|help|kako|što možeš|funkcij)/i,
  rate: /(ocijen|ocjen|zvjezdic)/i,
  comment: /(komentar|komentiraj)/i,
  gallery: /(galerij|slik|foto)/i,
  all_recipes: /(svi recept|sve recept|popis|lista)/i,
};

const DiabetoChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Start with an empty conversation on each page load (do not restore previous chat)
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasRolledIn, setHasRolledIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('hasRolledIn') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isRolling, setIsRolling] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [rollPosition, setRollPosition] = useState(-100);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [smokeParticles, setSmokeParticles] = useState<SmokeParticle[]>([]);
  const [bounceCount, setBounceCount] = useState(0);
  const [rollerSpeech, setRollerSpeech] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLenRef = useRef<number>(messages.length);
  const location = useLocation();

  // Rolling animation on home page - ONLY once when entering home
  useEffect(() => {
    if (location.pathname === '/' && !hasRolledIn) {
      const timer = setTimeout(() => {
        setIsRolling(true);
        setHasRolledIn(true);
        try {
          sessionStorage.setItem('hasRolledIn', 'true');
        } catch (e) {
          // ignore
        }
        
        // Use requestAnimationFrame for a smooth, time-based animation
        const start = performance.now();
        const startX = -100; // start further left so the roll begins off-screen
        const endX = Math.max(window.innerWidth - 100, 200);
        const duration = 6000; // ms - total time for the roll (slower, ~5.5s)
        let rafId: number | null = null;

        // Less frequent particles; capture a snapshot of rollPosition each tick
        const smokeInterval = setInterval(() => {
          setSmokeParticles(prev => [
            ...prev.slice(-10),
            {
              id: Date.now(),
              x: Math.round(rollPosition) - 20,
              y: Math.random() * 20 - 10,
              opacity: 1,
            }
          ]);
        }, 240);

        // Use linear timing so move + rotation feel constant across the whole roll
        const linear = (t: number) => t;

        const step = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(1, elapsed / duration);
          const eased = linear(progress);
          const current = startX + (endX - startX) * eased;
          // round to integer to avoid subpixel blurring
          setRollPosition(Math.round(current));

          if (progress < 1) {
            rafId = requestAnimationFrame(step);
          } else {
            // finished
            if (rafId) cancelAnimationFrame(rafId);
            clearInterval(smokeInterval);
            setIsRolling(false);
            setIsBouncing(true);

            // Bounce animation starts after rolling stops
            let bounce = 0;
            const bounceInterval = setInterval(() => {
              bounce++;
              setBounceCount(bounce);
              if (bounce >= 3) {
                clearInterval(bounceInterval);
                setBounceCount(0);
                setIsBouncing(false);

                // Show a short utterance (breath) then the main speech bubble
                setTimeout(() => {
                  setRollerSpeech('Hoo… huff… hoo...');
                  setTimeout(() => {
                    setRollerSpeech('');
                    setShowSpeechBubble(true);
                    setTimeout(() => setShowSpeechBubble(false), 5000);
                  }, 1200);
                }, 300);
              }
            }, 150);
          }
        };

        rafId = requestAnimationFrame(step);

        return () => {
          if (rafId) cancelAnimationFrame(rafId);
          clearInterval(smokeInterval);
        };

      }, 1500); // Start after splash screen

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Fade out smoke particles
  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setSmokeParticles(prev => 
        prev
          .map(p => ({ ...p, opacity: p.opacity - 0.05 }))
          .filter(p => p.opacity > 0)
      );
    }, 50);
    return () => clearInterval(fadeInterval);
  }, []);

  // Initial greeting when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
          id: 1,
          text: "Bok! 👋 Ja sam Dijabeto — tvoj kulinarski asistent i vodič kroz recepte.\n\nMogu ti:\n• Preporučiti recepte po kategoriji (desert, pasta, meso, riba, salata)\n• Pronaći recepte po sastojku (npr. 's čokoladom' ili 's piletinom')\n• Filtrirati po prehrani (vegan, vegetarijansko, bez glutena)\n• Predložiti brze recepte ili nutritivno prilagođene (nisko-kalorično, više proteina)\n\nPrimjeri upita:\n• \"Daj mi nešto slatko\" \n• \"Daj mi veganske recepte\" \n• \"Daj mi recepte s puno proteina\"\n • \"Daj mi recepte s malo kalorija\"  \n• \"Daj mi brz recept\" \n• \"Trebam recepte bez glutena\"\n• \"Pokaži najnovije recepte\" \n\nKlikni chat da počnemo!",
          isBot: true,
        };
      setMessages([greeting]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll when a new bot reply arrives in response to a user message
  useEffect(() => {
    const rootEl = scrollRef.current as HTMLElement | null;
    if (!rootEl) {
      prevLenRef.current = messages.length;
      return;
    }

    const viewport = rootEl.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
    const elToScroll = viewport ?? rootEl;

    const prevLen = prevLenRef.current;
    const newMessages = messages.slice(prevLen);

    // Find the first new bot message
    const newBot = newMessages.find(m => m.isBot);

    // Update prev length immediately for next run
    prevLenRef.current = messages.length;

    if (!newBot) {
      return;
    }

    // Ensure this bot message is a reply to a user message: the previous message must be a user message
    const idx = messages.findIndex(m => m.id === newBot.id);
    if (idx <= 0) return;
    const prevMsg = messages[idx - 1];
    if (!prevMsg || prevMsg.isBot) return; // not a reply to a user message

    // Scroll to the top of the bot's reply after layout
    requestAnimationFrame(() => {
      const container = elToScroll.querySelector('.space-y-4') as HTMLElement | null;
      const msgEl = container ? container.querySelector(`[data-msg-id="${newBot.id}"]`) as HTMLElement | null : null;
      const paddingTop = 40; // show avatar by leaving more space above the message

      if (msgEl) {
        const doScroll = () => {
          let target = Math.max(0, msgEl.offsetTop - paddingTop);
          const maxScroll = elToScroll.scrollHeight - elToScroll.clientHeight;
          if (target > maxScroll) target = maxScroll;
          elToScroll.scrollTop = target;
        };

        // Initial scroll
        doScroll();

        // Re-run after a short delay to account for images/layout changes
        const retry = setTimeout(() => {
          doScroll();
        }, 120);

        // clear if needed (no cleanup here because effect reruns rarely and component lives long)
        // but keep minimal guard: if messages change quickly, timeout will be replaced on next effect
      } else {
        // fallback: scroll to bottom
        elToScroll.scrollTop = elToScroll.scrollHeight;
      }
    });
  }, [messages]);

  // Note: chat history persistence disabled — conversation resets on page load

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-scroll to bottom when chatbot is opened
  useEffect(() => {
    if (isOpen && scrollRef.current && messages.length > 0) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
      const elToScroll = viewport ?? scrollRef.current;
      
      setTimeout(() => {
        // Find the last bot message
        const lastBotMessage = [...messages].reverse().find(m => m.isBot);
        if (lastBotMessage) {
          const container = elToScroll.querySelector('.space-y-4') as HTMLElement | null;
          const msgEl = container ? container.querySelector(`[data-msg-id="${lastBotMessage.id}"]`) as HTMLElement | null : null;
          
          if (msgEl) {
            // Scroll to show the top of the last bot message with some padding
            const paddingTop = 60;
            let target = Math.max(0, msgEl.offsetTop - paddingTop);
            const maxScroll = elToScroll.scrollHeight - elToScroll.clientHeight;
            if (target > maxScroll) target = maxScroll;
            elToScroll.scrollTop = target;
          } else {
            // Fallback: scroll to bottom
            elToScroll.scrollTop = elToScroll.scrollHeight;
          }
        }
      }, 50);
    }
  }, [isOpen]);

  const getRecipes = (): Recipe[] => {
    return getStoredRecipes();
  };

  const detectIntent = (text: string): string => {
    const lowerText = text.toLowerCase();
    const norm = normalizeText(lowerText);
    
    if (intents.greeting.test(lowerText)) return 'greeting';
    if (intents.newest.test(lowerText)) return 'newest';
    if (intents.best_rated.test(lowerText)) return 'best_rated';
    if (intents.vegan.test(lowerText)) return 'vegan';
    if (intents.gluten_free.test(lowerText)) return 'gluten_free';
    if (intents.vegetarian.test(lowerText)) return 'vegetarian';
    if (intents.low_calorie.test(lowerText)) return 'low_calorie';
    if (intents.high_calorie.test(lowerText)) return 'high_calorie';
    if (intents.low_protein.test(lowerText)) return 'low_protein';
    if (intents.high_protein.test(lowerText)) return 'high_protein';
    if (intents.low_carbs.test(lowerText)) return 'low_carbs';
    if (intents.high_carbs.test(lowerText)) return 'high_carbs';
    if (intents.low_fat.test(lowerText)) return 'low_fat';
    if (intents.high_fat.test(lowerText)) return 'high_fat';
    if (intents.quick.test(lowerText)) return 'quick';
    if (intents.simple.test(lowerText)) return 'simple';
    if (intents.category_dessert.test(lowerText)) return 'category_dessert';
    if (intents.category_pasta.test(lowerText)) return 'category_pasta';
    if (intents.category_meat.test(lowerText)) return 'category_meat';
    if (intents.category_fish.test(lowerText)) return 'category_fish';
    if (intents.category_salad.test(lowerText)) return 'category_salad';
    if (intents.category_risotto.test(lowerText)) return 'category_risotto';
    if (intents.help.test(lowerText)) return 'help';
    if (intents.rate.test(lowerText)) return 'rate';
    if (intents.comment.test(lowerText)) return 'comment';
    if (intents.gallery.test(lowerText)) return 'gallery';
    if (intents.all_recipes.test(lowerText)) return 'all_recipes';
    if (intents.ingredient.test(lowerText)) return 'ingredient';

    // Extra checks for explicit gluten restriction phrasing (e.g. "ne mogu jesti gluten")
    // Match patterns like: "ne mogu jesti gluten", "ne smijem jesti gluten", "imam alergiju na gluten", "nemogu jesti gluten"
    try {
      if (/(?:ne\s?mogu|ne\s?smijem|nemogu|imam alergij|alergij(a|u) na)/i.test(lowerText) && /gluten/.test(lowerText)) {
        return 'gluten_free';
      }
    } catch (e) {
      // ignore regex errors
    }

    // Dynamic ingredient detection: check if normalized input matches any token/stem from recipes
    try {
      const recipes = getRecipes();
      const tokenSet = new Set<string>();
      recipes.forEach(r => {
        normalizeText(r.ime).split(/\W+/).forEach(t => { if (t.length >= 3) tokenSet.add(t); });
        r.sastojci.forEach(s => normalizeText(s).split(/\W+/).forEach(t => { if (t.length >= 3) tokenSet.add(t); }));
      });

      const stemsFor = (token: string) => {
        const stems = new Set<string>();
        stems.add(token);

        // remove instrumental 'om' ending
        if (token.endsWith('om')) stems.add(token.slice(0, -2));

        // if ends with vowel, add form without final vowel
        if (/[aeiou]$/.test(token)) stems.add(token.slice(0, -1));

        // generate vowel-replacement variants (e.g., kave -> kava)
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        if (/[aeiou]$/.test(token)) {
          const base = token.slice(0, -1);
          vowels.forEach(v => stems.add(base + v));
        } else {
          vowels.forEach(v => stems.add(token + v));
        }

        // common instrumental / locative variants
        stems.add(token + 'om');
        stems.add(token + 'u');

        // swap 'ca' <-> 'ac' for words like temeljca <-> temeljac
        if (token.endsWith('ca')) stems.add(token.slice(0, -2) + 'ac');
        if (token.endsWith('ac')) stems.add(token.slice(0, -2) + 'ca');

        return Array.from(stems);
      };

      for (const token of tokenSet) {
        const stems = stemsFor(token);
        for (const s of stems) {
          if (!s) continue;
          if (norm.includes(s) || s.includes(norm)) return 'ingredient';
        }
      }
    } catch (e) {
      // if recipe loading fails, silently continue
    }
    
    return 'unknown';
  };

  const extractIngredient = (text: string): string => {
    const lowerText = text.toLowerCase();
    const normText = normalizeText(lowerText);

    // Build a set of normalized tokens from all recipes (names + ingredients)
    const recipes = getRecipes();
    const tokenSet = new Set<string>();
    recipes.forEach(r => {
      // from name
      normalizeText(r.ime).split(/\W+/).forEach(t => { if (t.length >= 3) tokenSet.add(t); });
      // from ingredients
      r.sastojci.forEach(s => {
        normalizeText(s).split(/\W+/).forEach(t => { if (t.length >= 3) tokenSet.add(t); });
      });
    });

    // Helper to generate stems/variants to match common Croatian declensions
    const stemsFor = (token: string) => {
      const stems = new Set<string>();
      stems.add(token);

      // remove instrumental 'om' ending
      if (token.endsWith('om')) stems.add(token.slice(0, -2));

      // if ends with vowel, add form without final vowel
      if (/[aeiou]$/.test(token)) stems.add(token.slice(0, -1));

      // generate vowel-replacement variants (e.g., kave -> kava)
      const vowels = ['a', 'e', 'i', 'o', 'u'];
      if (/[aeiou]$/.test(token)) {
        const base = token.slice(0, -1);
        vowels.forEach(v => stems.add(base + v));
      } else {
        vowels.forEach(v => stems.add(token + v));
      }

      // common instrumental / locative variants
      stems.add(token + 'om');
      stems.add(token + 'u');

      // swap 'ca' <-> 'ac' for words like temeljca <-> temeljac
      if (token.endsWith('ca')) stems.add(token.slice(0, -2) + 'ac');
      if (token.endsWith('ac')) stems.add(token.slice(0, -2) + 'ca');

      return Array.from(stems);
    };

    // Try to find a matching token/stem in the user's normalized input
    for (const token of tokenSet) {
      const stems = stemsFor(token);
      for (const s of stems) {
        if (!s) continue;
        if (normText.includes(s) || s.includes(normText)) {
          return s; // return normalized token/stem
        }
      }
    }

    // Fallback: existing keyword heuristics (covers short queries like 'kava', etc.)
    const ingredientKeywords = [
      'cokolad', 'čokolad',  // chocolate
      'sir', 'cheese', 'mascarpone', 'parmezan', 'parmez', 'feta',
      'pancet', 'panceta', 'kava', 'rajcic', 'rajčic', 'paradajz', 'domat'
    ];

    for (const keyword of ingredientKeywords) {
      if (lowerText.includes(keyword)) {
        const regex = new RegExp(keyword + '[a-z]*', 'i');
        const match = lowerText.match(regex);
        if (match) {
          const extracted = match[0];
          if (keyword === 'cokolad' || keyword === 'čokolad') return 'cokolad';
          return normalizeText(extracted);
        }
      }
    }

    // Try traditional patterns (sa, s, imam, sadrži)
    const patterns = [
      /sa\s+(\w+)/i,
      /s\s+(\w+)/i,
      /imam\s+(\w+)/i,
      /sadrži\s+(\w+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return normalizeText(match[1].toLowerCase());
    }

    return normText;
  };

  // Normalize text for diacritics-insensitive matching
  const normalizeText = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

  const generateResponse = (userMessage: string): { text: string; recipes?: Recipe[] } => {
    const intent = detectIntent(userMessage);
    const recipes = getRecipes();
    
    switch (intent) {
      case 'greeting':
        return {
          text: "Hej! 😊 Drago mi je što si ovdje — ja sam Dijabeto.\n\nEvo kako ti mogu pomoći odmah:\n• Preporuke po žanru: deserti, paste, mesna jela, riba, salate\n• Po sastojku: napiši što imaš u frižideru (npr. 'imam jaja')\n• Po prehrani: vegan, vegetarijansko, bez glutena, niskokalorično\n\nPrimjeri: \"Daj mi nešto s čokoladom\", \"Treba mi nešto brzo i bez glutena\", \"Najbolje ocijenjeno\"\n\nAko želiš, mogu ti i reći nutritivne informacije recepta ili sortirati po ocjeni. Samo upiši svoje pitanje!"
        };
      
      case 'newest': {
        const sorted = [...recipes].sort((a, b) => 
          new Date(b.datum_objave).getTime() - new Date(a.datum_objave).getTime()
        );
        const newest = sorted.slice(0, 3);
        return {
          text: "Evo najnovijih recepata:",
          recipes: newest
        };
      }
      
      case 'best_rated': {
        const sorted = [...recipes].sort((a, b) => 
          getAverageRating(b.ocjene) - getAverageRating(a.ocjene)
        );
        const best = sorted.slice(0, 3);
        return {
          text: "Evo najbolje ocijenjenih recepata:",
          recipes: best
        };
      }
      
      case 'vegan': {
        const veganRecipes = recipes.filter(r => r.vegan);
        if (veganRecipes.length === 0) {
          const vegRecipes = recipes.filter(r => 
            r.kategorije.some(k => k.toLowerCase().includes('vegetarijan')) || r.vegan
          );
          return { 
            text: "Nažalost, trenutno nemamo veganske recepte. Ali možeš probati vegetarijanske opcije!",
            recipes: vegRecipes
          };
        }
        return {
          text: "Evo veganskih recepata za tebe:",
          recipes: veganRecipes.slice(0, 5)
        };
      }
      
      case 'gluten_free': {
        const gfRecipes = recipes.filter(r => r.gluten_free);
        if (gfRecipes.length === 0) {
          return { text: "Nažalost, trenutno nemamo bezglutenskih recepata." };
        }
        return {
          text: "Evo recepata bez glutena:",
          recipes: gfRecipes.slice(0, 3)
        };
      }
      
      case 'vegetarian': {
        const vegRecipes = recipes.filter(r => 
          r.kategorije.some(k => k.toLowerCase().includes('vegetarijan')) || r.vegan
        );
        if (vegRecipes.length === 0) {
          return { text: "Hmm, nisam pronašao vegetarijanske recepte. Možda probaj salate?" };
        }
        return {
          text: "Evo vegetarijanskih recepata:",
          recipes: vegRecipes.slice(0, 3)
        };
      }
      
      case 'low_calorie': {
        const sorted = [...recipes].sort((a, b) => 
          a.nutritivne_vrijednosti.kalorije - b.nutritivne_vrijednosti.kalorije
        );
        return {
          text: "Evo recepata s najmanje kalorija - savršeni za dijetu:",
          recipes: sorted.slice(0, 3)
        };
      }

      case 'high_calorie': {
        const sorted = [...recipes].sort((a, b) => 
          b.nutritivne_vrijednosti.kalorije - a.nutritivne_vrijednosti.kalorije
        );
        return {
          text: "Evo recepata s puno kalorija - energetski bogato:",
          recipes: sorted.slice(0, 3)
        };
      }
      
      case 'high_protein': {
        const sorted = [...recipes].sort((a, b) => 
          b.nutritivne_vrijednosti.proteini - a.nutritivne_vrijednosti.proteini
        );
        return {
          text: "Evo recepata bogatih proteinima:",
          recipes: sorted.slice(0, 3)
        };
      }

      case 'low_protein': {
        const sorted = [...recipes].sort((a, b) => 
          a.nutritivne_vrijednosti.proteini - b.nutritivne_vrijednosti.proteini
        );
        return {
          text: "Evo recepata s malo proteina:",
          recipes: sorted.slice(0, 3)
        };
      }

      case 'low_carbs': {
        const sorted = [...recipes].sort((a, b) => 
          a.nutritivne_vrijednosti.ugljikohidrati - b.nutritivne_vrijednosti.ugljikohidrati
        );
        return {
          text: "Evo recepata s malo ugljikohidrata:",
          recipes: sorted.slice(0, 3)
        };
      }

      case 'high_carbs': {
        const sorted = [...recipes].sort((a, b) => 
          b.nutritivne_vrijednosti.ugljikohidrati - a.nutritivne_vrijednosti.ugljikohidrati
        );
        return {
          text: "Evo recepata bogatih ugljikohidratima:",
          recipes: sorted.slice(0, 3)
        };
      }

      case 'high_fat': {
        const sorted = [...recipes].sort((a, b) => 
          b.nutritivne_vrijednosti.masti - a.nutritivne_vrijednosti.masti
        );
        return {
          text: "Evo recepata bogatih mašću:",
          recipes: sorted.slice(0, 3)
        };
      }

      case 'low_fat': {
        const sorted = [...recipes].sort((a, b) => 
          a.nutritivne_vrijednosti.masti - b.nutritivne_vrijednosti.masti
        );
        return {
          text: "Evo recepata s malo masti:",
          recipes: sorted.slice(0, 3)
        };
      }
      
      case 'quick': {
        const sorted = [...recipes].sort((a, b) => 
          (a.vrijeme_pripreme + a.vrijeme_kuhanja) - (b.vrijeme_pripreme + b.vrijeme_kuhanja)
        );
        return {
          text: "Evo najbržih recepata - idealno kad nemaš puno vremena:",
          recipes: sorted.slice(0, 3)
        };
      }
      
      case 'category_dessert': {
        const desserts = recipes.filter(r => 
          r.kategorije.some(k => ['deserti', 'slatko', 'čokoladno'].includes(k.toLowerCase()))
        );
        return {
          text: "Mmm, deserti! 🍰 Evo slatkih preporuka:",
          recipes: desserts.slice(0, 5)
        };
      }
      
      case 'category_pasta': {
        const pasta = recipes.filter(r => 
          r.kategorije.some(k => k.toLowerCase().includes('pasta')) ||
          r.ime.toLowerCase().includes('tjestenina') ||
          r.ime.toLowerCase().includes('špaget')
        );
        return {
          text: "Pasta vrijeme! 🍝 Evo preporuka:",
          recipes: pasta.slice(0, 3)
        };
      }
      
      case 'category_meat': {
        const lower = userMessage.toLowerCase();

        // If user asked for a specific meat/ingredient, filter by ingredient/name
        if (/pancet|panceta/i.test(lower)) {
          const matching = recipes.filter(r => 
            r.sastojci.some(s => s.toLowerCase().includes('pancet')) ||
            r.ime.toLowerCase().includes('pancet')
          );
          return { text: "Evo recepata s pancetom:", recipes: matching.slice(0, 5) };
        }

        if (/piletin|piletina/i.test(lower)) {
          const matching = recipes.filter(r => 
            r.sastojci.some(s => s.toLowerCase().includes('piletin')) ||
            r.ime.toLowerCase().includes('piletin')
          );
          return { text: "Evo recepata s piletinom:", recipes: matching.slice(0, 5) };
        }

        if (/govedin|gulaš|gulas|gove(d|đ)/i.test(lower)) {
          const matching = recipes.filter(r => 
            r.sastojci.some(s => s.toLowerCase().includes('goved')) ||
            r.ime.toLowerCase().includes('gula') ||
            r.kategorije.some(k => k.toLowerCase().includes('meso'))
          );
          return { text: "Evo recepta/recepata s govedinom:", recipes: matching.slice(0, 5) };
        }

        // Fallback: return all recipes categorized as meat
        const meat = recipes.filter(r => r.kategorije.some(k => k.toLowerCase().includes('meso')));
        return {
          text: "Evo mesnih recepata za tebe:",
          recipes: meat.slice(0, 5)
        };
      }
      
      case 'category_fish': {
        const fish = recipes.filter(r => 
          r.kategorije.some(k => k.toLowerCase().includes('riba'))
        );
        if (fish.length === 0) {
          return { text: "Nemamo trenutno ribljih recepata, ali mogu preporučiti nešto drugo!" };
        }
        return {
          text: "Evo ribljih recepata:",
          recipes: fish.slice(0, 3)
        };
      }
      
      case 'category_salad': {
        const salads = recipes.filter(r => 
          r.kategorije.some(k => k.toLowerCase().includes('salat'))
        );
        if (salads.length === 0) {
          return { text: "Nemamo trenutno salata, ali mogu preporučiti nešto lagano!" };
        }
        return {
          text: "Evo svježih salata:",
          recipes: salads.slice(0, 3)
        };
      }
      
      case 'category_risotto': {
        const risotto = recipes.filter(r => {
          const name = normalizeText(r.ime);
          const cats = r.kategorije.map(k => normalizeText(k)).join(' ');
          const ings = r.sastojci.map(s => normalizeText(s)).join(' ');

          // detect risotto-like categories/names (handle diacritics)
          // accept: rizot, riza, rizo, rižoto, rizoto etc. (all variations)
          const isRisotto = /riz[oa]t?o?/i.test(name) || /riz[oa]t?o?/i.test(cats);

          // detect mushrooms by common tokens (šampinjon, vrganj, pečurka, gljiv- stem, english tokens)
          const hasMushroom = ings.includes('gljiv') || ings.includes('samp') || ings.includes('sampinj') || ings.includes('vrgan') || ings.includes('pecur') || ings.includes('porcini') || ings.includes('funghi') || ings.includes('mushroom');

          return isRisotto || hasMushroom;
        });

        return {
          text: "Evo rižota i recepata s gljivama:",
          recipes: risotto.slice(0, 5)
        };
      }
      
      case 'ingredient': {
        // Try to detect multiple ingredients from the user's text and prefer recipes that
        // contain all specified ingredients. If none, return grouped results for each ingredient.
        const normText = normalizeText(userMessage);

        // Build token set from recipes (names + ingredients)
        const recipesTokens = new Set<string>();
        recipes.forEach(r => {
          normalizeText(r.ime).split(/\W+/).forEach(t => { if (t.length >= 3) recipesTokens.add(t); });
          r.sastojci.forEach(s => normalizeText(s).split(/\W+/).forEach(t => { if (t.length >= 3) recipesTokens.add(t); }));
        });

        const stemsFor = (token: string) => {
          const stems = new Set<string>();
          stems.add(token);
          if (token.endsWith('om')) stems.add(token.slice(0, -2));
          if (/[aeiou]$/.test(token)) stems.add(token.slice(0, -1));
          const vowels = ['a', 'e', 'i', 'o', 'u'];
          if (/[aeiou]$/.test(token)) {
            const base = token.slice(0, -1);
            vowels.forEach(v => stems.add(base + v));
          } else {
            vowels.forEach(v => stems.add(token + v));
          }
          stems.add(token + 'om');
          stems.add(token + 'u');
          if (token.endsWith('ca')) stems.add(token.slice(0, -2) + 'ac');
          if (token.endsWith('ac')) stems.add(token.slice(0, -2) + 'ca');
          return Array.from(stems);
        };

        // Find which recipe tokens appear in the user's message
        const foundIngredients: string[] = [];

        // First, parse explicit lists like "imam gljive i rajčicu" or "imam gljive, rajčicu i jaja"
        try {
          const lower = userMessage.toLowerCase();
          const explicit = lower.match(/(?:imam|imam li|imam:?)\s+([^?.!]+)/i);
          if (explicit && explicit[1]) {
            const listStr = explicit[1].split(/[?.!]/)[0];
            const parts = listStr.split(/,| i | i, | i\.| i;/i).map(p => p.trim()).filter(Boolean);
            for (const part of parts) {
              const extracted = extractIngredient(part);
              const normExtracted = normalizeText(extracted || part);
              if (normExtracted && !foundIngredients.includes(normExtracted)) foundIngredients.push(normExtracted);
            }
          }
        } catch (e) {
          // parsing failed, continue
        }

        // Then, also detect recipe tokens anywhere in the normalized text
        for (const token of recipesTokens) {
          const stems = stemsFor(token);
          for (const s of stems) {
            if (!s) continue;
            if (normText.includes(s)) {
              if (!foundIngredients.includes(token)) foundIngredients.push(token);
            }
          }
        }

        // Fallback to single-keyword heuristics if nothing found
        if (foundIngredients.length === 0) {
          const fallback = extractIngredient(userMessage);
          const normFallback = normalizeText(fallback);
          if (!normFallback) return { text: `Pokušaj unijeti sastojak ili pitanje (npr. "Imam gljive i rajčicu").` };
          foundIngredients.push(normFallback);
        }

        const matchesTokenInRecipe = (r: Recipe, token: string) => {
          const recipeText = normalizeText(r.ime) + ' ' + r.sastojci.map(s => normalizeText(s)).join(' ');
          const stems = stemsFor(token);
          for (const st of stems) {
            if (!st) continue;
            if (recipeText.includes(st)) return true;
          }
          return false;
        };

        // If user specified multiple ingredients, prefer AND matches
        if (foundIngredients.length >= 2) {
          const andMatches = recipes.filter(r => foundIngredients.every(tok => matchesTokenInRecipe(r, tok)));
          if (andMatches.length > 0) {
            const pretty = foundIngredients.join(' i ');
            return {
              text: `Pronašao sam recepte koji sadrže ${pretty}:`,
              recipes: andMatches.slice(0, 4)
            };
          }

          // If no recipe contains all ingredients, return grouped results per ingredient
          const grouped: { token: string; list: Recipe[] }[] = [];
          const uniqueResults: Recipe[] = [];
          for (const tok of foundIngredients) {
            const list = recipes.filter(r => matchesTokenInRecipe(r, tok));
            grouped.push({ token: tok, list });
            list.forEach(r => { if (!uniqueResults.find(u => u.id === r.id)) uniqueResults.push(r); });
          }

          const first = grouped[0];
          const second = grouped[1];

          // Try to suggest a sensible combined suggestion (e.g. a risotto) if a recipe
          // contains one of the ingredients and also contains rice/riž- tokens.
          let comboSuggestion: string | null = null;
          for (const r of recipes) {
            const name = normalizeText(r.ime);
            const ingText = r.sastojci.map(s => normalizeText(s)).join(' ');
            if ((name.includes('riz') || name.includes('rizo') || ingText.includes('riza') || ingText.includes('arborio')) && foundIngredients.some(tok => matchesTokenInRecipe(r, tok))) {
              comboSuggestion = r.ime;
              break;
            }
          }

          const responseLines: string[] = [];
          responseLines.push(`Nisam našao recepte koji sadrže sve navedene sastojke odjednom.`);
          if (comboSuggestion) {
            responseLines.push(`Možeš, primjerice, pripremiti "${comboSuggestion}" (ako imaš rižu i gljive) i poslužiti ga s rajčicom kao prilog.`);
          }

          // List grouped results per detected ingredient for clarity
          if (first) {
            responseLines.push(`
Evo recepata koji sadrže "${first.token}":`);
            if (first.list.length === 0) responseLines.push(`(Nema recepata s ${first.token})`);
          }
          if (second) {
            responseLines.push(`
Evo recepata koji sadrže "${second.token}":`);
            if (second.list.length === 0) responseLines.push(`(Nema recepata s ${second.token})`);
          }

          return {
            text: responseLines.join('\n'),
            recipes: uniqueResults.slice(0, 6)
          };
        }

        // Single ingredient path
        const single = foundIngredients[0];
        const singleMatches = recipes.filter(r => matchesTokenInRecipe(r, single));
        if (singleMatches.length === 0) {
          return { text: `Nažalost, nisam pronašao recepte s "${single}". Probaj nešto drugo!` };
        }

        const isChocolate = single.includes('cokolad');
        const responseText = isChocolate ? 'Pronašao sam nešto čokoladno za tebe:' : `Evo recepata koji sadrže "${single}":`;
        return { text: responseText, recipes: singleMatches.slice(0, 4) };
      }
      
      case 'help':
        return {
          text: `Evo kratki vodič što sve mogu i kako me najbolje pitati:\n\n🔎 Pretraživanje recepata:\n• Po kategoriji: "Daj mi deserte" ili "pasta"\n• Po sastojku: "Imam tikvice i rajčicu" ili "s čokoladom"\n• Po prehrani: "Vegan" / "Bez glutena" / "Vegetarijanski"\n• Po nutritivnim željama: "više proteina", "malo ugljikohidrata", "nisko-kalorično"\n• Ako kažeš samo sastojak, pronaći ću recepte koji ga sadrže.\n\n⭐ Ostale mogućnosti:\n• Otvori recept i možeš ga ocijeniti ili ostaviti komentar\n• Posjeti Galeriju za slike jela\n\nAko želiš, napiši: "Što mogu tražiti?" ili probaj jedan od primjera iznad.`
        };
      
      case 'rate':
        return {
          text: "Za ocjenjivanje recepta, otvori stranicu recepta i klikni na zvjezdice! Tvoja ocjena će se automatski spremiti i prikazati prosjek svih ocjena. ⭐"
        };
      
      case 'comment':
        return {
          text: "Za dodavanje komentara, otvori stranicu recepta i pronađi sekciju za komentare na dnu. Upiši svoje ime i komentar, pa klikni 'Dodaj komentar'! 💬"
        };
      
      case 'gallery':
        return {
          text: "Galeriju možeš pronaći u navigaciji na vrhu stranice. Tamo ćeš vidjeti prekrasne slike naših jela! 📸\n\n👉 Klikni na 'Galerija' u meniju."
        };
      
      case 'all_recipes': {
        return {
          text: `Imamo ukupno ${recipes.length} recepata! Evo nekih popularnih:`,
          recipes: recipes.slice(0, 4)
        };
      }
      
      default:
        const searchTerm = userMessage.toLowerCase();
        const found = recipes.filter(r => 
          r.ime.toLowerCase().includes(searchTerm) ||
          r.kategorije.some(k => k.toLowerCase().includes(searchTerm)) ||
          r.sastojci.some(s => s.toLowerCase().includes(searchTerm))
        );
        
        if (found.length > 0) {
          return {
            text: "Pronašao sam nešto za tebe:",
            recipes: found.slice(0, 3)
          };
        }
        
        return {
          text: `Nisam siguran što točno želiš — rado ću pomoći! 🤝\n\nPokušaj s jednim od ovih primjera:\n• "Daj mi nešto slatko"\n• "Imam piletinu i rižu"\n• "Pokaži najnovije"\n• "Trebam nešto bez glutena"\n\nTakođer možeš napisati samo sastojak (npr. "kava" ili "čokolada") i ja ću potražiti recepte koji ga koriste.`
        };
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // After adding the user's message, scroll so the user's message is near the top
    // Use a small timeout to let React render the new message element
    setTimeout(() => {
      const rootEl = scrollRef.current as HTMLElement | null;
      if (!rootEl) return;
      const viewport = rootEl.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
      const elToScroll = viewport ?? rootEl;
      const container = elToScroll.querySelector('.space-y-4') as HTMLElement | null;
      const msgEl = container ? container.querySelector(`[data-msg-id="${userMessage.id}"]`) as HTMLElement | null : null;
      const paddingTop = 8;
      if (msgEl) {
        let target = Math.max(0, msgEl.offsetTop - paddingTop);
        const maxScroll = elToScroll.scrollHeight - elToScroll.clientHeight;
        if (target > maxScroll) target = maxScroll;
        elToScroll.scrollTop = target;
      } else {
        elToScroll.scrollTop = elToScroll.scrollHeight;
      }
    }, 60);
    
    setTimeout(() => {
      const response = generateResponse(input);
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        isBot: true,
        recipes: response.recipes,
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Calculate realistic rotation: full rotation (360°) = circumference movement
  // Diabeto diameter ~64px (w-16 h-16), so circumference ≈ 64 * π ≈ 201px
  // Movement of 1px = 360 / 201 ≈ 1.79° rotation
  const DIABETO_DIAMETER = 64;
  const CIRCUMFERENCE = DIABETO_DIAMETER * Math.PI;
  const rotation = (((rollPosition - -100) / CIRCUMFERENCE) * 360) % 360;

  return (
    <>
      {/* Smoke particles */}
      {isRolling && smokeParticles.map(p => (
        <div
          key={p.id}
          className="fixed z-[60] pointer-events-none"
          style={{
            left: p.x,
            bottom: 80 + p.y,
            opacity: p.opacity,
            transform: `scale(${1 + (1 - p.opacity)})`,
          }}
        >
          <div className="w-6 h-6 rounded-full bg-gray-300/60" />
        </div>
      ))}

      {/* Rolling Diabeto Animation */}
      {isRolling && (
        <div
          className="fixed z-[60] bottom-6"
          style={{ 
            transform: `translate3d(${rollPosition}px, 0, 0) rotate(${rotation}deg)`,
            willChange: 'transform'
          }}
        >
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary">
            <img src={diabetoImage} alt="Dijabeto" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Roller utterance (breath) shown after rolling finishes */}
      {rollerSpeech && !isOpen && (
        <div className="fixed z-[61]" style={{ left: rollPosition + 36, bottom: 86 }}>
          <div className="bg-white text-sm px-3 py-1 rounded-full border-2 border-primary shadow-md">
            {rollerSpeech}
          </div>
        </div>
      )}

      {/* Speech Bubble */}
      {showSpeechBubble && !isOpen && (
        <div 
          className="fixed z-[60] bottom-28 right-6 max-w-xs animate-bounce-in"
          onClick={() => {
            setShowSpeechBubble(false);
            setIsOpen(true);
          }}
        >
          <div className="relative bg-white rounded-2xl p-4 shadow-xl border-[3px] border-primary cursor-pointer hover:scale-105 transition-transform">
            <p className="font-display text-lg text-primary">
              Bok! Ja sam Dijabeto! 👋
            </p>
            <p className="font-body text-sm text-foreground/80 mt-1">
              Klikni me da ti pomognem pronaći savršeni recept! 🍳
            </p>
            {/* Speech bubble tail */}
            <div 
              className="absolute -bottom-3 right-8 w-6 h-6 bg-white border-r-[3px] border-b-[3px] border-primary"
              style={{ transform: 'rotate(45deg)' }}
            />
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isRolling && (
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowSpeechBubble(false);
          }}
          className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary shadow-lg overflow-hidden border-4 border-secondary transition-all duration-300 ${
            bounceCount > 0 && bounceCount <= 3 ? 'animate-bounce' : 'hover:scale-110'
          }`}
          style={{
            boxShadow: '4px 4px 0px hsl(var(--foreground) / 0.3)',
          }}
          aria-label="Otvori Dijabeto chat"
        >
          {isOpen ? (
            <X className="w-8 h-8 text-primary-foreground mx-auto" />
          ) : (
            <img src={diabetoImage} alt="Dijabeto" className="w-full h-full object-cover" />
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] bg-card rounded-2xl shadow-2xl border-[3px] border-primary flex flex-col overflow-hidden" style={{ boxShadow: '6px 6px 0px hsl(var(--foreground) / 0.2)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 flex items-center gap-3 border-b-[3px] border-primary/50">
            <img 
              src={diabetoImage} 
              alt="Dijabeto" 
              className="w-12 h-12 rounded-full border-[3px] border-secondary object-cover"
            />
            <div className="flex-1">
              <h3 className="font-display text-xl text-primary-foreground tracking-wide">DIJABETO</h3>
              <p className="text-primary-foreground/80 text-sm font-body">Kulinarski asistent</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground p-1 hover:bg-primary-foreground/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} data-msg-id={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] ${msg.isBot ? 'order-2' : ''}`}>
                    {msg.isBot && (
                      <img 
                        src={diabetoImage} 
                        alt="Dijabeto" 
                        className="w-8 h-8 rounded-full mb-1 object-cover border-2 border-primary"
                      />
                    )}
                    <div 
                      className={`rounded-2xl px-4 py-2 border-2 ${
                        msg.isBot 
                          ? 'bg-muted text-foreground rounded-tl-sm border-primary/30' 
                          : 'bg-primary text-primary-foreground rounded-tr-sm border-primary'
                      }`}
                      style={{
                        boxShadow: msg.isBot ? '2px 2px 0px hsl(var(--primary) / 0.2)' : '2px 2px 0px hsl(var(--foreground) / 0.2)'
                      }}
                    >
                      <p className="whitespace-pre-line text-sm font-body">{msg.text}</p>
                    </div>
                    
                    {/* Recipe Cards */}
                    {msg.recipes && msg.recipes.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.recipes.map((recipe) => (
                          <Link 
                            key={recipe.id} 
                            to={`/recept/${recipe.id}`}
                            onClick={() => setIsOpen(false)}
                            className="block"
                          >
                            <div className="bg-card border-2 border-primary/40 rounded-xl p-3 hover:border-primary hover:shadow-md transition-all hover:-translate-y-0.5" style={{ boxShadow: '3px 3px 0px hsl(var(--primary) / 0.15)' }}>
                              <h4 className="font-display text-base text-primary">{recipe.ime}</h4>
                              <div className="flex items-center gap-2 mt-1 text-xs font-body text-muted-foreground">
                                <span>⏱️ {recipe.vrijeme_pripreme + recipe.vrijeme_kuhanja} min</span>
                                <span>•</span>
                                <span>⭐ {getAverageRating(recipe.ocjene).toFixed(1)}</span>
                                {recipe.vegan && <span className="text-green-600">🌱</span>}
                                {recipe.gluten_free && <span className="text-amber-600">🌾</span>}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {recipe.kategorije.slice(0, 2).map((kat) => (
                                  <span key={kat} className="text-[10px] bg-secondary/50 text-foreground px-2 py-0.5 rounded-full font-body border border-primary/20">
                                    {kat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-2 rounded-tl-sm border-2 border-primary/30">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t-[3px] border-primary/30 bg-muted/30">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pitaj me nešto..."
                className="flex-1 border-2 border-primary/40 focus:border-primary rounded-xl font-body"
              />
              <Button 
                onClick={handleSend} 
                size="icon"
                className="rounded-xl border-2 border-primary cartoon-button"
                style={{ boxShadow: '2px 2px 0px hsl(var(--foreground) / 0.2)' }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiabetoChatbot;
