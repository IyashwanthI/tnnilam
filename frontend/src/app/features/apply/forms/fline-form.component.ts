import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LocationService } from "../../../core/services/location.service";
import { District, Taluk, Village } from "../../../core/models/location.model";
import { HttpClient } from "@angular/common/http";

const SERVICE_FORM_STYLES = `
  .tn-page { padding: 1.5rem 1.5rem 0; max-width: 800px; margin: 0 auto; }
  .form-card {
    background: #fff; border: 1px solid #e0ddd0;
    border-radius: 10px; padding: 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07); margin-bottom: 1.5rem;
  }
  .form-row { margin-bottom: 1rem; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .form-group { display: flex; flex-direction: column; }
  .form-group label { font-size: 0.85rem; color: #555; margin-bottom: 0.3rem; font-weight: 500; }
  .req { color: #d32f2f; }
  .form-ctrl {
    width: 100%; padding: 0.55rem 0.8rem;
    border: 1.5px solid #ddd; border-radius: 6px;
    font-size: 0.92rem; font-family: inherit;
    color: #1a1a2e; background: #fff; outline: none;
    transition: border-color 0.2s;
  }
  .form-ctrl:focus { border-color: #2e7d6b; box-shadow: 0 0 0 2px rgba(46,125,107,0.1); }
  textarea.form-ctrl { resize: vertical; min-height: 80px; }
  select.form-ctrl:disabled { background: #f5f5f5; cursor: not-allowed; }
  .err { color: #d32f2f; font-size: 0.8rem; margin-top: 0.2rem; }
  .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
  .btn-teal {
    background: #2e7d6b; color: #fff; border: none;
    border-radius: 6px; padding: 0.65rem 2rem;
    font-size: 0.92rem; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 0.5rem;
    transition: background 0.2s;
  }
  .btn-teal:hover:not(:disabled) { background: #1f5c4f; }
  .btn-teal:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-outline-teal {
    background: transparent; color: #2e7d6b;
    border: 2px solid #2e7d6b; border-radius: 6px;
    padding: 0.6rem 1.5rem; font-size: 0.92rem;
    font-weight: 600; cursor: pointer; transition: background 0.2s;
  }
  .btn-outline-teal:hover { background: #e8f5f2; }
  .btn-beige {
    background: #c8c4a0; color: #333; border: none;
    border-radius: 50px; padding: 0.65rem 2rem;
    font-size: 0.92rem; font-weight: 600; cursor: pointer;
    transition: background 0.2s;
  }
  .btn-beige:hover { background: #b0ac88; }
  .spin {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.7s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .success-card {
    background: #fff; border: 1px solid #a5d6a7;
    border-radius: 10px; padding: 2.5rem;
    text-align: center; margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  }
  .success-icon { font-size: 3rem; margin-bottom: 0.75rem; }
  .success-card h3 { color: #2e7d32; font-size: 1.2rem; margin-bottom: 0.5rem; }
  .success-card p { color: #555; margin-bottom: 1.25rem; }
  .success-actions { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
  .contact-footer {
    background: #2e7d6b; color: #fff;
    text-align: center; padding: 0.75rem 1rem;
    font-size: 0.9rem; font-weight: 600;
    letter-spacing: 0.05em; margin-top: 1rem;
  }
  @media (max-width: 600px) { .two-col { grid-template-columns: 1fr; } }
`;

@Component({
  selector: "app-fline-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="tn-page">
      <h1 class="page-title">MEASUREMENT OF FIELD BOUNDARY</h1>

      @if (submitted) {
        <div class="success-card">
          <div class="success-icon">✅</div>
          <h3>Application Submitted Successfully!</h3>
          <p>
            Your Application ID: <strong>{{ applId }}</strong>
          </p>
          <div class="success-actions">
            <button class="btn-beige" (click)="downloadAck()">
              📄 Download Acknowledgement
            </button>
            <button class="btn-outline-teal" (click)="goBack()">
              ← Back to Apply
            </button>
          </div>
        </div>
      } @else {
        <div class="form-card">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
            <div class="form-row two-col">
              <div class="form-group">
                <label>District <span class="req">*</span></label>
                <select
                  class="form-ctrl"
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
                  <span class="err">District is required.</span>
                }
              </div>
              <div class="form-group">
                <label>Taluk <span class="req">*</span></label>
                <select
                  class="form-ctrl"
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
                  <span class="err">Taluk is required.</span>
                }
              </div>
            </div>

            <div class="form-row two-col">
              <div class="form-group">
                <label>Village <span class="req">*</span></label>
                <select
                  class="form-ctrl"
                  formControlName="villageCode"
                  [attr.disabled]="!villages.length || null"
                >
                  <option value="">-- Select Village --</option>
                  @for (v of villages; track v.villageCode) {
                    <option [value]="v.villageCode">{{ v.villageName }}</option>
                  }
                </select>
                @if (f["villageCode"].invalid && f["villageCode"].touched) {
                  <span class="err">Village is required.</span>
                }
              </div>
              <div class="form-group">
                <label>Survey No. <span class="req">*</span></label>
                <select class="form-ctrl" formControlName="surveyNo">
                  <option value="">-- Select Survey No --</option>
                  @for (s of surveyNumbers; track s) {
                    <option [value]="s">{{ s }}</option>
                  }
                </select>
                @if (f["surveyNo"].invalid && f["surveyNo"].touched) {
                  <span class="err">Survey number is required.</span>
                }
              </div>
            </div>
            <div class="form-group">
              <label>Boundary Type <span class="req">*</span></label>

              <select class="form-ctrl" formControlName="boundaryType">
                <option value="RURAL">Rural</option>
                <option value="URBAN">Urban</option>
              </select>
            </div>
            <div class="form-group">
              <label>Subdivision No. <span class="req">*</span></label>

              <input
                type="text"
                class="form-ctrl"
                formControlName="subdivisionNo"
                placeholder="e.g. 1A"
              />
            </div>
            <div class="form-group">
              <label>Drawing Type <span class="req">*</span></label>

              <select class="form-ctrl" formControlName="drawingType">
                <option value="">-- Select --</option>
                <option value="FMB">FMB Sketch</option>
                <option value="BOUNDARY">Boundary Sketch</option>
                <option value="SUBDIVISION">Subdivision Sketch</option>
              </select>
            </div>
            <div class="form-group">
              <label>No. of Boundaries <span class="req">*</span></label>

              <input
                type="number"
                min="1"
                class="form-ctrl"
                formControlName="noOfBoundaries"
              />
            </div>
            <div class="form-row two-col">
              <div class="form-group">
                <label>Patta No.</label>
                <input
                  type="text"
                  class="form-ctrl"
                  formControlName="pattaNo"
                  placeholder="Patta number"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Reason <span class="req">*</span></label>
                <textarea
                  class="form-ctrl"
                  formControlName="reason"
                  rows="3"
                  placeholder="Enter reason..."
                ></textarea>
                @if (f["reason"].invalid && f["reason"].touched) {
                  <span class="err">Reason is required.</span>
                }
              </div>
            </div>
            <div class="form-row">
              <label style="display:flex; gap:0.6rem; align-items:flex-start;">
                <input
                  type="checkbox"
                  formControlName="declaration"
                  style="margin-top:4px;"
                />

                <span>
                  I hereby declare that I am the Pattadhar / Power Agent or
                  Legal heir of the Pattadhar. I am aware that my application
                  will not be processed if the information given by me is found
                  incorrect. Further, the fees remitted will not be refunded.
                </span>
              </label>

              @if (f["declaration"].invalid && f["declaration"].touched) {
                <span class="err"> You must accept the declaration. </span>
              }
            </div>
            <div
              style="
              background:#fff8e1;
              border:1px solid #e6d38a;
              padding:1rem;
              border-radius:8px;
              margin-top:1rem;
            "
            >
              <strong>Fee Details</strong>

              <ul style="margin-top:0.5rem;">
                <li>Application Fee: Rs. 60</li>

                <li>
                  Boundary Fee for Rural: Rs. 200 per boundary + taxes
                  applicable
                </li>

                <li>
                  Boundary Fee for Urban: Rs. 200 per boundary + taxes
                  applicable
                </li>
              </ul>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-outline-teal" (click)="goBack()">
                Cancel
              </button>
              <button type="submit" class="btn-teal" [disabled]="loading">
                @if (loading) {
                  <span class="spin"></span>
                }
                Submit Application
              </button>
            </div>
          </form>
        </div>
      }

      <div class="contact-footer no-print">CONTACT US</div>
    </div>
  `,
  styles: [SERVICE_FORM_STYLES],
})
export class FlineFormComponent implements OnInit {
  get totalPayment(): number {

  const boundaries =
    this.form.value.noOfBoundaries || 0;

  return 60 + (boundaries * 200);
}

  districts: District[] = [];
  taluks: Taluk[] = [];
  villages: Village[] = [];
  loading = false;
  submitted = false;
  applId = "";

  form = this.fb.group({
    districtCode: ["", Validators.required],
    talukCode: ["", Validators.required],
    villageCode: ["", Validators.required],

    surveyNo: ["", Validators.required],
    subdivisionNo: ["", Validators.required],

    pattaNo: ["", Validators.required],

    boundaryType: ["RURAL", Validators.required],

    drawingType: ["", Validators.required],

    noOfBoundaries: [1, Validators.required],

    reason: ["", Validators.required],

    declaration: [false, Validators.requiredTrue],
  });
  surveyNumbers = Array.from({ length: 325 }, (_, i) => i + 1);
  get f() {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
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
    this.form.patchValue({ talukCode: "", villageCode: "" });
    if (code) {
      this.locationService.getTaluks(code).subscribe({
        next: (res) => {
          if (res.success) this.taluks = res.data;
        },
      });
    }
  }

  onTalukChange(): void {
    const dc = this.f["districtCode"].value;
    const tc = this.f["talukCode"].value;
    this.villages = [];
    this.form.patchValue({ villageCode: "" });
    if (dc && tc) {
      this.locationService.getVillages(dc, tc).subscribe({
        next: (res) => {
          if (res.success) this.villages = res.data;
        },
      });
    }
  }

  onSubmit(): void {

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading = true;

  const payload = {

    ...this.form.value,

    govtCharge: this.totalPayment,

    serviceCode: "FLN1"
  };

  this.http.post<any>(
    "http://localhost:8080/api/fline/apply",
    payload
  )
  .subscribe({

    next: (res) => {

      this.loading = false;

      if (res.success) {

        this.submitted = true;

        this.applId = res.data.applId;
      }
    },

    error: () => {

      this.loading = false;

      alert("Application submission failed");

    }
  });
}

  downloadAck(): void {
    window.print();
  }
  goBack(): void {
    this.router.navigate(["/apply"]);
  }
}
