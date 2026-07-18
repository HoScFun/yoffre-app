"use client";

import * as React from "react";
import { ValidatedInput } from "@/components/ui/validated-input";
import { MapPin } from "lucide-react";
import { AddressDetails } from "@/types/offer";

interface BanFeature {
  properties: {
    label: string;
    housenumber?: string;
    street?: string;
    name?: string;
    postcode?: string;
    city?: string;
    citycode?: string;
    context?: string;
  };
  geometry?: { coordinates?: [number, number] };
}

interface AddressAutocompleteProps {
  id?: string;
  value: string;
  /** details vaut null tant que l'utilisateur n'a pas choisi une suggestion BAN */
  onChange: (value: string, details: AddressDetails | null) => void;
  validate?: (value: string) => string | null;
  placeholder?: string;
}

/**
 * Champ adresse avec autocomplétion via l'API Adresse du gouvernement (base BAN).
 * La saisie libre reste possible : sans sélection, seule la chaîne est conservée.
 */
export function AddressAutocomplete({ id, value, onChange, validate, placeholder }: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = React.useState<BanFeature[]>([]);
  const [open, setOpen] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState(-1);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>();
  const abortRef = React.useRef<AbortController | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

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
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5&autocomplete=1`,
        { signal: controller.signal }
      );
      if (!res.ok) return;
      const json = await res.json();
      const features: BanFeature[] = json.features || [];
      setSuggestions(features);
      setOpen(features.length > 0);
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

  const select = (f: BanFeature) => {
    const p = f.properties;
    onChange(p.label, {
      label: p.label,
      housenumber: p.housenumber,
      street: p.street || p.name,
      postcode: p.postcode,
      city: p.city,
      citycode: p.citycode,
      context: p.context,
      lon: f.geometry?.coordinates?.[0],
      lat: f.geometry?.coordinates?.[1],
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
    <div ref={containerRef} className="relative">
      <ValidatedInput
        id={id}
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Laisse le mousedown d'une suggestion s'exécuter avant la fermeture
          setTimeout(() => setOpen(false), 150);
        }}
        validate={validate}
        placeholder={placeholder ?? "Commencez à taper votre adresse…"}
        autoComplete="off"
      />
      {open && (
        <ul
          className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md overflow-hidden"
          role="listbox"
        >
          {suggestions.map((f, i) => (
            <li
              key={`${f.properties.label}-${i}`}
              role="option"
              aria-selected={i === highlighted}
              className={
                "flex items-start gap-2 px-3 py-2 text-sm cursor-pointer " +
                (i === highlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground")
              }
              onMouseDown={(e) => {
                e.preventDefault();
                select(f);
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
              <span>
                {f.properties.label}
                {f.properties.context && (
                  <span className="text-xs text-muted-foreground ml-1">({f.properties.context})</span>
                )}
              </span>
            </li>
          ))}
          <li className="px-3 py-1.5 text-[10px] text-muted-foreground border-t bg-muted/40">
            Adresses fournies par la Base Adresse Nationale (data.gouv.fr)
          </li>
        </ul>
      )}
    </div>
  );
}
