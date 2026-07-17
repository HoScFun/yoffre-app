import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout>
      <div className="container py-24 text-center">
        <h1 className="text-5xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-muted-foreground mb-8">Cette page n&apos;existe pas ou a été déplacée.</p>
        <Link href="/">
          <Button>Retour à l&apos;accueil</Button>
        </Link>
      </div>
    </Layout>
  );
}
