import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/auth.model";

export interface ProfileUpdateRequest {
  name: string;
  tamilName?: string;
  fatherOrHusbandName?: string;
  motherName?: string;
  email?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  dob?: string;
  gender?: string;
  isBuildingPromoter?: boolean;
  promoterName?: string;
  isPowerAgent?: boolean;
}

@Injectable({ providedIn: "root" })
export class ProfileService {
  private readonly api = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  updateProfile(req: ProfileUpdateRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(this.api, req);
  }
}
