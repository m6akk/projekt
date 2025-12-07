import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Recepti from "./pages/Recepti";
import RecipeDetail from "./pages/RecipeDetail";
import Galerija from "./pages/Galerija";
import About from "./pages/About";
import Kontakt from "./pages/Kontakt";
import NotFound from "./pages/NotFound";
import DiabetoChatbot from "./components/DiabetoChatbot";
import SplashScreen from "./components/SplashScreen";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => {
  // Initialize splash visibility from sessionStorage to avoid showing on refresh
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem('hasSeenSplash');
    } catch (e) {
      return true;
    }
  });
  const [hasSeenSplash, setHasSeenSplash] = useState(() => {
    try {
      return !!sessionStorage.getItem('hasSeenSplash');
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    // Check if user has already seen splash
    const seen = sessionStorage.getItem('hasSeenSplash');
    if (seen) {
      setShowSplash(false);
      setHasSeenSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasSeenSplash(true);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && !hasSeenSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
        <div className={showSplash && !hasSeenSplash ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/recepti" element={<Recepti />} />
              <Route path="/recept/:id" element={<RecipeDetail />} />
              <Route path="/galerija" element={<Galerija />} />
              <Route path="/about" element={<About />} />
              <Route path="/kontakt" element={<Kontakt />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <DiabetoChatbot />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
