"use client";

import * as React from "react";
import { ValidatedInput } from "@/components/ui/validated-input";
import { Building2 } from "lucide-react";

export interface CompanyDetails {
  nom_complet: string;
  siren: string;
  adresse?: string;
}

interface ApiResult {
  nom_complet: string;
  siren: string;
  siege?: { adresse?: string };
}

interface CompanyAutocompleteProps {
  id?: string;
  value: string;
  /** details vaut null tant qu'aucune entreprise n'a été choisie dans la liste */
  onChange: (value: string, details: CompanyDetails | null) => void;
  placeholder?: string;
}

/**
 * Champ raison sociale avec autocomplétion via l'API Recherche d'entreprises
 * (recherche-entreprises.api.gouv.fr, gratuite et officielle).
 * La saisie libre reste possible.
 */
export function CompanyAutocomplete({ id, value, onChange, placeholder }: CompanyAutocompleteProps) {
  const [suggestions, setSuggestions] = React.useState<ApiResult[]>([]);
  const [open, setOpen] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState(-1);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>();
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const fetchSuggestions = React.useCallback(async (q: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch(
        `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(q)}&per_page=5`,
        { signal: controller.signal }
      );
      if (!res.ok) return;
      const json = await res.json();
      const results: ApiResult[] = json.results || [];
      setSuggestions(results);
      setOpen(results.length > 0);
      setHighlighted(-1);
    } catch {
      // API indisponible : le champ reste utilisable en saisie libre
    }
  }, []);

  const handleInput = (v: string) => {
    onChange(v, null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = v.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(q), 300);
  };

  const select = (r: ApiResult) => {
    onChange(r.nom_complet, {
      nom_complet: r.nom_complet,
      siren: r.siren,
      adresse: r.siege?.adresse,
    });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();
    setSuggestions([]);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
    } else if (e.key === "Enter") {
      if (highlighted >= 0) {
        e.preventDefault();
        select(suggestions[highlighted]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <ValidatedInput
        id={id}
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          setTimeout(() => setOpen(false), 150);
        }}
        placeholder={placeholder ?? "Nom de votre société…"}
        autoComplete="off"
      />
      {open && (
        <ul
          className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md overflow-hidden"
          role="listbox"
        >
          {suggestions.map((r, i) => (
            <li
              key={r.siren}
              role="option"
              aria-selected={i === highlighted}
              className={
                "flex items-start gap-2 px-3 py-2 text-sm cursor-pointer " +
                (i === highlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground")
              }
              onMouseDown={(e) => {
                e.preventDefault();
                select(r);
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              <Building2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
              <span>
                {r.nom_complet}
                <span className="text-xs text-muted-foreground ml-1">
                  (SIREN {r.siren}{r.siege?.adresse ? ` — ${r.siege.adresse}` : ""})
                </span>
              </span>
            </li>
          ))}
          <li className="px-3 py-1.5 text-[10px] text-muted-foreground border-t bg-muted/40">
            Annuaire des entreprises (api.gouv.fr)
          </li>
        </ul>
      )}
    </div>
  );
}
