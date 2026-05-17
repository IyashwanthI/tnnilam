export interface RegisterRequest {
  name: string;
  email: string;
  mobile: string;
}

export interface OtpVerifyRequest {
  mobile: string;
  otp: string;
}

export interface LoginRequest {
  mobile: string;
}

export interface AuthResponse {
  token: string;
  mobile: string;
  name: string;
  email: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CurrentUser {
  token: string;
  mobile: string;
  name: string;
  email: string;
}
