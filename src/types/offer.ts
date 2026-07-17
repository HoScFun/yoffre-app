export interface AgentData {
  enabled: boolean;
  nom: string;
  agence: string;
  email: string;
  telephone: string;
  carte_t: string;
}

export interface OfferFormData {
  profil_type: string;
  acheteur_nom: string;
  acheteur_email: string;
  acheteur_telephone: string;
  acheteur_adresse: string;
  bien_adresse: string;
  bien_type: string;
  bien_prix_affiche: string;
  bien_prix_propose: string;
  delai_validite_jours: number;
  financement: "pret" | "comptant" | "";
  financement_banque: string;
  message_vendeur: string;
  vendeur_nom: string;
  vendeur_email: string;
  vendeur_adresse: string;
  notaire_email: string;
  agent: AgentData;
  selectedClauses: number[];
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
  acheteur_nom: "",
  acheteur_email: "",
  acheteur_telephone: "",
  acheteur_adresse: "",
  bien_adresse: "",
  bien_type: "appartement",
  bien_prix_affiche: "",
  bien_prix_propose: "",
  delai_validite_jours: 10,
  financement: "",
  financement_banque: "",
  message_vendeur: "",
  vendeur_nom: "",
  vendeur_email: "",
  vendeur_adresse: "",
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
  clauseValues: {
    valeur_taux_max: 4.0,
    valeur_duree_pret: 240,
  },
  clauseNotes: {},
  disclaimer_accepted: false,
  envoyer_au_vendeur: true,
};
