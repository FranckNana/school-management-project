import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bulletin } from '../../shared/models/bulletin';

@Injectable({
  providedIn: 'root'
})
export class BulletinService {
  private apiUrl = '/api/bulletins';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Bulletin[]> {
    return this.http.get<Bulletin[]>(this.apiUrl);
  }

  getById(id: number): Observable<Bulletin> {
    return this.http.get<Bulletin>(`${this.apiUrl}/${id}`);
  }

  getByEleve(eleveId: number): Observable<Bulletin[]> {
    return this.http.get<Bulletin[]>(`${this.apiUrl}/eleve/${eleveId}`);
  }

  create(bulletin: Omit<Bulletin, 'id'>): Observable<Bulletin> {
    return this.http.post<Bulletin>(this.apiUrl, bulletin);
  }

  update(id: number, bulletin: Partial<Bulletin>): Observable<Bulletin> {
    return this.http.patch<Bulletin>(`${this.apiUrl}/${id}`, bulletin);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generatePDF(bulletinId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${bulletinId}/pdf`, {
      responseType: 'blob'
    });
  }
}