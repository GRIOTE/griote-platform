import React from 'react';
import { ArrowRight, Sparkles } from "lucide-react";

export default function JoinMovementSection() {
  return (
    <section className="relative py-24 lg:py-36 bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Contenu central */}
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Titre */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 text-black leading-tight">
            Rejoignez le mouvement
          </h2>
          
          {/* Sous-titre */}
          <p className="text-2xl lg:text-3xl text-black/70 mb-16 max-w-3xl mx-auto leading-relaxed">
            Explorez, partagez et construisez l'avenir du savoir africain
          </p>

          {/* Grand bouton CTA */}
          <div>
            <a
              href="/recherche"
              className="group inline-flex items-center gap-6 text-2xl lg:text-3xl font-black text-black px-12 py-8 rounded-3xl bg-white hover:bg-white/95 shadow-2xl hover:shadow-[0_30px_80px_rgba(0,0,0,0.35)] transition-all duration-500 transform hover:scale-105"
            >
              <Sparkles className="w-10 h-10 lg:w-12 lg:h-12 group-hover:rotate-12 transition-transform duration-500" strokeWidth={2.5} />
              <span>Commencer à explorer</span>
              <ArrowRight className="w-10 h-10 lg:w-12 lg:h-12 group-hover:translate-x-3 transition-transform duration-500" strokeWidth={2.5} />
            </a>
          </div>

          {/* Petit texte en dessous */}
          <p className="mt-12 text-lg lg:text-xl text-black/60">
            Découvrez des milliers de travaux, opportunités et projets africains
          </p>

        </div>

      </div>
    </section>
  );
}