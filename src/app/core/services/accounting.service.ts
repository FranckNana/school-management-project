import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, Salary } from '../../shared/models/accounting';
import { environment } from '../../../environments/environment';
import { DELETE_SALARY, GET_ALL_DEPENSES, GET_ALL_PAIEMENT, GET_ALL_RECETTE, GET_ALL_SALARIES, GET_DEPENSES, GET_RECETTE, GET_SALARY_BY_ID,
   GET_SOLDE, GET_SOLDE_BEFORE, PATCH_SALARY, POST_PAIEMENT, POST_SALARY } from '../../shared/urls/constants';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  private server_url = environment.server_url;
  //private apiUrl = '/api/accounting';

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.server_url + GET_ALL_PAIEMENT);
  }

  createPayment(payment: Omit<Payment, 'id'>): Observable<Payment> {
    return this.http.post<Payment>(this.server_url + POST_PAIEMENT, payment);
  }

  getSalaryById(id: number): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.server_url + GET_SALARY_BY_ID + id);
  }

  getAllSalaries(): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.server_url + GET_ALL_SALARIES);
  }

  createSalary(salary: Omit<Salary, 'id'>): Observable<Salary> {
    return this.http.post<Salary>(this.server_url + POST_SALARY, salary);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.server_url + DELETE_SALARY+ id);
  }

  update(id: number, salary: Partial<Salary>): Observable<Salary> {
    salary.id = id;
    return this.http.patch<Salary>(this.server_url + PATCH_SALARY , salary);
  }

  getSolde(): Observable<number> {
    return this.http.get<number>(this.server_url + GET_SOLDE);
  }

  getSoldeBeforeDepenses(): Observable<number> {
    return this.http.get<number>(this.server_url + GET_SOLDE_BEFORE);
  }

  getDepenses(): Observable<number> {
    return this.http.get<number>(this.server_url + GET_DEPENSES);
  }

  getALLDepenses(): Observable<number> {
    return this.http.get<number>(this.server_url + GET_ALL_DEPENSES);
  }

  getRecettes(): Observable<number> {
    return this.http.get<number>(this.server_url + GET_RECETTE);
  }

  getAllRecettes(): Observable<number> {
    return this.http.get<number>(this.server_url + GET_ALL_RECETTE);
  } 

} 