import React from "react";
import { Archive, Megaphone, Code2, BrainCircuit, ArrowRight } from "lucide-react";

export default function EcosystemSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Titre principal */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight">
            Un écosystème au service<br />
            <span className="text-blue-600">de la souveraineté du savoir africain</span>
          </h2>
          <p className="mt-6 text-lg lg:text-xl text-foreground/70">
            Une plateforme qui révèle, organise et valorise la connaissance produite par et pour l’Afrique.
          </p>
        </div>

        {/* LE BLOC PRINCIPAL – Dépôts = dominant visuellement */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-border/30">

            {/* === PILIER 1 : DÉPÔTS – TRÈS GRAND, IMPOSANT === */}
            <div className="lg:col-span-7 bg-gradient-to-br from-blue-600 to-blue-700 p-10 lg:p-16 flex flex-col justify-center text-white">
              <Archive className="w-20 h-20 lg:w-24 lg:h-24 mb-8" />
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">
                Dépôts de connaissances
              </h3>
              <p className="text-lg lg:text-xl leading-relaxed max-w-2xl">
                Thèses, mémoires, rapports académiques et professionnels, projets, datasets, cours…<br />
                Toute la connaissance africaine devient enfin visible, citée, réutilisée et valorisée.
              </p>
            </div>

            {/* === LES 3 AUTRES PILIERS – alignés à droite, même hauteur === */}
            <div className="lg:col-span-5 grid grid-rows-3">

              {/* Opportunités – jaune */}
              <div className="bg-yellow-500 p-8 lg:p-10 flex flex-col justify-center border-b border-black/10">
                <Megaphone className="w-14 h-14 mb-5 text-black" />
                <h4 className="text-2xl lg:text-3xl font-black mb-3 text-black">Opportunités ciblées</h4>
                <p className="text-base lg:text-lg text-black/90">
                  Bourses, appels à projets, missions et collaborations sélectionnées pour les talents africains.
                </p>
              </div>

              {/* Projets open source – noir */}
              <div className="bg-foreground p-8 lg:p-10 flex flex-col justify-center border-b border-white/10">
                <Code2 className="w-14 h-14 mb-5 text-white" />
                <h4 className="text-2xl lg:text-3xl font-black mb-3 text-white">Projets open source</h4>
                <p className="text-base lg:text-lg text-white/90">
                  Solutions ouvertes développées pour et par l’Afrique, pour une souveraineté numérique réelle.
                </p>
              </div>

              {/* Griote AI – blue */}
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 lg:p-10 flex flex-col justify-center">
                <BrainCircuit className="w-14 h-14 mb-5 text-white" />
                <h4 className="text-2xl lg:text-3xl font-black mb-3 text-white">Griote AI</h4>
                <p className="text-base lg:text-lg text-white/90">
                  L'intelligence artificielle du futur : entraînée sur nos savoirs, en nos langues, pour nos réalités.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Lien open source – élégant et expressif */}
        <div className="text-center mt-16">
          <a
            href="/projets-open-source"
            className="inline-flex items-center gap-4 text-xl lg:text-2xl font-bold text-blue-600 hover:text-blue-700 group transition-all"
          >
            Découvrir nos projets open source en cours
            <ArrowRight className="w-10 h-10 group-hover:translate-x-6 transition-transform duration-300" />
          </a>
        </div>

      </div>
    </section>
  );
}