import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { Mail, TrendingUp, Scale, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Newsletter Yoffre — taux de crédit, conseils juridiques, nouveautés produit",
  description:
    "Inscrivez-vous à la newsletter Yoffre : point mensuel sur les taux de crédit immobilier, conseils juridiques sourcés sur l'offre d'achat, et nouveautés du produit. Gratuit, désinscription en un clic.",
  alternates: { canonical: "/newsletter" },
};

const highlights = [
  {
    icon: TrendingUp,
    title: "Le point taux du mois",
    desc: "Une synthèse des barèmes de crédit immobilier, sourcée auprès des observatoires du marché.",
  },
  {
    icon: Scale,
    title: "Un conseil juridique sourcé",
    desc: "Conditions suspensives, délai de rétractation, contre-offre : les points clés de nos guides, expliqués simplement.",
  },
  {
    icon: Sparkles,
    title: "Les nouveautés Yoffre",
    desc: "Ce qui change dans le formulaire d'offre d'achat, au fur et à mesure des mises à jour du produit.",
  },
];

export default function NewsletterPage() {
  return (
    <Layout>
      <section className="py-16 md:py-20">
        <div className="container max-w-lg mx-auto">
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight mb-4">
              La newsletter Yoffre
            </h1>
            <p className="text-muted-foreground">
              Une fois par mois environ : taux de crédit, conseils juridiques sourcés et
              nouveautés produit. Pas de spam, désinscription en un clic.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 md:p-8 shadow-sm mb-10">
            <NewsletterForm />
          </div>

          <div className="grid gap-4">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <h.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{h.title}</p>
                  <p className="text-sm text-muted-foreground">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs text-muted-foreground text-center">
            En vous inscrivant, vous consentez à recevoir la newsletter Yoffre par email. Vos
            données sont traitées conformément à notre{" "}
            <a href="/confidentialite" className="text-primary hover:underline">
              politique de confidentialité
            </a>{" "}
            et ne sont jamais partagées à des tiers à des fins commerciales.
          </p>
        </div>
      </section>
    </Layout>
  );
}
