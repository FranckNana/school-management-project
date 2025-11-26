import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Metrics } from "../../shared/models/metrics";
import { GET_METRICS } from "../../shared/urls/constants";

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private server_url = environment.server_url;

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<Metrics> {
    return this.http.get<Metrics>(this.server_url + GET_METRICS);
  }

}