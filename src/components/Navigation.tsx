import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/recepti", label: "Recepti" },
  { href: "/galerija", label: "Galerija" },
  { href: "/about", label: "About" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/analytics", label: "Analitika" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b-[4px] border-primary bg-gradient-to-r from-secondary/30 via-background to-secondary/30" style={{ boxShadow: '0 4px 0px hsl(210 90% 42% / 0.4)' }}>
      <div className="container mx-auto px-4">
        <div className="flex h-28 items-center justify-center">
          {/* Centered container with logo left and nav items */}
          <div className="flex items-center gap-24 md:gap-40">
            {/* Logo - Family Guy style */}
            <Link to="/" className="flex flex-col items-center group">
              <span 
                className="font-logo text-2xl md:text-3xl leading-none transition-transform group-hover:scale-105"
                style={{
                  color: 'hsl(var(--primary))',
                  textShadow: '2px 2px 0px hsl(var(--secondary)), 3px 3px 0px hsl(var(--foreground) / 0.2)',
                }}
              >
                DIJABETOVA
              </span>
              <span 
                className="font-logo text-xl md:text-2xl leading-none -mt-1 transition-transform group-hover:scale-105"
                style={{
                  color: 'hsl(var(--secondary))',
                  textShadow: '1px 1px 0px hsl(var(--primary)), 2px 2px 0px hsl(var(--foreground) / 0.2)',
                }}
              >
                KUHARICA
              </span>
            </Link>

            {/* Nav items - cartoon style (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "font-display text-base uppercase tracking-wider px-4 py-2 rounded-xl border-[3px] transition-all duration-150",
                    location.pathname === link.href
                      ? "bg-primary text-primary-foreground border-primary/80 shadow-[3px_3px_0px_hsl(var(--foreground)/0.3)]"
                      : "bg-card text-foreground border-foreground/30 hover:border-primary hover:bg-secondary/30 hover:shadow-[3px_3px_0px_hsl(var(--primary)/0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="absolute right-4 md:hidden p-3 text-foreground bg-secondary rounded-xl border-[3px] border-foreground/50 cartoon-button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t-[3px] border-primary/50 py-6 bg-card/80 rounded-b-2xl">
            <div className="flex flex-col items-center gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "font-display text-lg uppercase tracking-wider px-6 py-3 rounded-xl border-[3px] transition-all w-4/5 text-center",
                    location.pathname === link.href
                      ? "bg-primary text-primary-foreground border-primary/80"
                      : "bg-card text-foreground border-foreground/30"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;