import Script from "next/script";

/**
 * Point de connexion analytics — souverain et désactivé par défaut.
 *
 * Ne rend RIEN tant qu'aucun fournisseur n'est configuré. Pour l'activer plus
 * tard, il suffit de poser des variables d'environnement (dans la console Clever
 * Cloud), sans toucher au code :
 *
 *   Matomo (auto-hébergé ou Matomo Cloud FR) :
 *     NEXT_PUBLIC_ANALYTICS_PROVIDER=matomo
 *     NEXT_PUBLIC_MATOMO_URL=https://analytics.yoffre.fr      (sans slash final)
 *     NEXT_PUBLIC_MATOMO_SITE_ID=1
 *
 *   Plausible (UE, ou auto-hébergé) :
 *     NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible
 *     NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yoffre.fr
 *     NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js   (optionnel : URL du script si auto-hébergé)
 *
 * Choix souverains : Matomo (français) et Plausible (UE). On évite volontairement
 * Google Analytics / Vercel Analytics. Matomo est configuré ici en mode SANS
 * cookie (disableCookies) → pas de bandeau de consentement requis (cf. CNIL),
 * cohérent avec la posture RGPD de Yoffre.
 */
export function Analytics() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;

  if (provider === "matomo") {
    const url = process.env.NEXT_PUBLIC_MATOMO_URL;
    const siteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;
    if (!url || !siteId) return null;
    const base = url.replace(/\/$/, "");
    return (
      <Script id="matomo-analytics" strategy="afterInteractive">
        {`
          var _paq = window._paq = window._paq || [];
          _paq.push(['disableCookies']);
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="${base}/";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '${siteId}']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
          })();
        `}
      </Script>
    );
  }

  if (provider === "plausible") {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    if (!domain) return null;
    const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";
    return (
      <Script
        id="plausible-analytics"
        strategy="afterInteractive"
        data-domain={domain}
        src={src}
        defer
      />
    );
  }

  // Aucun fournisseur configuré → aucun tracking.
  return null;
}
