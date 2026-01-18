import React from "react";
import {
  Archive,
  Megaphone,
  Code2,
  BrainCircuit,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EcosystemSection() {
  return (
    <section className="py-16 lg:py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Titre */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Un écosystème au service <br />
            <span className="text-primary">
              de la souveraineté du savoir africain
            </span>
          </h2>
          <p className="mt-8 text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto">
            Une plateforme qui révèle, organise et valorise la connaissance
            produite par et pour l’Afrique.
          </p>
        </div>

        {/* === STRUCTURE PRINCIPALE : FLEX HORIZONTAL === */}
        <div className="max-w-7xl mx-auto lg:flex gap-8 items-stretch">

          {/* ===================== */}
          {/* COLONNE GAUCHE */}
          {/* ===================== */}
          <Card className="lg:flex-1 flex flex-col h-full bg-gradient-to-br from-primary/95 to-blue-800/95 text-white shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-black/5" />

            <CardHeader className="p-8 lg:p-12 relative z-10">
              <Archive className="w-16 h-16 mb-6" />
              <CardTitle className="text-3xl lg:text-4xl font-bold">
                Dépôts de connaissances
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8 lg:p-12 pt-0 relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <CardDescription className="text-lg lg:text-xl text-white/90 leading-relaxed mb-8">
                  Thèses, mémoires, rapports académiques et professionnels,
                  projets, datasets, cours… Toute la connaissance africaine
                  devient visible, citée et réutilisable.
                </CardDescription>

                <ul className="space-y-3 text-base lg:text-lg text-white/95">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    Accès ouvert à tous
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    Souveraineté de la connaissance
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    Valorisation des savoirs locaux
                  </li>
                </ul>
              </div>

              {/* Illustration basse */}
              <div className="mt-10 relative h-64 lg:h-80 -mx-8 lg:-mx-12 -mb-8 lg:-mb-12">
                <img
                  src="https://thumbs.dreamstime.com/b/academic-sanctuary-library-open-textbooks-bookshelves-academic-sanctuary-library-open-textbooks-bookshelves-293461384.jpg"
                  alt="Dépôt de connaissances"
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              </div>
            </CardContent>
          </Card>

          {/* ===================== */}
          {/* COLONNE DROITE */}
          {/* ===================== */}
          <div className="lg:flex-1 flex flex-col">

            {/* ===== ZONE HAUTE : même hauteur que la carte gauche ===== */}
            <div className="flex-1 flex flex-col gap-8">

              {/* Ligne 1 */}
              <div className="flex gap-8 flex-1">

                {/* Opportunités */}
                <Card className="flex-1 flex flex-col shadow-lg">
                  <CardHeader className="p-6 lg:p-8">
                    <Megaphone className="w-12 h-12 mb-4 text-primary" />
                    <CardTitle className="text-2xl lg:text-3xl font-bold">
                      Opportunités ciblées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 lg:p-8 pt-0">
                    <CardDescription className="mb-6">
                      Bourses, appels à projets et collaborations stratégiques.
                    </CardDescription>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Bourses et financements
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Recherche indépendante
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Réseau continental
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Open source */}
                <Card className="flex-1 flex flex-col shadow-lg">
                  <CardHeader className="p-6 lg:p-8">
                    <Code2 className="w-12 h-12 mb-4 text-primary" />
                    <CardTitle className="text-2xl lg:text-3xl font-bold">
                      Projets open source
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 lg:p-8 pt-0">
                    <CardDescription className="mb-6">
                      Logiciels ouverts conçus pour les réalités africaines.
                    </CardDescription>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Collaboration ouverte
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Outils souverains
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Innovation locale
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Ligne 2 */}
              <Card className="shadow-lg bg-accent">
                <CardHeader className="p-6 lg:p-8">
                  <BrainCircuit className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle className="text-2xl lg:text-3xl font-bold">
                    Griote AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 lg:p-8 pt-0">
                  <CardDescription className="mb-6">
                    Une intelligence artificielle entraînée sur nos savoirs,
                    nos langues et nos contextes culturels.
                  </CardDescription>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      IA contextualisée
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Langues africaines
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Savoirs traditionnels et modernes
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>

        {/* ===== CTA ===== */}
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 font-semibold"
                asChild
              >
                <a
                  href="/projets-open-source"
                  className="inline-flex items-center gap-3"
                >
                  Découvrir nos projets open source
                  <ArrowRight className="w-6 h-6" />
                </a>
              </Button>
            </div>
      </div>
    </section>
  );
}
