import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounting-dashboard',
  templateUrl: './accounting-dashboard.component.html',
  styleUrls: ['./accounting-dashboard.component.scss']
})
export class AccountingDashboardComponent {
  recentPayments = [
    {
      date: new Date('2024-03-01'),
      eleve: 'Sawadogo Fatima',
      montant: 50000,
      motif: 'Scolarité 2ème trimestre'
    },
    {
      date: new Date('2024-03-01'),
      eleve: 'Ouédraogo Ali',
      montant: 50000,
      motif: 'Scolarité 2ème trimestre'
    }
  ];

  recentSalaries = [
    {
      date: new Date('2024-02-28'),
      employe: 'M. Ouedraogo',
      montant: 250000,
      mois: 'Février 2024'
    },
    {
      date: new Date('2024-02-28'),
      employe: 'Mme Kaboré',
      montant: 150000,
      mois: 'Février 2024'
    }
  ];

  constructor(private router: Router) {}

  addPayment() {
    this.router.navigate(['/accounting/payment/new']);
  }

  addSalary() {
    this.router.navigate(['/accounting/salary/new']);
  }
}