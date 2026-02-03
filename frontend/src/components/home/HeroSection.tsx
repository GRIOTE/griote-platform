import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import grioteImage from "../../assets/griote.jpg";

export const HeroSection = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full py-12 lg:py-20 overflow-hidden min-h-screen  ">
      {/* Container principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* ==================== COLONNE GAUCHE : Titre + CTA ==================== */}
          <div
            className={`space-y-8 text-center lg:text-left transition-all duration-1000 ${
              fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Titre */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
              Bâtir la souveraineté africaine
              <br />
              <span className="text-primary underline underline-offset-4 decoration-accent decoration-2">
                à partir de nos propres savoirs
              </span>
            </h1>

            {/* BOUTON CTA */}
            <div className="flex justify-center lg:justify-start">
              <Link to="/depots" className="z-20">
                <Button
                  size="lg"
                  className="px-10 py-6 bg-accent text-black font-bold text-lg rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-primary"
                >
                  Explorer nos dépôts
                </Button>
              </Link>
            </div>
          </div>

          {/* ==================== COLONNE DROITE : Image + Citation ==================== */}
          <div className="flex flex-col items-center space-y-6 max-h-[80vh] overflow-hidden relative z-10">
            {/* Image */}
            <div
              className={`w-full max-w-lg transition-all duration-1000 delay-200 ${
                fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ maxHeight: "60vh", overflow: "hidden" }}
            >
              <img
                src={grioteImage}
                alt="Sage africain - Gardien de la tradition orale"
                className="w-full h-auto rounded-2xl shadow-2xl border-4 border-primary/20 object-cover"
                style={{
                  filter: "sepia(8%) saturate(130%) brightness(105%) contrast(108%)",
                  maxHeight: "100%",
                }}
              />
            </div>

            {/* Citation */}
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
