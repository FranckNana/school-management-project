export interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  telephone: string;
  email: string;
  adresse: string;
  poste: 'Enseignant' | 'Secrétaire' | 'Vigile' | 'Comptable' | 'Directeur';
  dateEmbauche: Date;
  salaire: number;
  matieres?: string[]; // Pour les enseignants
}