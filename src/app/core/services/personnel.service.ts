import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personnel } from '../../shared/interfaces/personnel.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private apiUrl = '/api/personnel';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this.apiUrl);
  }

  getById(id: number): Observable<Personnel> {
    return this.http.get<Personnel>(`${this.apiUrl}/${id}`);
  }

  create(personnel: Omit<Personnel, 'id'>): Observable<Personnel> {
    return this.http.post<Personnel>(this.apiUrl, personnel);
  }

  update(id: number, personnel: Partial<Personnel>): Observable<Personnel> {
    return this.http.patch<Personnel>(`${this.apiUrl}/${id}`, personnel);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}