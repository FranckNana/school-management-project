import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonnelService } from '../../../core/services/personnel.service';
import { AccountingService } from '../../../core/services/accounting.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-salary-form',
  templateUrl: './salary-form.component.html',
  styleUrls: ['./salary-form.component.scss']
})
export class SalaryFormComponent implements OnInit {
  salaryForm: FormGroup;
  personnelList: string[] = [];
  moisOptions: string[] = [];
  idSnapShot?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private personnelService: PersonnelService,
    private accountingService: AccountingService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
  ) {
    this.salaryForm = this.fb.group({
      employe: ['', Validators.required],
      poste: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      date: [new Date(), Validators.required],
      mois: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.idSnapShot = this.route.snapshot.params['id'];
    if (this.idSnapShot) {
      this.loadSalary(this.idSnapShot);
    }

    this.personnelService.getAll().subscribe({
      next: (personnel) => {
        this.personnelList = personnel.map(p => `${p.nom} ${p.prenom}`).sort((a, b) => a.localeCompare(b));
      },
      error: (error) => {
        console.error('Error fetching personnel:', error);
      }
    });

    this.generateMoisOptions();
  }

  loadSalary(id: number): void {
    this.accountingService.getSalaryById(id).subscribe({
      next: (salary) => {
        this.salaryForm.patchValue(salary);
      },
      error: (error) => {
        this.errorService.handleError(error);
      }
    });
  }

  generateMoisOptions(): void {
    const currentDate = new Date();
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    // Exemple : ajouter les 12 mois de l’année courante
    const year = currentDate.getFullYear();
    for (let i = 0; i < 12; i++) {
      this.moisOptions.push(`${months[i]} ${year}`);
    }
  }

  onSubmit() {
    this.idSnapShot ? this.updateSalary() : this.createSalary();
  }

  createSalary() {
    if (this.salaryForm.valid) {

      const salary = this.salaryForm.value;
      
      this.accountingService.createSalary(salary).subscribe({
              next: () => {
                this.router.navigate(['/accounting']);
              },
              error: (error : HttpErrorResponse) => this.errorService.handleError(error)
          });
      this.router.navigate(['/accounting']);
    }
  }

  updateSalary() {
    if (this.salaryForm.valid) {
      const salary = this.salaryForm.value;

      this.accountingService.update(this.idSnapShot!, salary).subscribe({
        next: () => {
          this.router.navigate(['/accounting']);
        },
        error: (error: HttpErrorResponse) => this.errorService.handleError(error)
      });
    }
  }
        

  cancel() {
    this.router.navigate(['/accounting']);
  }
}