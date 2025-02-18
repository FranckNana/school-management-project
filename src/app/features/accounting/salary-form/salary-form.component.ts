import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salary-form',
  templateUrl: './salary-form.component.html',
  styleUrls: ['./salary-form.component.scss']
})
export class SalaryFormComponent {
  salaryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.salaryForm = this.fb.group({
      employe: ['', Validators.required],
      poste: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      date: [new Date(), Validators.required],
      mois: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.salaryForm.valid) {
      console.log(this.salaryForm.value);
      this.router.navigate(['/accounting']);
    }
  }

  cancel() {
    this.router.navigate(['/accounting']);
  }
}