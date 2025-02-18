export interface Student {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  classe: string;
  numeroMatricule: string;
  nomParent: string;
  telephoneParent: string;
  adresse: string;
  notes: {
    matiere: string;
    note: number;
    coefficient: number;
    trimestre: number;
  }[];
  presences: {
    date: Date;
    present: boolean;
    motif?: string;
  }[];
  paiements: {
    date: Date;
    montant: number;
    motif: string;
  }[];
}