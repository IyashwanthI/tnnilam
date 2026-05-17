import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/auth.model";
import {
  FlineAppealRequest,
  FlineAppealResponse,
} from "../models/appeal.model";

@Injectable({ providedIn: "root" })
export class AppealService {
  private readonly api = `${environment.apiUrl}/appeals`;

  constructor(private http: HttpClient) {}

  submitAppeal(
    req: FlineAppealRequest,
  ): Observable<ApiResponse<FlineAppealResponse>> {
    return this.http.post<ApiResponse<FlineAppealResponse>>(this.api, req);
  }

  getMyAppeals(): Observable<ApiResponse<FlineAppealResponse[]>> {
    return this.http.get<ApiResponse<FlineAppealResponse[]>>(this.api);
  }

  getAppeal(applId: string): Observable<ApiResponse<FlineAppealResponse>> {
    return this.http.get<ApiResponse<FlineAppealResponse>>(
      `${this.api}/${applId}`,
    );
  }
}
