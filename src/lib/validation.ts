// ─── Validation utilities ───

const DISPOSABLE_DOMAINS = [
  "yopmail.com", "yopmail.fr", "mailinator.com", "guerrillamail.com",
  "tempmail.com", "throwaway.email", "fakeinbox.com", "tempail.com",
  "guerrillamail.info", "grr.la", "guerrillamail.net",
];

const REJECTED_EMAILS = ["test@test.com", "example@example.com", "aaa@aaa.com"];

const REPEATED_CHAR_REGEX = /^(.)\1+$/;
const HTML_TAGS_REGEX = /<[^>]*>/;

// Valid French department prefixes (01-19, 2A, 2B, 21-95, 97)
const VALID_DEPT_PREFIXES = [
  ...Array.from({ length: 19 }, (_, i) => String(i + 1).padStart(2, "0")),
  "2A", "2B",
  ...Array.from({ length: 75 }, (_, i) => String(i + 21).padStart(2, "0")),
  "97",
];

const INVALID_CP = ["00000", "99999", "11111", "22222", "33333", "44444", "55555", "66666", "77777", "88888"];
const ABERRANT_PRICES = [11111, 22222, 33333, 44444, 55555, 66666, 77777, 88888, 99999];

// ─── Generic checks ───

function isRepeatedChar(value: string): boolean {
  const clean = value.replace(/\s/g, "");
  return clean.length > 2 && REPEATED_CHAR_REGEX.test(clean);
}

function containsHtml(value: string): boolean {
  return HTML_TAGS_REGEX.test(value);
}

function isOnlySpaces(value: string): boolean {
  return value.length > 0 && value.trim().length === 0;
}

function genericTextCheck(value: string, maxLen = 500): string | null {
  if (isOnlySpaces(value)) return "Ce champ ne peut pas contenir uniquement des espaces.";
  if (isRepeatedChar(value)) return "Valeur invalide.";
  if (containsHtml(value)) return "Les balises HTML ne sont pas autorisées.";
  if (value.length > maxLen) return `Maximum ${maxLen} caractères.`;
  return null;
}

// ─── Address ───

export function validateAddress(value: string): string | null {
  if (!value || value.trim().length === 0) return "L'adresse est obligatoire.";
  const generic = genericTextCheck(value, 200);
  if (generic) return generic;
  if (value.trim().length < 10) return "L'adresse doit inclure un numéro, une rue, un code postal et une ville. Ex : 15 rue des Lilas, 75011 Paris, France";
  // Must start with a number (street number)
  if (!/^\d/.test(value.trim())) return "L'adresse doit inclure un numéro, une rue, un code postal et une ville. Ex : 15 rue des Lilas, 75011 Paris, France";
  // Must contain a 5-digit postal code
  const cpMatch = value.match(/\b(\d{5})\b/);
  if (!cpMatch) return "L'adresse doit inclure un numéro, une rue, un code postal et une ville. Ex : 15 rue des Lilas, 75011 Paris, France";
  const cp = cpMatch[1];
  if (INVALID_CP.includes(cp)) return "Code postal invalide.";
  const dept = cp.substring(0, 2);
  if (!VALID_DEPT_PREFIXES.includes(dept)) return "Code postal invalide.";
  // Must have at least 2 chars after the postal code (city)
  const afterCp = value.substring(value.indexOf(cp) + 5).trim();
  if (afterCp.length < 2) return "L'adresse doit inclure un numéro, une rue, un code postal et une ville. Ex : 15 rue des Lilas, 75011 Paris, France";
  return null;
}

// ─── Name ───

export function validateName(value: string, requireSpace = true): string | null {
  if (!value || value.trim().length === 0) return "Ce champ est obligatoire.";
  const generic = genericTextCheck(value, 100);
  if (generic) return generic;
  if (value.trim().length < 2) return "Veuillez entrer un nom complet valide (prénom et nom).";
  // Only letters, spaces, hyphens, apostrophes, accents
  if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) return "Veuillez entrer un nom complet valide (prénom et nom).";
  if (/^\d+$/.test(value.trim())) return "Veuillez entrer un nom complet valide (prénom et nom).";
  if (requireSpace && !value.trim().includes(" ")) return "Veuillez entrer un nom complet valide (prénom et nom).";
  const lower = value.trim().toLowerCase();
  if (["aaa", "test", "xxx", "zzz"].includes(lower)) return "Veuillez entrer un nom complet valide (prénom et nom).";
  return null;
}

export function validateAgencyName(value: string): string | null {
  if (!value || value.trim().length === 0) return "Ce champ est obligatoire.";
  const generic = genericTextCheck(value, 100);
  if (generic) return generic;
  if (value.trim().length < 2) return "Nom d'agence invalide.";
  const lower = value.trim().toLowerCase();
  if (["aaa", "test", "xxx"].includes(lower)) return "Nom d'agence invalide.";
  return null;
}

// ─── Email ───

export function validateEmail(value: string): string | null {
  if (!value || value.trim().length === 0) return "L'email est obligatoire.";
  const generic = genericTextCheck(value, 255);
  if (generic) return generic;
  // RFC 5322 simplified
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(value.trim())) return "Veuillez entrer une adresse email valide.";
  const domain = value.trim().split("@")[1]?.toLowerCase();
  if (domain && DISPOSABLE_DOMAINS.includes(domain)) return "Les adresses email jetables ne sont pas acceptées.";
  if (REJECTED_EMAILS.includes(value.trim().toLowerCase())) return "Veuillez entrer une adresse email valide.";
  return null;
}

// ─── Phone ───

export function validatePhone(value: string): string | null {
  if (!value || value.trim().length === 0) return "Le téléphone est obligatoire.";
  const digits = value.replace(/[\s.\-()]/g, "");
  // +33 format
  if (digits.startsWith("+33")) {
    const rest = digits.substring(3);
    if (rest.length !== 9) return "Format attendu : 06 XX XX XX XX ou +33 6 XX XX XX XX";
    if (!/^[1-79]/.test(rest)) return "Format attendu : 06 XX XX XX XX ou +33 6 XX XX XX XX";
  } else if (digits.startsWith("0")) {
    if (digits.length !== 10) return "Format attendu : 06 XX XX XX XX ou +33 6 XX XX XX XX";
    if (!/^0[1-7]/.test(digits)) return "Format attendu : 06 XX XX XX XX ou +33 6 XX XX XX XX";
  } else {
    return "Format attendu : 06 XX XX XX XX ou +33 6 XX XX XX XX";
  }
  if (/^0{10}$/.test(digits) || digits === "1234567890") return "Format attendu : 06 XX XX XX XX ou +33 6 XX XX XX XX";
  if (isRepeatedChar(digits)) return "Numéro invalide.";
  return null;
}

export function formatPhoneDisplay(value: string): string {
  const digits = value.replace(/[\s.\-()]/g, "");
  if (digits.startsWith("+33") && digits.length === 12) {
    const n = "0" + digits.substring(3);
    return n.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return digits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
  }
  return value;
}

// ─── Price ───

export function validatePrice(value: string, prixAffiche?: string): string | null {
  if (!value || value.trim().length === 0) return "Le prix est obligatoire.";
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return "Le prix doit être supérieur à 0.";
  if (num < 1000) return "Le prix doit être supérieur à 1 000 €.";
  if (num > 100000000) return "Veuillez vérifier ce montant.";
  if (ABERRANT_PRICES.includes(num)) return "Veuillez vérifier ce montant.";
  if (prixAffiche) {
    const affiche = parseFloat(prixAffiche);
    if (!isNaN(affiche) && affiche > 0) {
      if (num < affiche * 0.2) return "Votre offre est inférieure à 20% du prix affiché. Veuillez vérifier.";
      if (num > affiche) return "Votre offre dépasse le prix affiché. Veuillez vérifier.";
    }
  }
  return null;
}

export function validatePrixAffiche(value: string): string | null {
  if (!value || value.trim().length === 0) return null; // optional
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return "Le prix doit être supérieur à 0.";
  if (num < 1000) return "Le prix doit être supérieur à 1 000 €.";
  if (num > 100000000) return "Veuillez vérifier ce montant.";
  return null;
}

// ─── Loan fields ───

export function validateMontantPret(value: number | undefined, prixPropose: string): string | null {
  if (value === undefined || value === 0) return "Le montant du prêt est obligatoire.";
  if (value < 10000) return "Le montant minimum est de 10 000 €.";
  const prix = parseFloat(prixPropose);
  if (!isNaN(prix) && prix > 0 && value > prix * 1.1) {
    return "Le montant du prêt ne peut pas dépasser 110% du prix d'achat.";
  }
  return null;
}

export function validateTauxMax(value: number | undefined): string | null {
  if (value === undefined || value === 0) return "Le taux est obligatoire.";
  if (value < 0.1 || value > 10) return "Le taux doit être compris entre 0,1% et 10%.";
  return null;
}

export function validateDureePret(value: number | undefined): string | null {
  if (value === undefined || value === 0) return "La durée est obligatoire.";
  if (value < 12 || value > 360) return "La durée doit être comprise entre 12 et 360 mois.";
  return null;
}

// ─── Validity ───

export function validateDelaiValidite(value: number): string | null {
  if (value < 5 || value > 90) return "La durée doit être comprise entre 5 et 90 jours.";
  return null;
}

// ─── Carte T ───

export function validateCarteT(value: string): string | null {
  if (!value || value.trim().length === 0) return null; // optional
  // Flexible: starts with CPI
  if (!/^CPI\s/i.test(value.trim())) return "Format attendu : CPI XXXX YYYY ZZZ NNNNNN";
  if (value.trim().length < 10) return "Format attendu : CPI XXXX YYYY ZZZ NNNNNN";
  return null;
}

// ─── Optional email (notaire) ───

export function validateOptionalEmail(value: string): string | null {
  if (!value || value.trim().length === 0) return null;
  return validateEmail(value);
}

// ─── Step-level validation ───

export interface FieldError {
  [field: string]: string | null;
}

export function validateStep2(data: any): FieldError {
  const errors: FieldError = {};
  errors.acheteur_nom = validateName(data.acheteur_nom);
  errors.acheteur_email = validateEmail(data.acheteur_email);
  errors.acheteur_telephone = validatePhone(data.acheteur_telephone);
  errors.acheteur_adresse = validateAddress(data.acheteur_adresse);
  errors.bien_adresse = validateAddress(data.bien_adresse);
  errors.bien_prix_affiche = validatePrixAffiche(data.bien_prix_affiche);
  errors.bien_prix_propose = validatePrice(data.bien_prix_propose, data.bien_prix_affiche);
  errors.delai_validite_jours = validateDelaiValidite(data.delai_validite_jours);
  errors.vendeur_nom = validateName(data.vendeur_nom);
  errors.vendeur_email = validateEmail(data.vendeur_email);
  errors.vendeur_adresse = validateAddress(data.vendeur_adresse);

  if (data.financement === "pret") {
    errors.valeur_montant_pret = validateMontantPret(data.clauseValues?.valeur_montant_pret, data.bien_prix_propose);
    errors.valeur_taux_max = validateTauxMax(data.clauseValues?.valeur_taux_max);
    errors.valeur_duree_pret = validateDureePret(data.clauseValues?.valeur_duree_pret);
  }

  if (data.agent?.enabled) {
    errors.agent_nom = validateName(data.agent.nom);
    errors.agent_agence = validateAgencyName(data.agent.agence);
    errors.agent_email = validateEmail(data.agent.email);
    if (data.agent.telephone) errors.agent_telephone = validatePhone(data.agent.telephone);
    errors.agent_carte_t = validateCarteT(data.agent.carte_t);
  }

  errors.notaire_email = validateOptionalEmail(data.notaire_email);

  return errors;
}

export function isStep2Valid(data: any): boolean {
  const errors = validateStep2(data);
  return Object.values(errors).every((e) => e === null);
}
