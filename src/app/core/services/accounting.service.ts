import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, Salary } from '../../shared/models/accounting';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  private apiUrl = '/api/accounting';

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments`);
  }

  createPayment(payment: Omit<Payment, 'id'>): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/payments`, payment);
  }

  getAllSalaries(): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${this.apiUrl}/salaries`);
  }

  createSalary(salary: Omit<Salary, 'id'>): Observable<Salary> {
    return this.http.post<Salary>(`${this.apiUrl}/salaries`, salary);
  }

  getBalance(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/balance`);
  }
}