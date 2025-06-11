import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personnel } from '../../shared/models/personnel';
import { environment } from '../../../environments/environment';
import { DELETE_PERSONNEL, GET_ALL_PERSONNEL, GET_PERSONNEL_BY_ID, PATCH_PERSONNEL, POST_PERSONNEL } from '../../shared/urls/constants';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private server_url = environment.server_url;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this.server_url + GET_ALL_PERSONNEL);
  }

  getById(id: number): Observable<Personnel> {
    return this.http.get<Personnel>(this.server_url + GET_PERSONNEL_BY_ID  + id);
  }

  create(personnel: Omit<Personnel, 'id'>): Observable<Personnel> {
    return this.http.post<Personnel>(this.server_url + POST_PERSONNEL, personnel);
  }

  update(id : number, personnel: Partial<Personnel>): Observable<Personnel> {
    personnel.id = id;
    return this.http.patch<Personnel>(this.server_url + PATCH_PERSONNEL , personnel);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.server_url + DELETE_PERSONNEL + id);
  }
}