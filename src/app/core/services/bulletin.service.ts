import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bulletin } from '../../shared/models/bulletin';
import { environment } from '../../../environments/environment';
import { DELETE_BULLETIN, GET_ALL_BULLETIN, GET_BULLETIN_BY_ID, GET_BULLETIN_BY_IDELEVE, GET_BULLETIN_GENERATE_PDF, PATCH_BULLETIN, POST_BULLETIN} from '../../shared/urls/constants';

@Injectable({
  providedIn: 'root'
})
export class BulletinService {
  private server_url = environment.server_url;
  private apiUrl = '/api/bulletins';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Bulletin[]> {
    return this.http.get<Bulletin[]>(this.server_url + GET_ALL_BULLETIN);
  }

  getById(id: number): Observable<Bulletin> {
    return this.http.get<Bulletin>(this.server_url + GET_BULLETIN_BY_ID + id);
  }

  getByEleve(eleveId: number): Observable<Bulletin[]> {
    return this.http.get<Bulletin[]>(this.server_url + GET_BULLETIN_BY_IDELEVE + eleveId);
  }

  create(bulletin: Omit<Bulletin, 'id'>): Observable<Bulletin> {
    console.log('Creating bulletin:', bulletin);
    return this.http.post<Bulletin>(this.server_url + POST_BULLETIN, bulletin);
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.server_url + DELETE_BULLETIN + id);
  }

  update(id: number, bulletin: Partial<Bulletin>): Observable<Bulletin> {
    bulletin.id = id;
    return this.http.patch<Bulletin>(this.server_url + PATCH_BULLETIN , bulletin);
  }

  generatePDF(bulletinId: number): Observable<Blob> {
    return this.http.get(this.server_url + GET_BULLETIN_GENERATE_PDF + bulletinId , {
      responseType: 'blob'
    });
  }
  
}