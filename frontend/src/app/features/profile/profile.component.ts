import { Component, OnInit, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { ProfileService } from "../../core/services/profile.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="tn-page">
      <h1 class="page-title">USER PROFILE</h1>

      <!-- Avatar -->
      <div class="avatar-center">
        <div class="avatar-circle">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="28" cy="20" r="12" fill="#2e7d6b" opacity="0.85" />
            <ellipse
              cx="28"
              cy="46"
              rx="18"
              ry="10"
              fill="#2e7d6b"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      @if (successMsg) {
        <div
          class="alert alert-success"
          style="max-width:600px; margin: 0 auto 1rem;"
        >
          ✅ {{ successMsg }}
        </div>
      }
      @if (errorMsg) {
        <div
          class="alert alert-error"
          style="max-width:600px; margin: 0 auto 1rem;"
        >
          ⚠️ {{ errorMsg }}
        </div>
      }

      <form
        [formGroup]="profileForm"
        (ngSubmit)="onSubmit()"
        class="profile-form"
        novalidate
      >
        <div class="form-row two-col">
          <div class="form-group">
            <label>Name <span class="req">*</span></label>
            <input
              type="text"
              class="form-control-underline"
              formControlName="name"
              placeholder="Enter your name"
            />
            @if (f["name"].invalid && f["name"].touched) {
              <span class="error-msg">Name is required.</span>
            }
          </div>
          <div class="form-group">
            <label>Tamil Name</label>
            <input
              type="text"
              class="form-control-underline"
              formControlName="tamilName"
              placeholder="தமிழ் பெயரை உள்ளிடவும்"
            />
          </div>
        </div>

        <div class="form-row two-col">
          <div class="form-group">
            <label
              >Father's Name / Husband's Name <span class="req">*</span></label
            >
            <input
              type="text"
              class="form-control-underline"
              formControlName="fatherOrHusbandName"
              placeholder="Enter Father/Husband Name"
            />
            @if (
              f["fatherOrHusbandName"].invalid &&
              f["fatherOrHusbandName"].touched
            ) {
              <span class="error-msg">This field is required.</span>
            }
          </div>
          <div class="form-group">
            <label>Mother's Name</label>
            <input
              type="text"
              class="form-control-underline"
              formControlName="motherName"
              placeholder="Enter Mother Name"
            />
          </div>
        </div>

        <div class="form-row two-col">
          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              class="form-control-underline"
              formControlName="email"
              placeholder="Enter Email"
            />
          </div>
          <div class="form-group">
            <label>Date of Birth <span class="req">*</span></label>
            <input
              type="date"
              class="form-control-underline"
              formControlName="dob"
            />
            @if (f["dob"].invalid && f["dob"].touched) {
              <span class="error-msg">Date of birth is required.</span>
            }
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Permanent Address <span class="req">*</span></label>
            <div class="textarea-wrap">
              <textarea
                class="form-control-underline"
                formControlName="permanentAddress"
                rows="2"
                placeholder="Enter Permanent Address"
              ></textarea>
              <span class="edit-icon">✏️</span>
            </div>
            @if (
              f["permanentAddress"].invalid && f["permanentAddress"].touched
            ) {
              <span class="error-msg">Permanent address is required.</span>
            }
          </div>
        </div>

        <div class="form-row temp-addr-row">
          <div class="form-group" style="flex:1">
            <label>Temporary Address <span class="req">*</span></label>
            <textarea
              class="form-control-underline"
              formControlName="temporaryAddress"
              rows="2"
              placeholder="Enter Temporary Address"
            ></textarea>
            @if (
              f["temporaryAddress"].invalid && f["temporaryAddress"].touched
            ) {
              <span class="error-msg">Temporary address is required.</span>
            }
          </div>
          <div class="same-as-above">
            <label class="checkbox-label">
              <input type="checkbox" (change)="onSameAsAbove($event)" />
              Same as Above
            </label>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Gender <span class="req">*</span></label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" formControlName="gender" value="Male" />
                Male
              </label>
              <label class="radio-label">
                <input type="radio" formControlName="gender" value="Female" />
                Female
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  formControlName="gender"
                  value="Transgender"
                />
                Transgender
              </label>
            </div>
            @if (f["gender"].invalid && f["gender"].touched) {
              <span class="error-msg">Gender is required.</span>
            }
          </div>
        </div>

        <div class="form-row">
          <label class="checkbox-label">
            <input type="checkbox" formControlName="isBuildingPromoter" />
            Are you a Building Promoter?
          </label>
        </div>

        @if (profileForm.get("isBuildingPromoter")?.value) {
          <div class="form-row">
            <div class="form-group">
              <label>Promoter Name</label>
              <input
                type="text"
                class="form-control-underline"
                formControlName="promoterName"
                placeholder="Enter Promoter Name"
              />
            </div>
          </div>
        }

        <div class="form-row">
          <label class="checkbox-label">
            <input type="checkbox" formControlName="isPowerAgent" />
            I am a Power Agent
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-update" [disabled]="loading">
            @if (loading) {
              <span class="spinner-dark"></span>
            }
            Update
          </button>
        </div>
      </form>

      <div class="contact-footer no-print">CONTACT US</div>
    </div>
  `,
  styles: [
    `
      .tn-page {
        padding: 1.5rem 1.5rem 0;
        max-width: 800px;
        margin: 0 auto;
      }
      .avatar-center {
        display: flex;
        justify-content: center;
        margin-bottom: 1.5rem;
      }
      .avatar-circle {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background: #e8f5f2;
        border: 3px solid #2e7d6b;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .profile-form {
        background: #fff;
        border: 1px solid #e0ddd0;
        border-radius: 10px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
      }
      .form-row {
        margin-bottom: 1.1rem;
      }
      .two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
      .form-group {
        display: flex;
        flex-direction: column;
      }
      .form-group label {
        font-size: 0.82rem;
        color: #888;
        margin-bottom: 0.2rem;
        font-weight: 500;
      }
      .req {
        color: #d32f2f;
      }
      .form-control-underline {
        width: 100%;
        padding: 0.4rem 0;
        border: none;
        border-bottom: 1.5px solid #bbb;
        border-radius: 0;
        font-size: 0.95rem;
        font-family: inherit;
        color: #1a1a2e;
        background: transparent;
        outline: none;
        transition: border-color 0.2s;
        resize: vertical;
      }
      .form-control-underline:focus {
        border-bottom-color: #2e7d6b;
      }
      .textarea-wrap {
        position: relative;
      }
      .edit-icon {
        position: absolute;
        right: 0;
        bottom: 4px;
        font-size: 0.85rem;
        cursor: pointer;
        opacity: 0.6;
      }
      .temp-addr-row {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
      }
      .same-as-above {
        padding-top: 1.6rem;
        white-space: nowrap;
      }
      .radio-group {
        display: flex;
        gap: 1.5rem;
        margin-top: 0.3rem;
      }
      .radio-label,
      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.92rem;
        cursor: pointer;
        color: #333;
      }
      .error-msg {
        color: #d32f2f;
        font-size: 0.8rem;
        margin-top: 0.2rem;
      }
      .form-actions {
        display: flex;
        justify-content: center;
        margin-top: 1.5rem;
      }
      .btn-update {
        background: #c8c4a0;
        color: #333;
        border: none;
        border-radius: 50px;
        padding: 0.65rem 3rem;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .btn-update:hover:not(:disabled) {
        background: #b0ac88;
      }
      .btn-update:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .spinner-dark {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(0, 0, 0, 0.2);
        border-top-color: #333;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        display: inline-block;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .alert-success {
        background: #e8f5e9;
        color: #1b5e20;
        border-left: 4px solid #2e7d32;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        font-size: 0.9rem;
      }
      .alert-error {
        background: #ffebee;
        color: #b71c1c;
        border-left: 4px solid #d32f2f;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        font-size: 0.9rem;
      }
      .contact-footer {
        background: #2e7d6b;
        color: #fff;
        text-align: center;
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        margin-top: 2rem;
      }
      @media (max-width: 600px) {
        .two-col {
          grid-template-columns: 1fr;
        }
        .temp-addr-row {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  loading = false;
  successMsg = "";
  errorMsg = "";

  profileForm = this.fb.group({
    name: ["", Validators.required],
    tamilName: [""],
    fatherOrHusbandName: ["", Validators.required],
    motherName: [""],
    email: [""],
    permanentAddress: ["", Validators.required],
    temporaryAddress: ["", Validators.required],
    dob: ["", Validators.required],
    gender: ["", Validators.required],
    isBuildingPromoter: [false],
    promoterName: [""],
    isPowerAgent: [false],
  });

  get f() {
    return this.profileForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name ?? "",
        email: user.email ?? "",
      });
    }
  }

  onSameAsAbove(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      const perm = this.profileForm.get("permanentAddress")?.value ?? "";
      this.profileForm.patchValue({ temporaryAddress: perm });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.successMsg = "";
    this.errorMsg = "";

    const payload = this.profileForm.value as any;
    this.profileService.updateProfile(payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.successMsg = "Profile updated successfully.";
        } else {
          this.errorMsg = res.message ?? "Update failed.";
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err.error?.message ?? "Failed to update profile. Please try again.";
      },
    });
  }
}
