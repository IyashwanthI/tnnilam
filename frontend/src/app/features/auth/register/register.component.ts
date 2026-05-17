import { Component, OnDestroy, ViewChild, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { FirebaseService } from "../../../core/services/firebase.service";
import { OtpInputComponent } from "../../../shared/otp-input/otp-input.component";

type Step = "form" | "otp";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, OtpInputComponent],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">🌿</div>
          <h1>Create Account</h1>
          <p>Register to access the F-Line Appeal Portal</p>
        </div>

        <!-- Step indicator -->
        <div class="steps">
          <div
            class="step"
            [class.active]="step === 'form'"
            [class.done]="step === 'otp'"
          >
            <span class="step-num">{{ step === "otp" ? "✓" : "1" }}</span>
            <span>Details</span>
          </div>
          <div class="step-line"></div>
          <div class="step" [class.active]="step === 'otp'">
            <span class="step-num">2</span>
            <span>Verify OTP</span>
          </div>
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

        <!-- Step 1: Details form -->
        @if (step === "form") {
          <form [formGroup]="regForm" (ngSubmit)="submitForm()" novalidate>
            <div class="form-group">
              <label for="name">Full Name <span class="req">*</span></label>
              <input
                id="name"
                type="text"
                class="form-ctrl"
                formControlName="name"
                placeholder="Enter your full name"
                autocomplete="name"
              />
              @if (f["name"].invalid && f["name"].touched) {
                <span class="err">{{ getError("name") }}</span>
              }
            </div>

            <div class="form-group">
              <label for="email"
                >Email Address <span class="req">*</span></label
              >
              <input
                id="email"
                type="email"
                class="form-ctrl"
                formControlName="email"
                placeholder="Enter your email"
                autocomplete="email"
              />
              @if (f["email"].invalid && f["email"].touched) {
                <span class="err">{{ getError("email") }}</span>
              }
            </div>

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
                />
              </div>
              @if (f["mobile"].invalid && f["mobile"].touched) {
                <span class="err">{{ getError("mobile") }}</span>
              }
            </div>

            <!-- Invisible reCAPTCHA anchor — Firebase attaches to this button -->
            <button
              id="send-otp-btn"
              type="submit"
              class="btn-primary btn-full"
              [disabled]="loading"
            >
              @if (loading) {
                <span class="spinner"></span>
              }
              Send OTP via SMS
            </button>
          </form>

          <p class="footer-text">
            Already have an account? <a routerLink="/auth/login">Login here</a>
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
              class="btn-primary btn-full"
              style="margin-top:1.5rem"
              (click)="verifyOtp()"
              [disabled]="loading || otp.length < 6"
            >
              @if (loading) {
                <span class="spinner"></span>
              }
              Verify & Register
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
                ← Change details
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
        max-width: 460px;
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

      .steps {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 1.75rem;
      }
      .step {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.85rem;
        color: #999;
      }
      .step.active {
        color: #2e7d6b;
        font-weight: 600;
      }
      .step.done {
        color: #2e7d32;
      }
      .step-num {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #e0ddd0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 700;
      }
      .step.active .step-num {
        background: #2e7d6b;
        color: #fff;
      }
      .step.done .step-num {
        background: #2e7d32;
        color: #fff;
      }
      .step-line {
        flex: 1;
        max-width: 60px;
        height: 2px;
        background: #e0ddd0;
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
      .btn-full {
        width: 100%;
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
export class RegisterComponent implements AfterViewInit, OnDestroy {
  @ViewChild("otpInput") otpInputRef?: OtpInputComponent;

  step: Step = "form";
  loading = false;
  alertMsg = "";
  alertType: "success" | "error" = "error";
  otp = "";
  mobile = "";
  resendTimer = 0;
  private resendInterval?: ReturnType<typeof setInterval>;

  regForm = this.fb.group({
    name: [
      "",
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    email: ["", [Validators.required, Validators.email]],
    mobile: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
  });

  get f() {
    return this.regForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    // Setup invisible reCAPTCHA on the submit button
    this.firebaseService.setupRecaptcha("send-otp-btn");
  }

  ngOnDestroy(): void {
    this.firebaseService.clearRecaptcha();
    clearInterval(this.resendInterval);
  }

  async submitForm(): Promise<void> {
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.alertMsg = "";
    this.mobile = this.regForm.value.mobile!;

    // Step 1: Check DB — confirm mobile/email not already registered
    this.authService.checkAvailability(this.regForm.value as any).subscribe({
      next: async (res) => {
        if (!res.success) {
          // Already registered — stop, no OTP sent
          this.loading = false;
          this.showAlert("error", res.message);
          return;
        }

        // Step 2: Available — trigger Firebase OTP
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
          const msg = this.parseFirebaseError(err);
          this.showAlert("error", msg);
          // Re-setup reCAPTCHA after failure
          this.firebaseService.setupRecaptcha("send-otp-btn");
        }
      },
      error: () => {
        this.loading = false;
        this.showAlert(
          "error",
          "Unable to check availability. Please try again.",
        );
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

      // Now register on our backend with the Firebase token
      this.authService
        .registerWithFirebase({
          name: this.regForm.value.name!,
          email: this.regForm.value.email!,
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
              err.error?.message ?? "Registration failed.",
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
    this.alertMsg = "";
    // Re-setup reCAPTCHA for resend
    this.firebaseService.setupRecaptcha("send-otp-btn");
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
    this.step = "form";
    this.alertMsg = "";
    clearInterval(this.resendInterval);
    // Re-setup reCAPTCHA when going back
    setTimeout(() => this.firebaseService.setupRecaptcha("send-otp-btn"), 100);
  }

  getError(field: string): string {
    const ctrl = this.f[field as keyof typeof this.f] as AbstractControl;
    if (ctrl.hasError("required")) return "This field is required.";
    if (ctrl.hasError("email")) return "Enter a valid email address.";
    if (ctrl.hasError("minlength"))
      return `Minimum ${ctrl.errors?.["minlength"].requiredLength} characters.`;
    if (ctrl.hasError("pattern"))
      return field === "mobile"
        ? "Enter a valid 10-digit Indian mobile number."
        : "Invalid format.";
    return "";
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
      "auth/missing-phone-number": "Phone number is required.",
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
