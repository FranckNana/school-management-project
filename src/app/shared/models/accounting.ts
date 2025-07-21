export interface Payment {
  id: number;
  date: Date;
  eleve: number;
  montant: number;
  motif: string;
  classe: string;
  studentName?: string; // Optional field to hold student name
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