import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../../shared/models/student';
import { environment } from '../../../environments/environment';
import { DELETE_STUDENT, GET_ALL_STUDENTS, GET_STUDENT_BY_ID, PATCH_STUDENT, POST_STUDENT } from '../../shared/urls/constants';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private server_url = environment.server_url;

  constructor(private http: HttpClient) {}

  create(student: Omit<Student, 'id'>): Observable<Student> {
     return this.http.post<Student>(this.server_url + POST_STUDENT, student);
  }

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.server_url + GET_ALL_STUDENTS);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(this.server_url + GET_STUDENT_BY_ID  + id);
  }

  update(id: number, student: Partial<Student>): Observable<Student> {
    student.id = id;
    return this.http.patch<Student>(this.server_url + PATCH_STUDENT , student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.server_url + DELETE_STUDENT + id);
  }
} 