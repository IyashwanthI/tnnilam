import { Component, OnInit, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AppealService } from "../../../core/services/appeal.service";
import { LocationService } from "../../../core/services/location.service";
import { AuthService } from "../../../core/services/auth.service";
import { District, Taluk, Village } from "../../../core/models/location.model";

@Component({
  selector: "app-new-appeal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <a routerLink="/appeals" class="back-link">← My Appeals</a>
        <h1>Submit F-Line Appeal</h1>
        <p>Fill in the details below to submit your Field Line appeal</p>
      </div>

      @if (successApplId) {
        <div class="success-banner">
          <div class="success-icon">✅</div>
          <div>
            <h3>Appeal Submitted Successfully!</h3>
            <p>
              Your application ID is: <strong>{{ successApplId }}</strong>
            </p>
            <p>
              You can track the status in
              <a routerLink="/appeals">My Appeals</a>.
            </p>
          </div>
        </div>
      } @else {
        @if (alertMsg) {
          <div class="alert alert-error">{{ alertMsg }}</div>
        }

        <form
          [formGroup]="appealForm"
          (ngSubmit)="submit()"
          novalidate
          class="appeal-form card"
        >
          <!-- Section: Applicant -->
          <div class="form-section">
            <h2 class="section-title">Applicant Details</h2>

            <div class="form-row">
              <div class="form-group">
                <label for="applicantName"
                  >Applicant Name <span class="required">*</span></label
                >
                <input
                  id="applicantName"
                  type="text"
                  class="form-control"
                  formControlName="applicantName"
                  placeholder="Full name as per records"
                />
                @if (f["applicantName"].invalid && f["applicantName"].touched) {
                  <span class="error-msg"
                    >Applicant name is required (min 2 characters).</span
                  >
                }
              </div>
            </div>

            <div class="form-row two-col">
              <div class="form-group">
                <label>Mobile</label>
                <input
                  type="text"
                  class="form-control"
                  [value]="userMobile()"
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Section: Land Details -->
          <div class="form-section">
            <h2 class="section-title">Land Location</h2>

            <div class="form-row three-col">
              <div class="form-group">
                <label for="districtCode"
                  >District <span class="required">*</span></label
                >
                <select
                  id="districtCode"
                  class="form-control"
                  formControlName="districtCode"
                  (change)="onDistrictChange()"
                >
                  <option value="">-- Select District --</option>
                  @for (d of districts; track d.districtCode) {
                    <option [value]="d.districtCode">
                      {{ d.districtName }}
                    </option>
                  }
                </select>
                @if (f["districtCode"].invalid && f["districtCode"].touched) {
                  <span class="error-msg">District is required.</span>
                }
              </div>

              <div class="form-group">
                <label for="talukCode"
                  >Taluk <span class="required">*</span></label
                >
                <select
                  id="talukCode"
                  class="form-control"
                  formControlName="talukCode"
                  (change)="onTalukChange()"
                  [attr.disabled]="!taluks.length || null"
                >
                  <option value="">-- Select Taluk --</option>
                  @for (t of taluks; track t.talukCode) {
                    <option [value]="t.talukCode">{{ t.talukName }}</option>
                  }
                </select>
                @if (f["talukCode"].invalid && f["talukCode"].touched) {
                  <span class="error-msg">Taluk is required.</span>
                }
              </div>

              <div class="form-group">
                <label for="villageCode"
                  >Village <span class="required">*</span></label
                >
                <select
                  id="villageCode"
                  class="form-control"
                  formControlName="villageCode"
                  [attr.disabled]="!villages.length || null"
                >
                  <option value="">-- Select Village --</option>
                  @for (v of villages; track v.villageCode) {
                    <option [value]="v.villageCode">{{ v.villageName }}</option>
                  }
                </select>
                @if (f["villageCode"].invalid && f["villageCode"].touched) {
                  <span class="error-msg">Village is required.</span>
                }
              </div>
            </div>

            <div class="form-row three-col">
              <div class="form-group">
                <label for="surveyNo"
                  >Survey No. <span class="required">*</span></label
                >
                <input
                  id="surveyNo"
                  type="text"
                  class="form-control"
                  formControlName="surveyNo"
                  placeholder="e.g. 123"
                />
                @if (f["surveyNo"].invalid && f["surveyNo"].touched) {
                  <span class="error-msg">Survey number is required.</span>
                }
              </div>

              <div class="form-group">
                <label for="subdivNo">Sub-Division No.</label>
                <input
                  id="subdivNo"
                  type="text"
                  class="form-control"
                  formControlName="subdivNo"
                  placeholder="e.g. 1A"
                />
              </div>

              <div class="form-group">
                <label for="pattaNo">Patta No.</label>
                <input
                  id="pattaNo"
                  type="text"
                  class="form-control"
                  formControlName="pattaNo"
                  placeholder="Patta number"
                />
              </div>
            </div>

            <div class="form-row two-col">
              <div class="form-group">
                <label for="extentHect">Extent (Hectares)</label>
                <input
                  id="extentHect"
                  type="number"
                  class="form-control"
                  formControlName="extentHect"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div class="form-group">
                <label for="extentAres">Extent (Ares)</label>
                <input
                  id="extentAres"
                  type="number"
                  class="form-control"
                  formControlName="extentAres"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          <!-- Section: Appeal Details -->
          <div class="form-section">
            <h2 class="section-title">Appeal Details</h2>

            <div class="form-group">
              <label for="refApplId">Reference Application ID (if any)</label>
              <input
                id="refApplId"
                type="text"
                class="form-control"
                formControlName="refApplId"
                placeholder="Previous application ID from misc_transfers"
              />
            </div>

            <div class="form-group">
              <label for="appealReason"
                >Reason for Appeal <span class="required">*</span></label
              >
              <textarea
                id="appealReason"
                class="form-control"
                formControlName="appealReason"
                rows="5"
                placeholder="Describe your appeal in detail (minimum 20 characters)..."
              ></textarea>
              <div class="char-count">
                {{ appealForm.get("appealReason")?.value?.length ?? 0 }} / 500
              </div>
              @if (f["appealReason"].invalid && f["appealReason"].touched) {
                <span class="error-msg"
                  >Appeal reason is required (min 20 characters).</span
                >
              }
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/appeals" class="btn btn-outline">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              @if (loading) {
                <span class="spinner"></span>
              }
              Submit Appeal
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [
    `
      .page-header {
        margin-bottom: 1.5rem;
      }
      .back-link {
        color: var(--primary);
        text-decoration: none;
        font-size: 0.88rem;
        display: inline-block;
        margin-bottom: 0.5rem;
      }
      .page-header h1 {
        font-size: 1.6rem;
        font-weight: 700;
        margin-bottom: 0.3rem;
      }
      .page-header p {
        color: var(--text-secondary);
      }

      .appeal-form {
        max-width: 860px;
      }

      .form-section {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--border);
      }
      .form-section:last-of-type {
        border-bottom: none;
      }
      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary);
        margin-bottom: 1.25rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--primary-light);
      }

      .form-row {
        margin-bottom: 0.25rem;
      }
      .two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .three-col {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
      }

      textarea.form-control {
        resize: vertical;
        min-height: 120px;
      }
      .char-count {
        text-align: right;
        font-size: 0.78rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding-top: 1rem;
      }

      .success-banner {
        display: flex;
        align-items: flex-start;
        gap: 1.25rem;
        background: #e8f5e9;
        border: 1px solid #a5d6a7;
        border-radius: var(--radius-lg);
        padding: 1.75rem;
        max-width: 600px;
      }
      .success-icon {
        font-size: 2.5rem;
      }
      .success-banner h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: var(--success);
      }
      .success-banner p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 0.3rem;
      }
      .success-banner a {
        color: var(--primary);
        font-weight: 500;
      }

      @media (max-width: 640px) {
        .two-col,
        .three-col {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class NewAppealComponent implements OnInit {
  districts: District[] = [];
  taluks: Taluk[] = [];
  villages: Village[] = [];
  loading = false;
  alertMsg = "";
  successApplId = "";

  userMobile = computed(() => this.authService.currentUser()?.mobile ?? "");

  appealForm = this.fb.group({
    applicantName: [
      "",
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    districtCode: ["", Validators.required],
    talukCode: ["", Validators.required],
    villageCode: ["", Validators.required],
    surveyNo: ["", [Validators.required, Validators.maxLength(6)]],
    subdivNo: [""],
    pattaNo: [""],
    refApplId: [""],
    appealReason: [
      "",
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(500),
      ],
    ],
    extentHect: [null as number | null],
    extentAres: [null as number | null],
  });

  get f() {
    return this.appealForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private appealService: AppealService,
    private locationService: LocationService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Pre-fill applicant name from profile
    const user = this.authService.currentUser();
    if (user?.name) {
      this.appealForm.patchValue({ applicantName: user.name });
    }

    this.locationService.getDistricts().subscribe({
      next: (res) => {
        if (res.success) this.districts = res.data;
      },
    });
  }

  onDistrictChange(): void {
    const code = this.f["districtCode"].value;
    this.taluks = [];
    this.villages = [];
    this.appealForm.patchValue({ talukCode: "", villageCode: "" });

    if (code) {
      this.locationService.getTaluks(code).subscribe({
        next: (res) => {
          if (res.success) this.taluks = res.data;
        },
      });
    }
  }

  onTalukChange(): void {
    const distCode = this.f["districtCode"].value;
    const talukCode = this.f["talukCode"].value;
    this.villages = [];
    this.appealForm.patchValue({ villageCode: "" });

    if (distCode && talukCode) {
      this.locationService.getVillages(distCode, talukCode).subscribe({
        next: (res) => {
          if (res.success) this.villages = res.data;
        },
      });
    }
  }

  submit(): void {
    if (this.appealForm.invalid) {
      this.appealForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.alertMsg = "";

    const payload = this.appealForm.value as any;
    this.appealService.submitAppeal(payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.successApplId = res.data.applId;
        } else {
          this.alertMsg = res.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.alertMsg =
          err.error?.message ?? "Failed to submit appeal. Please try again.";
      },
    });
  }
}
