import { Component, OnDestroy, AfterViewInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { FirebaseService } from "../../../core/services/firebase.service";
import { OtpInputComponent } from "../../../shared/otp-input/otp-input.component";

type Step = "mobile" | "otp";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, OtpInputComponent],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">🔐</div>
          <h1>Citizen Login</h1>
          <p>Login with your registered mobile number</p>
        </div>

        @if (alertMsg) {
          <div
            class="alert"
            [class.alert-success]="alertType === 'success'"
            [class.alert-error]="alertType === 'error'"
          >
            {{ alertMsg }}
          </div>
        }

        <!-- Step 1: Mobile -->
        @if (step === "mobile") {
          <form [formGroup]="mobileForm" (ngSubmit)="sendOtp()" novalidate>
            <div class="form-group">
              <label for="mobile"
                >Mobile Number <span class="req">*</span></label
              >
              <div class="input-prefix-group">
                <span class="input-prefix">+91</span>
                <input
                  id="mobile"
                  type="tel"
                  class="form-ctrl"
                  formControlName="mobile"
                  placeholder="10-digit mobile number"
                  maxlength="10"
                  autocomplete="tel"
                  autofocus
                />
              </div>
              @if (
                mobileForm.get("mobile")!.invalid &&
                mobileForm.get("mobile")!.touched
              ) {
                <span class="err"
                  >Enter a valid 10-digit Indian mobile number.</span
                >
              }
            </div>

            <!-- Firebase invisible reCAPTCHA attaches here -->
            <button
              id="login-otp-btn"
              type="submit"
              class="btn-primary"
              [disabled]="loading"
            >
              @if (loading) {
                <span class="spinner"></span>
              }
              Send OTP
            </button>
          </form>

          <p class="footer-text">
            New user? <a routerLink="/auth/register">Register here</a>
          </p>
        }

        <!-- Step 2: OTP -->
        @if (step === "otp") {
          <div class="otp-section">
            <p class="otp-info">
              Enter the 6-digit OTP sent to
              <strong>+91 XXXXXX{{ mobile.slice(-4) }}</strong> <br /><small
                class="firebase-note"
                >📱 Sent via Firebase SMS</small
              >
            </p>

            <app-otp-input #otpInput (otpChange)="onOtpChange($event)" />

            <button
              class="btn-primary"
              style="margin-top:1.5rem"
              (click)="verifyOtp()"
              [disabled]="loading || otp.length < 6"
            >
              @if (loading) {
                <span class="spinner"></span>
              }
              Login
            </button>

            <div class="resend-row">
              @if (resendTimer > 0) {
                <span class="resend-timer">Resend in {{ resendTimer }}s</span>
              } @else {
                <button
                  class="btn-link"
                  (click)="resendOtp()"
                  [disabled]="loading"
                >
                  Resend OTP
                </button>
              }
              <button class="btn-link" (click)="goBack()">
                ← Change number
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .auth-page {
        display: flex;
        justify-content: center;
        padding: 1rem;
        background: #f5f5f0;
        min-height: 100vh;
      }
      .auth-card {
        width: 100%;
        max-width: 420px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        padding: 2rem;
        border: 1px solid #e0ddd0;
        margin-top: 1rem;
      }
      .auth-header {
        text-align: center;
        margin-bottom: 1.75rem;
      }
      .auth-logo {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }
      .auth-header h1 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.3rem;
        color: #1a1a2e;
      }
      .auth-header p {
        color: #666;
        font-size: 0.9rem;
      }

      .alert {
        padding: 0.75rem 1rem;
        border-radius: 6px;
        font-size: 0.88rem;
        margin-bottom: 1rem;
      }
      .alert-success {
        background: #e8f5e9;
        color: #1b5e20;
        border-left: 4px solid #2e7d32;
      }
      .alert-error {
        background: #ffebee;
        color: #b71c1c;
        border-left: 4px solid #d32f2f;
      }

      .form-group {
        margin-bottom: 1.1rem;
      }
      .form-group label {
        display: block;
        font-size: 0.85rem;
        font-weight: 500;
        margin-bottom: 0.35rem;
        color: #444;
      }
      .req {
        color: #d32f2f;
      }
      .form-ctrl {
        width: 100%;
        padding: 0.6rem 0.85rem;
        border: 1.5px solid #ddd;
        border-radius: 6px;
        font-size: 0.93rem;
        font-family: inherit;
        color: #1a1a2e;
        background: #fff;
        outline: none;
        transition: border-color 0.2s;
      }
      .form-ctrl:focus {
        border-color: #2e7d6b;
        box-shadow: 0 0 0 3px rgba(46, 125, 107, 0.1);
      }
      .err {
        color: #d32f2f;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
      }

      .input-prefix-group {
        display: flex;
      }
      .input-prefix {
        padding: 0.6rem 0.75rem;
        background: #f0f0f0;
        border: 1.5px solid #ddd;
        border-right: none;
        border-radius: 6px 0 0 6px;
        font-size: 0.9rem;
        color: #666;
      }
      .input-prefix + .form-ctrl {
        border-radius: 0 6px 6px 0;
      }

      .btn-primary {
        width: 100%;
        padding: 0.7rem;
        background: #2e7d6b;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: background 0.2s;
      }
      .btn-primary:hover:not(:disabled) {
        background: #1f5c4f;
      }
      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spinner {
        width: 18px;
        height: 18px;
        border: 2.5px solid rgba(255, 255, 255, 0.4);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        display: inline-block;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .otp-section {
        text-align: center;
      }
      .otp-info {
        color: #555;
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }
      .otp-info strong {
        color: #1a1a2e;
      }
      .firebase-note {
        color: #2e7d6b;
        font-size: 0.8rem;
      }

      .resend-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        font-size: 0.85rem;
      }
      .resend-timer {
        color: #999;
      }
      .btn-link {
        background: none;
        border: none;
        cursor: pointer;
        color: #2e7d6b;
        font-size: 0.85rem;
        font-weight: 500;
        text-decoration: underline;
        padding: 0;
      }
      .btn-link:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .footer-text {
        text-align: center;
        margin-top: 1.25rem;
        font-size: 0.88rem;
        color: #666;
      }
      .footer-text a {
        color: #2e7d6b;
        font-weight: 500;
      }
    `,
  ],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  @ViewChild("otpInput") otpInputRef?: OtpInputComponent;

  step: Step = "mobile";
  loading = false;
  alertMsg = "";
  alertType: "success" | "error" = "error";
  otp = "";
  mobile = "";
  resendTimer = 0;
  private resendInterval?: ReturnType<typeof setInterval>;

  mobileForm = this.fb.group({
    mobile: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.firebaseService.setupRecaptcha("login-otp-btn");
  }

  ngOnDestroy(): void {
    this.firebaseService.clearRecaptcha();
    clearInterval(this.resendInterval);
  }

  async sendOtp(): Promise<void> {
    if (this.mobileForm.invalid) {
      this.mobileForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.alertMsg = "";
    this.mobile = this.mobileForm.value.mobile!;

    // Step 1: Check DB — is this mobile registered and active?
    this.authService.checkMobileRegistered(this.mobile).subscribe({
      next: async (res) => {
        if (!res.success) {
          // Not registered / locked / not verified — stop, no OTP sent
          this.loading = false;
          this.showAlert("error", res.message);
          return;
        }

        // Step 2: Mobile confirmed in DB — now trigger Firebase OTP
        try {
          await this.firebaseService.sendOtp(this.mobile);
          this.loading = false;
          this.step = "otp";
          this.startResendTimer();
          this.showAlert(
            "success",
            `OTP sent to +91 XXXXXX${this.mobile.slice(-4)}`,
          );
        } catch (err: any) {
          this.loading = false;
          this.showAlert("error", this.parseFirebaseError(err));
          this.firebaseService.setupRecaptcha("login-otp-btn");
        }
      },
      error: () => {
        this.loading = false;
        this.showAlert("error", "Unable to verify mobile. Please try again.");
      },
    });
  }

  onOtpChange(val: string): void {
    this.otp = val;
  }

  async verifyOtp(): Promise<void> {
    if (this.otp.length < 6) return;
    this.loading = true;
    this.alertMsg = "";

    try {
      const firebaseIdToken = await this.firebaseService.verifyOtp(this.otp);

      this.authService
        .loginWithFirebase({
          mobile: this.mobile,
          firebaseIdToken,
        })
        .subscribe({
          next: (res) => {
            this.loading = false;
            if (res.success) {
              this.router.navigate(["/dashboard"]);
            } else {
              this.showAlert("error", res.message);
              this.otpInputRef?.reset();
              this.otp = "";
            }
          },
          error: (err) => {
            this.loading = false;
            this.showAlert(
              "error",
              err.error?.message ?? "Login failed. Please try again.",
            );
            this.otpInputRef?.reset();
            this.otp = "";
          },
        });
    } catch (err: any) {
      this.loading = false;
      this.showAlert("error", this.parseFirebaseError(err));
      this.otpInputRef?.reset();
      this.otp = "";
    }
  }

  async resendOtp(): Promise<void> {
    this.loading = true;
    this.firebaseService.setupRecaptcha("login-otp-btn");
    try {
      await this.firebaseService.sendOtp(this.mobile);
      this.loading = false;
      this.startResendTimer();
      this.showAlert("success", "OTP resent successfully.");
    } catch (err: any) {
      this.loading = false;
      this.showAlert("error", this.parseFirebaseError(err));
    }
  }

  goBack(): void {
    this.step = "mobile";
    this.alertMsg = "";
    clearInterval(this.resendInterval);
    setTimeout(() => this.firebaseService.setupRecaptcha("login-otp-btn"), 100);
  }

  private parseFirebaseError(err: any): string {
    const code = err?.code ?? "";
    const map: Record<string, string> = {
      "auth/invalid-phone-number": "Invalid phone number format.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/invalid-verification-code": "Incorrect OTP. Please try again.",
      "auth/code-expired": "OTP has expired. Please request a new one.",
      "auth/captcha-check-failed":
        "reCAPTCHA verification failed. Please retry.",
      "auth/quota-exceeded": "SMS quota exceeded. Please try again later.",
      "auth/user-not-found":
        "Mobile number not registered. Please register first.",
    };
    return (
      map[code] ?? err?.message ?? "Something went wrong. Please try again."
    );
  }

  private showAlert(type: "success" | "error", msg: string): void {
    this.alertType = type;
    this.alertMsg = msg;
  }

  private startResendTimer(): void {
    this.resendTimer = 60;
    clearInterval(this.resendInterval);
    this.resendInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) clearInterval(this.resendInterval);
    }, 1000);
  }
}
