import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import grioteImage from "@/assets/griote.jpg";

interface HeroSectionProps {
  isAuthenticated?: boolean;
}

export const HeroSection = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full py-12 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* ==================== COLONNE GAUCHE : TEXTE + BOUTON ==================== */}
          <div
            className={`space-y-8 lg:space-y-12 text-center lg:text-left transition-all duration-1000 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
                Bâtir la souveraineté africaine<br />
                <span className="text-primary underline underline-offset-4 decoration-accent decoration-2">à partir de nos propres savoirs</span>
              </h1>


              <p className="text-lg sm:text-xl text-foreground/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Griote Foundation révèle, organise et valorise les travaux académiques africains
                pour qu’ils deviennent une force d’innovation, d’opportunités et de souveraineté.
              </p>
            </div>

            {/* BOUTON JAUNE SOUS LE TEXTE (à gauche sur desktop, centré sur mobile) */}
            <div className="flex justify-center lg:justify-start">
              <Link to="/recherche">
                <Button
                  size="lg"
                  className="px-10 py-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Explorer nos dépôts
                </Button>
              </Link>
            </div>
          </div>

          {/* ==================== COLONNE DROITE : IMAGE + CITATION ==================== */}
          <div className="flex flex-col items-center space-y-8">
            {/* Image */}
            <div
              className={`w-full max-w-lg transition-all duration-1000 delay-200 ${fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
            >
              <img
                src={grioteImage}
                alt="Sage africain - Gardien de la tradition orale"
                className="w-full h-auto rounded-2xl shadow-2xl border-4 border-primary/20 object-cover"
                style={{
                  filter: "sepia(8%) saturate(130%) brightness(105%) contrast(108%)",
                }}
              />
            </div>

            {/* Citation bien en dessous de l’image */}
            <div className="text-center max-w-md">
              <p className="text-lg italic text-foreground/80">
                “La mémoire des ancêtres éclaire le chemin de nos savoirs.”
              </p>
              <p className="text-sm text-foreground/60 mt-2">— Griote & Coaue</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;