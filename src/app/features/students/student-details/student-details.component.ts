import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../../shared/models/student';
import { StudentService } from '../../../core/services/student.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {

  student : Student = {} as Student;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.studentService.getById(id).subscribe({
      next: (student: Student) => {
        this.student = student;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'étudiant:', error);
      }
    }); 
  }

  editStudent() {
    this.router.navigate(['/students/edit', this.student?.id]);
  }

  editPaiement(idPayement: number){
    this.router.navigate(['/accounting/payment/edit', idPayement]);
  }

  deletePaiement(paiement:any){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Confirmer la suppression',
            message: `Êtes-vous sûr de vouloir supprimer ce paiement de " ${paiement.montant} " de la Liste ?`,
            confirmText: 'Supprimer',
            cancelText: 'Annuler'
          }
        });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deletePaiement(paiement).subscribe({
          next: () => {
            console.log('Paiement supprimé avec succès');
            this.router.navigate(['/students']);
          }
          ,
          error: (error) => {
            console.error('Erreur lors de la suppression du paiement:', error);
          }
        }); 
      }
    });
  }

}