import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { Notification } from "../../shared/models/notification";
import { Observable } from "rxjs";
import { DELETE_NOTIFICATION, GET_ALL_NOTIFICATIONS, POST_NOTIFICATION } from "../../shared/urls/constants";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private server_url = environment.server_url;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.server_url + GET_ALL_NOTIFICATIONS);
  }

  create(notification: Omit<Notification, 'id'>): Observable<Notification> {
    return this.http.post<Notification>(this.server_url + POST_NOTIFICATION, notification);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.server_url + DELETE_NOTIFICATION + id);
  }
}