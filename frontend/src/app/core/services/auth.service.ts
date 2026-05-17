import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  ApiResponse,
  AuthResponse,
  CurrentUser,
  RegisterRequest,
} from "../models/auth.model";

const TOKEN_KEY = "tn_token";
const USER_KEY = "tn_user";

export interface FirebaseLoginRequest {
  mobile: string;
  firebaseIdToken: string;
}

export interface FirebaseRegisterRequest {
  name: string;
  email: string;
  mobile: string;
  firebaseIdToken: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;

  currentUser = signal<CurrentUser | null>(this.loadUser());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  // ---- Pre-checks ----

  /** Check if mobile is registered before triggering Firebase OTP for login */
  checkMobileRegistered(mobile: string): Observable<ApiResponse<void>> {
    return this.http.get<ApiResponse<void>>(
      `${this.api}/check-mobile?mobile=${mobile}`,
    );
  }

  /** Check if mobile/email available before triggering Firebase OTP for registration */
  checkAvailability(req: RegisterRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.api}/check`, req);
  }

  // ---- Registration (Firebase) ----

  /** Step 1: just validate inputs — OTP is sent via FirebaseService directly */
  register(req: RegisterRequest): Observable<ApiResponse<void>> {
    // This endpoint just checks if mobile/email already exist
    return this.http.post<ApiResponse<void>>(`${this.api}/check`, req);
  }

  /** Step 2: after Firebase OTP verified, register with Firebase ID token */
  registerWithFirebase(
    req: FirebaseRegisterRequest,
  ): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.api}/register/firebase`, req)
      .pipe(
        tap((res) => {
          if (res.success && res.data) this.saveSession(res.data);
        }),
      );
  }

  // ---- Login (Firebase) ----

  /** After Firebase OTP verified, login with Firebase ID token */
  loginWithFirebase(
    req: FirebaseLoginRequest,
  ): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.api}/login/firebase`, req)
      .pipe(
        tap((res) => {
          if (res.success && res.data) this.saveSession(res.data);
        }),
      );
  }

  // ---- Session ----

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(["/auth/login"]);
  }

  saveSession(auth: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, auth.token);
    const user: CurrentUser = {
      token: auth.token,
      mobile: auth.mobile,
      name: auth.name,
      email: auth.email,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUser(): CurrentUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
