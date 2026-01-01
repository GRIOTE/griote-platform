import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function FaqSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Questions fréquentes
          </h2>
          <p className="mt-2 text-lg text-foreground/70">
            Les réponses aux questions que l’on nous pose le plus souvent.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="faq-1">
            <AccordionTrigger className="text-primary font-semibold">
              Qu’est-ce que Griote ?
            </AccordionTrigger>
            <AccordionContent className="bg-card p-4 rounded-md text-foreground/90">
              Griote est une plateforme panafricaine pour publier, partager et valoriser les savoirs africains.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2">
            <AccordionTrigger className="text-primary font-semibold">
              Faut-il un compte pour accéder aux contenus ?
            </AccordionTrigger>
            <AccordionContent className="bg-card p-4 rounded-md text-foreground/90">
              Non, la majorité des contenus sont accessibles librement. Un compte est nécessaire pour publier ou interagir.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3">
            <AccordionTrigger className="text-primary font-semibold">
              Quels types de contenus puis-je publier ?
            </AccordionTrigger>
            <AccordionContent className="bg-card p-4 rounded-md text-foreground/90">
              Thèses, mémoires, rapports, projets techniques, datasets, cours, articles et ressources open source.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4">
            <AccordionTrigger className="text-primary font-semibold">
              Comment contribuer aux projets open source ?
            </AccordionTrigger>
            <AccordionContent className="bg-card p-4 rounded-md text-foreground/90">
              Chaque projet dispose d’une page avec les instructions et liens vers les dépôts Git pour contribuer.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-5">
            <AccordionTrigger className="text-primary font-semibold">
              Comment contacter l’équipe Griote ?
            </AccordionTrigger>
            <AccordionContent className="bg-card p-4 rounded-md text-foreground/90">
              Vous pouvez nous contacter via le bouton “Contacter la fondation” ou par email : contact@griote.foundation.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
    </section>
  )
}
