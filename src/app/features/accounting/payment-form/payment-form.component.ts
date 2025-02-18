import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent {
  paymentForm: FormGroup;
  classes: string[] = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      eleve: ['', Validators.required],
      classe: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      date: [new Date(), Validators.required],
      motif: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      console.log(this.paymentForm.value);
      this.router.navigate(['/accounting']);
    }
  }

  cancel() {
    this.router.navigate(['/accounting']);
  }
}