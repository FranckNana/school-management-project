import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Schedule } from '../../shared/interfaces/schedule.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = '/api/schedules';

  // Données mockées pour le développement
  private mockSchedules: Schedule[] = [
    {
      id: 1,
      classe: '6ème A',
      jour: 'Lundi',
      heureDebut: '08:00',
      heureFin: '10:00',
      matiere: 'Mathématiques',
      enseignant: 'M. Ouedraogo',
      salle: 'Salle 1'
    }
  ];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Schedule[]> {
    return of(this.mockSchedules);
  }

  getById(id: number): Observable<Schedule> {
    const schedule = this.mockSchedules.find(s => s.id === id);
    if (!schedule) {
      throw new Error('Schedule not found');
    }
    return of(schedule);
  }

  create(schedule: Omit<Schedule, 'id'>): Observable<Schedule> {
    const newSchedule: Schedule = {
      ...schedule,
      id: this.mockSchedules.length + 1
    };
    this.mockSchedules.push(newSchedule);
    return of(newSchedule);
  }

  update(id: number, schedule: Partial<Schedule>): Observable<Schedule> {
    const index = this.mockSchedules.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Schedule not found');
    }
    this.mockSchedules[index] = { ...this.mockSchedules[index], ...schedule };
    return of(this.mockSchedules[index]);
  }

  delete(id: number): Observable<void> {
    const index = this.mockSchedules.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockSchedules.splice(index, 1);
    }
    return of(void 0);
  }
}