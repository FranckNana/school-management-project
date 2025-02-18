export interface Schedule {
  id: number;
  classe: string;
  jour: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  heureDebut: string;
  heureFin: string;
  matiere: string;
  enseignant: string;
  salle: string;
}