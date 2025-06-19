import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../../shared/models/student';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {
  /*student: Student = {
    id: 1,
    numeroMatricule: '2023001',
    nom: 'Sawadogo',
    prenom: 'Fatima',
    dateNaissance: new Date('2010-03-15'),
    classe: '6ème A',
    nomParent: 'Sawadogo Issouf',
    telephoneParent: '70234567',
    adresse: 'Ouagadougou, Secteur 25',
    notes: [
      { matiere: 'Mathématiques', note: 15, coefficient: 5, trimestre: 1 },
      { matiere: 'Français', note: 14, coefficient: 5, trimestre: 1 }
    ],
    presences: [
      { date: new Date('2024-03-01'), present: true },
      { date: new Date('2024-03-02'), present: false, motif: 'Maladie' }
    ],
    paiements: [
      { date: new Date('2023-10-01'), montant: 50000, motif: 'Scolarité 1er trimestre' }
    ]
  };*/

  student?: Student;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.studentService.getById(id).subscribe({
      next: (student: Student) => {
        this.student = student;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'étudiant:', error);
        // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
      }
    });
    console.log('Chargement des données pour l\'ID:', id);
  }

  editStudent() {
    this.router.navigate(['/students/edit', this.student?.id]);
  }
}