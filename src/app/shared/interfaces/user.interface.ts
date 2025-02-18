export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'admin' | 'teacher' | 'staff';
  token?: string;
}