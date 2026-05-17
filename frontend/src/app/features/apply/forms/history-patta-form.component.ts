import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LocationService } from "../../../core/services/location.service";
import { District, Taluk, Village } from "../../../core/models/location.model";

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
  selector: "app-history-patta-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="tn-page">
      <h1 class="page-title">HISTORY OF PATTA TRANSFER</h1>

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
                <label>Patta No. <span class="req">*</span></label>
                <input
                  type="text"
                  class="form-ctrl"
                  formControlName="pattaNo"
                  placeholder="Patta number"
                />
                @if (f["pattaNo"].invalid && f["pattaNo"].touched) {
                  <span class="err">Patta number is required.</span>
                }
              </div>
            </div>

            <div class="form-row two-col">
              <div class="form-group">
                <label>From Date <span class="req">*</span></label>
                <input
                  type="date"
                  class="form-ctrl"
                  formControlName="fromDate"
                />
                @if (f["fromDate"].invalid && f["fromDate"].touched) {
                  <span class="err">From date is required.</span>
                }
              </div>
              <div class="form-group">
                <label>To Date <span class="req">*</span></label>
                <input type="date" class="form-ctrl" formControlName="toDate" />
                @if (f["toDate"].invalid && f["toDate"].touched) {
                  <span class="err">To date is required.</span>
                }
              </div>
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
export class HistoryPattaFormComponent implements OnInit {
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
    pattaNo: ["", Validators.required],
    fromDate: ["", Validators.required],
    toDate: ["", Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private router: Router,
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
    setTimeout(() => {
      this.loading = false;
      this.submitted = true;
      this.applId = "HPT" + Date.now().toString().slice(-8);
    }, 800);
  }

  downloadAck(): void {
    window.print();
  }
  goBack(): void {
    this.router.navigate(["/apply"]);
  }
}
