export interface Payment {
  id: number;
  date: Date;
  eleve: string;
  montant: number;
  motif: string;
  classe: string;
}

export interface Salary {
  id: number;
  date: Date;
  employe: string;
  montant: number;
  mois: string;
  poste: string;
}

export interface Balance {
  total: number;
  recettes: number;
  depenses: number;
}