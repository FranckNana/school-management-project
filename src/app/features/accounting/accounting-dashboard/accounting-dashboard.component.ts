import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AccountingService } from '../../../core/services/accounting.service';
import { Payment, Salary } from '../../../shared/models/accounting';
import { Student } from '../../../shared/models/student';
import { StudentService } from '../../../core/services/student.service';
import { filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ErrorService } from '../../../core/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-accounting-dashboard',
  templateUrl: './accounting-dashboard.component.html',
  styleUrls: ['./accounting-dashboard.component.scss']
})
export class AccountingDashboardComponent implements OnInit {
  recentPayments: Payment[] = [];
  recentSalaries: Salary[] = [];
  solde: number = 0;
  soldeBefore: number = 0;
  depenses: number = 0;
  alldepenses: number = 0;
  recette: number = 0;
  allRecette: number = 0;
 
  constructor(
    private router: Router,
    private accountingService: AccountingService,
    private studentService: StudentService,
    private dialog: MatDialog,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.getAllPayments();
    this.getAllSalaries();
    this.getSolde();
    this.getSoldeBeforeDepenses();
    this.getDepenses();
    this.getALLDepenses();
    this.getRecette();
    this.getAllRecette();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getAllPayments();
        this.getAllSalaries();
        this.getSolde();
        this.getSoldeBeforeDepenses();
        this.getDepenses();
        this.getRecette();
        this.getAllRecette()
        this.getALLDepenses();
    });
  }

  getSolde() {
    this.accountingService.getSolde().subscribe({
      next: (solde) => {
        this.solde = solde;
      },
      error: (error) => {
        console.error('Error fetching solde:', error);
      }
    });
  }

  getSoldeBeforeDepenses() {
    this.accountingService.getSoldeBeforeDepenses().subscribe({
      next: (soldeBefore) => {
        this.soldeBefore = soldeBefore;
      },
      error: (error) => {
        console.error('Error fetching solde before depenses:', error);
      }
    });
  }

  getDepenses() {
    this.accountingService.getDepenses().subscribe({
      next: (depenses) => {
        this.depenses = depenses;
      },
      error: (error) => {
        console.error('Error fetching depenses:', error);
      }
    });
  }

  getALLDepenses() {
    this.accountingService.getALLDepenses().subscribe({
      next: (alldepenses) => {
        this.alldepenses = alldepenses;
      },
      error: (error) => {
        console.error('Error fetching all depenses:', error);
      }
    });
  }

  getRecette() {
    this.accountingService.getRecettes().subscribe({
      next: (recette) => {
        this.recette = recette;
      },
      error: (error) => {
        console.error('Error fetching depenses:', error);
      }
    });
  }

  getAllRecette() {
    this.accountingService.getAllRecettes().subscribe({
      next: (allRecette) => {
        this.allRecette = allRecette;
      },
      error: (error) => {
        console.error('Error fetching all recettes:', error);
      }
    });
  }

  getAllPayments() {
    this.accountingService.getAllPayments().subscribe({
      next: (payments) => {
        this.recentPayments = payments.slice(0, 5);
        this.getStudentsByRecentPayemntsIds();
      },
      error: (error) => {
        console.error('Error fetching payments:', error);
      }
    });
  }

  getAllSalaries() {
    this.accountingService.getAllSalaries().subscribe({
      next: (salaries) => {
        this.recentSalaries = salaries;
      },
      error: (error) => {
        console.error('Error fetching payments:', error);
      }
    });
  }

  getStudentsByRecentPayemntsIds() {
    for (const payment of this.recentPayments) {
      if (payment.eleve) {
        this.studentService.getById(payment.eleve).subscribe({
          next: (student) => {
            payment.studentName = `${student.prenom} ${student.nom}`;
          },
          error: (error) => {
            console.error(`Erreur lors du chargement de l'étudiant ${payment.eleve}`, error);
            payment.studentName = 'Inconnu';
          }
        });
      }
    }
  }

  addPayment() {
    this.router.navigate(['/accounting/payment/new']);
  }

  addSalary() {
    this.router.navigate(['/accounting/salary/new']);
  }

  editSalary(Salary: Salary) {
    this.router.navigate(['/accounting/salary/edit', Salary.id]);
  }

  deleteSalary(salary: Salary) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            title: 'Confirmer la suppression',
            message: `Êtes-vous sûr de vouloir supprimer ce paiement ?`,
            confirmText: 'Supprimer',
            cancelText: 'Annuler'
        }
   });
    
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.accountingService.delete(salary.id).subscribe({
            next: () => {
              this.recentSalaries = this.recentSalaries.filter(s => s.id !== salary.id);
              this.getSolde();
              this.getSoldeBeforeDepenses();
              this.getDepenses();
              this.getRecette();
              this.getAllRecette()
              this.getALLDepenses();
            },
            error: (error: HttpErrorResponse) => {
              this.errorService.handleError(error);
            }
          });
        }
      });
    }  

}