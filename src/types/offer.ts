export interface AgentData {
  enabled: boolean;
  nom: string;
  agence: string;
  email: string;
  telephone: string;
  carte_t: string;
}

/** Adresse structurée issue de l'autocomplétion BAN (api-adresse.data.gouv.fr) */
export interface AddressDetails {
  label: string;
  housenumber?: string;
  street?: string;
  postcode?: string;
  city?: string;
  citycode?: string;
  context?: string;
  lat?: number;
  lon?: number;
}

export interface OfferFormData {
  profil_type: string;
  professionnel_type: string;
  acheteur_denomination: string;
  acheteur_siren: string;
  acheteur_civilite: string;
  acheteur_prenom: string;
  acheteur_nom: string;
  acheteur_situation: string;
  conjoint_prenom: string;
  conjoint_nom: string;
  acheteur_email: string;
  acheteur_telephone: string;
  acheteur_adresse: string;
  acheteur_adresse_details: AddressDetails | null;
  bien_adresse: string;
  bien_adresse_details: AddressDetails | null;
  bien_type: string;
  bien_prix_affiche: string;
  bien_prix_propose: string;
  delai_validite_jours: number;
  date_signature_souhaitee: string;
  financement: "pret" | "comptant" | "";
  financement_banque: string;
  message_vendeur: string;
  vendeur_civilite: string;
  vendeur_prenom: string;
  vendeur_nom: string;
  vendeur_email: string;
  vendeur_adresse: string;
  vendeur_adresse_details: AddressDetails | null;
  notaire_email: string;
  agent: AgentData;
  selectedClauses: number[];
  /** Clauses auto-proposées (obligatoires/prêt) que l'utilisateur a explicitement retirées — non persisté en base */
  removedClauses: number[];
  clauseValues: {
    valeur_montant_pret?: number;
    valeur_taux_max?: number;
    valeur_duree_pret?: number;
  };
  clauseNotes: Record<number, string>;
  disclaimer_accepted: boolean;
  envoyer_au_vendeur: boolean;
}

export const defaultFormData: OfferFormData = {
  profil_type: "",
  professionnel_type: "",
  acheteur_denomination: "",
  acheteur_siren: "",
  acheteur_civilite: "",
  acheteur_prenom: "",
  acheteur_nom: "",
  acheteur_situation: "",
  conjoint_prenom: "",
  conjoint_nom: "",
  acheteur_email: "",
  acheteur_telephone: "",
  acheteur_adresse: "",
  acheteur_adresse_details: null,
  bien_adresse: "",
  bien_adresse_details: null,
  bien_type: "appartement",
  bien_prix_affiche: "",
  bien_prix_propose: "",
  delai_validite_jours: 10,
  date_signature_souhaitee: "",
  financement: "",
  financement_banque: "",
  message_vendeur: "",
  vendeur_civilite: "",
  vendeur_prenom: "",
  vendeur_nom: "",
  vendeur_email: "",
  vendeur_adresse: "",
  vendeur_adresse_details: null,
  notaire_email: "",
  agent: {
    enabled: false,
    nom: "",
    agence: "",
    email: "",
    telephone: "",
    carte_t: "",
  },
  selectedClauses: [],
  removedClauses: [],
  clauseValues: {
    valeur_taux_max: 4.0,
    valeur_duree_pret: 240,
  },
  clauseNotes: {},
  disclaimer_accepted: false,
  envoyer_au_vendeur: true,
};

/** Compose un nom complet à partir de prénom + nom (rétrocompatible : prénom absent → nom seul). */
export function fullName(prenom?: string | null, nom?: string | null): string {
  return [prenom, nom].filter(Boolean).join(" ").trim();
}

export const professionnelTypeLabels: Record<string, string> = {
  marchand_de_biens: "Marchand de biens",
  fonciere: "Entreprise foncière",
  autre: "Autre structure professionnelle",
};

export const civiliteLabels: Record<string, string> = {
  monsieur: "Monsieur",
  madame: "Madame",
};

export const situationLabels: Record<string, string> = {
  celibataire: "Célibataire",
  marie: "Marié(e)",
  pacse: "Pacsé(e)",
  concubinage: "En concubinage",
  divorce: "Divorcé(e)",
  veuf: "Veuf / Veuve",
};

/** Situations où un conjoint / partenaire peut être co-acquéreur */
export const SITUATIONS_AVEC_CONJOINT = ["marie", "pacse", "concubinage"];
