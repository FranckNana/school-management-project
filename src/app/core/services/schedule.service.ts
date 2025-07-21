import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Schedule } from '../../shared/models/schedule';
import { environment } from '../../../environments/environment';
import { DELETE_SCHEDULE, GET_ALL_SCHEDULE, GET_SCHEDULE_BY_ID, PATCH_SCHEDULE, POST_SCHEDULE } from '../../shared/urls/constants';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private server_url = environment.server_url;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.server_url + GET_ALL_SCHEDULE);
  }

  getById(id: number): Observable<Schedule> {
    return this.http.get<Schedule>(this.server_url + GET_SCHEDULE_BY_ID  + id);
  }

  create(schedule: Omit<Schedule, 'id'>): Observable<Schedule> {
    return this.http.post<Schedule>(this.server_url + POST_SCHEDULE, schedule);
  }

  update(id: number, schedule: Partial<Schedule>): Observable<Schedule> {
    schedule.id = id;
    return this.http.patch<Schedule>(this.server_url + PATCH_SCHEDULE , schedule);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.server_url + DELETE_SCHEDULE + id);
  }
}