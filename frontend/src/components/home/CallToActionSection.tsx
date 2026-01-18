import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CallToActionSection = () => {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">

      {/* Texture africaine subtile (fond uniquement) */}
      <div className="absolute inset-0 opacity-[0.06]">
        <img
          src="https://img.freepik.com/free-vector/ethnic-seamless-pattern-background-black-white-aztec-design-vector_53876-154221.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay de profondeur pour le contraste */}
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">

          {/* Titre */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Prêt à rejoindre la communauté <br />
            <span className="text-white/90">panafricaine du savoir&nbsp;?</span>
          </h2>

          {/* Texte */}
          <p className="text-lg lg:text-xl text-white/85 mb-12 max-w-3xl mx-auto leading-relaxed">
            Partagez vos recherches, découvrez de nouveaux savoirs,
            contribuez à <strong>Griote&nbsp;AI</strong> et accédez aux meilleures
            opportunités académiques et technologiques.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">

            {/* CTA principal */}
            <Button
              size="lg"
              className="text-lg px-10 py-6 font-semibold bg-white text-primary hover:bg-accent/90"
              asChild
            >
              <Link to="/inscription">
                Créer un compte maintenant
              </Link>
            </Button>

            {/* CTA secondaire */}
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 font-semibold border-white/70 text-foreground hover:bg-white/10 hover:border-white"
              asChild
            >
              <Link to="/a-propos" className="inline-flex items-center gap-3">
                En savoir plus
                <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
