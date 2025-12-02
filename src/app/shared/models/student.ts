export interface Student {
  id: number;
  numeroMatricule: string;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  classe: string;
  nomParent: string;
  telephoneParent: string;
  adresse: string;
  notes: Note[];
  presences: Presence[];
  paiements: Paiement[];
  prixScholarite: number;
  resteApayer: number;
  anneeScolaire: string;
}

export interface Note {
  matiere: string;
  note: number;
  coefficient: number;
  trimestre: number;
}

export interface Presence {
  date: Date;
  present: boolean;
  motif?: string;
}

export interface Paiement {
  date: Date;
  montant: number;
  motif: string;
}