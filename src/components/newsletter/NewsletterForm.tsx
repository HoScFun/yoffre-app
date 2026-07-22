"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      setErrorMessage("Merci de renseigner une adresse email valide.");
      return;
    }
    if (!consent) {
      setStatus("error");
      setErrorMessage("Merci de cocher la case de consentement pour vous inscrire.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const { error } = await supabase.functions.invoke("newsletter-subscribe", {
      body: { email, source: "page-newsletter" },
    });

    if (error) {
      setStatus("error");
      setErrorMessage("Une erreur est survenue. Réessayez dans quelques instants.");
      return;
    }

    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border bg-secondary/40 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-accent" />
        <p className="text-sm font-medium text-foreground">Inscription bien prise en compte !</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Vous recevrez notre prochaine newsletter à l&apos;adresse {email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="newsletter-email">Adresse email</Label>
        <Input
          id="newsletter-email"
          type="email"
          placeholder="vous@exemple.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1.5"
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="newsletter-consent"
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked === true)}
          className="mt-0.5"
        />
        <Label htmlFor="newsletter-consent" className="text-xs font-normal leading-relaxed text-muted-foreground">
          J&apos;accepte de recevoir la newsletter Yoffre par email (actualité du crédit
          immobilier, conseils juridiques, nouveautés produit). Désinscription possible à tout
          moment via le lien présent dans chaque email. Voir notre{" "}
          <a href="/confidentialite" className="text-primary hover:underline">
            politique de confidentialité
          </a>
          .
        </Label>
      </div>

      {status === "error" && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}

      <Button type="submit" size="lg" className="w-full font-semibold" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inscription…
          </>
        ) : (
          "S'inscrire à la newsletter"
        )}
      </Button>
    </form>
  );
}
