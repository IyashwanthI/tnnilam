import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/auth.model";
import { District, Taluk, Village } from "../models/location.model";

@Injectable({ providedIn: "root" })
export class LocationService {
  private readonly api = `${environment.apiUrl}/location`;

  constructor(private http: HttpClient) {}

  getDistricts(): Observable<ApiResponse<District[]>> {
    return this.http.get<ApiResponse<District[]>>(`${this.api}/districts`);
  }

  getTaluks(districtCode: string): Observable<ApiResponse<Taluk[]>> {
    return this.http.get<ApiResponse<Taluk[]>>(
      `${this.api}/taluks/${districtCode}`,
    );
  }

  getVillages(
    districtCode: string,
    talukCode: string,
  ): Observable<ApiResponse<Village[]>> {
    return this.http.get<ApiResponse<Village[]>>(
      `${this.api}/villages/${districtCode}/${talukCode}`,
    );
  }
}
