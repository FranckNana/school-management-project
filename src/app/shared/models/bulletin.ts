export interface Note {
  matiere: string;
  note: number;
  coefficient: number;
  appreciation?: string;
}

export interface Bulletin {
  id: number;
  eleveId: number;
  nomEleve: string;
  classe: string;
  trimestre: number;
  annee: string;
  notes: Note[];
  moyenneGenerale: number;
  rang: number;
  appreciation: string;
  dateGeneration: Date;
}