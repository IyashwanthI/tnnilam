import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AppealService } from "../../core/services/appeal.service";
import { FlineAppealResponse } from "../../core/models/appeal.model";

@Component({
  selector: "app-reprint-ack",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tn-page">
      <h1 class="page-title">REPRINT ACKNOWLEDGEMENT</h1>

      <!-- Search -->
      <div class="search-bar no-print">
        <input
          type="text"
          class="search-input"
          [(ngModel)]="applId"
          placeholder="Enter Application ID"
          (keyup.enter)="onSearch()"
        />
        <button class="btn-search" (click)="onSearch()" [disabled]="loading">
          @if (loading) {
            <span class="spin-dark"></span>
          }
          Search
        </button>
      </div>

      @if (errorMsg) {
        <div class="alert-error no-print">⚠️ {{ errorMsg }}</div>
      }

      <!-- Acknowledgement Preview -->
      @if (appeal) {
        <div class="ack-card" id="ack-print-area">
          <!-- Print header -->
          <div class="ack-header">
            <div class="ack-logo">🌿</div>
            <div class="ack-title-block">
              <h2 class="ack-main-title">Tamil Nilam</h2>
              <p class="ack-sub-title">Tamil Nadu Land Records Department</p>
              <p class="ack-sub-title">
                Citizen Portal — Application Acknowledgement
              </p>
            </div>
          </div>

          <div class="ack-divider"></div>

          <div class="ack-section">
            <div class="ack-row">
              <span class="ack-label">Application ID</span>
              <span class="ack-value"
                ><strong>{{ appeal.applId }}</strong></span
              >
            </div>
            <div class="ack-row">
              <span class="ack-label">Submitted Date</span>
              <span class="ack-value">{{
                appeal.submitDt | date: "dd-MM-yyyy"
              }}</span>
            </div>
            <div class="ack-row">
              <span class="ack-label">Service Type</span>
              <span class="ack-value">F-LINE Appeal</span>
            </div>
            <div class="ack-row">
              <span class="ack-label">Status</span>
              <span class="ack-value">
                <span
                  [class]="'status-badge status-' + appeal.status.toLowerCase()"
                >
                  {{ appeal.status }}
                </span>
              </span>
            </div>
          </div>

          <div class="ack-divider"></div>

          <h3 class="ack-section-title">Applicant Details</h3>
          <div class="ack-section">
            <div class="ack-row">
              <span class="ack-label">Applicant Name</span>
              <span class="ack-value">{{ appeal.applicantName }}</span>
            </div>
            <div class="ack-row">
              <span class="ack-label">Mobile Number</span>
              <span class="ack-value">{{ appeal.mobile }}</span>
            </div>
          </div>

          <div class="ack-divider"></div>

          <h3 class="ack-section-title">Land Details</h3>
          <div class="ack-section">
            <div class="ack-row">
              <span class="ack-label">District</span>
              <span class="ack-value">{{ appeal.districtName }}</span>
            </div>
            <div class="ack-row">
              <span class="ack-label">Taluk</span>
              <span class="ack-value">{{ appeal.talukName }}</span>
            </div>
            <div class="ack-row">
              <span class="ack-label">Village</span>
              <span class="ack-value">{{ appeal.villageName }}</span>
            </div>
            <div class="ack-row">
              <span class="ack-label">Survey No.</span>
              <span class="ack-value">{{ appeal.surveyNo }}</span>
            </div>
            @if (appeal.subdivNo) {
              <div class="ack-row">
                <span class="ack-label">Sub Division No.</span>
                <span class="ack-value">{{ appeal.subdivNo }}</span>
              </div>
            }
            @if (appeal.pattaNo) {
              <div class="ack-row">
                <span class="ack-label">Patta No.</span>
                <span class="ack-value">{{ appeal.pattaNo }}</span>
              </div>
            }
          </div>

          <div class="ack-divider"></div>

          <div class="ack-footer-note">
            This is a computer generated acknowledgement. No signature required.
          </div>
        </div>

        <!-- Download button -->
        <div class="download-actions no-print">
          <button class="btn-download" (click)="downloadPdf()">
            🖨️ Download / Print PDF
          </button>
        </div>
      }

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
      .search-bar {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        max-width: 480px;
      }
      .search-input {
        flex: 1;
        padding: 0.6rem 1rem;
        border: 1.5px solid #ddd;
        border-radius: 6px;
        font-size: 0.92rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s;
      }
      .search-input:focus {
        border-color: #2e7d6b;
      }
      .btn-search {
        background: #2e7d6b;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 0.6rem 1.5rem;
        font-size: 0.92rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
      .btn-search:hover:not(:disabled) {
        background: #1f5c4f;
      }
      .btn-search:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .spin-dark {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.4);
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
      .alert-error {
        background: #ffebee;
        color: #b71c1c;
        border-left: 4px solid #d32f2f;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }

      /* Acknowledgement card */
      .ack-card {
        background: #fff;
        border: 1px solid #e0ddd0;
        border-radius: 10px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
        margin-bottom: 1rem;
      }
      .ack-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .ack-logo {
        font-size: 2.5rem;
      }
      .ack-main-title {
        font-size: 1.4rem;
        font-weight: 700;
        color: #2e7d6b;
        margin: 0;
      }
      .ack-sub-title {
        font-size: 0.82rem;
        color: #666;
        margin: 0.1rem 0 0;
      }
      .ack-divider {
        border: none;
        border-top: 1px solid #e0ddd0;
        margin: 1rem 0;
      }
      .ack-section-title {
        font-size: 0.9rem;
        font-weight: 700;
        color: #2e7d6b;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .ack-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .ack-row {
        display: flex;
        gap: 1rem;
      }
      .ack-label {
        min-width: 160px;
        font-size: 0.85rem;
        color: #888;
        font-weight: 500;
      }
      .ack-value {
        font-size: 0.9rem;
        color: #1a1a2e;
      }
      .status-badge {
        display: inline-block;
        padding: 0.2rem 0.65rem;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 600;
      }
      .status-submitted {
        background: #e3f2fd;
        color: #1565c0;
      }
      .status-under_review {
        background: #fff3e0;
        color: #e65100;
      }
      .status-approved {
        background: #e8f5e9;
        color: #1b5e20;
      }
      .status-rejected {
        background: #ffebee;
        color: #b71c1c;
      }
      .ack-footer-note {
        text-align: center;
        font-size: 0.8rem;
        color: #999;
        font-style: italic;
        margin-top: 1rem;
      }
      .download-actions {
        display: flex;
        justify-content: center;
        margin-bottom: 1.5rem;
      }
      .btn-download {
        background: #c8c4a0;
        color: #333;
        border: none;
        border-radius: 50px;
        padding: 0.7rem 2.5rem;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }
      .btn-download:hover {
        background: #b0ac88;
      }
      .contact-footer {
        background: #2e7d6b;
        color: #fff;
        text-align: center;
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        margin-top: 1rem;
      }

      /* Print styles */
      @media print {
        .no-print {
          display: none !important;
        }
        .ack-card {
          box-shadow: none;
          border: 1px solid #ccc;
          border-radius: 0;
          margin: 0;
          padding: 1.5rem;
        }
        body {
          background: white;
        }
      }
    `,
  ],
})
export class ReprintAckComponent {
  applId = "";
  loading = false;
  errorMsg = "";
  appeal: FlineAppealResponse | null = null;

  constructor(private appealService: AppealService) {}

  onSearch(): void {
    const id = this.applId.trim();
    if (!id) {
      this.errorMsg = "Please enter an Application ID.";
      return;
    }
    this.loading = true;
    this.errorMsg = "";
    this.appeal = null;

    this.appealService.getAppeal(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.appeal = res.data;
        } else {
          this.errorMsg = res.message ?? "Application not found.";
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err.error?.message ?? "Application not found. Please check the ID.";
      },
    });
  }

  downloadPdf(): void {
    window.print();
  }
}
