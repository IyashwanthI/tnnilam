import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { AppealService } from "../../../core/services/appeal.service";
import { FlineAppealResponse } from "../../../core/models/appeal.model";

@Component({
  selector: "app-appeal-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <a routerLink="/appeals" class="back-link">← Back to My Appeals</a>

      @if (loading) {
        <div class="loading-state">
          <span
            class="spinner"
            style="border-color:rgba(26,107,60,.3);border-top-color:var(--primary);width:32px;height:32px;border-width:3px"
          ></span>
        </div>
      } @else if (!appeal) {
        <div class="alert alert-error">Appeal not found or access denied.</div>
      } @else {
        <div class="detail-header">
          <div>
            <h1>Appeal Details</h1>
            <code class="appl-id">{{ appeal.applId }}</code>
          </div>
          <span class="badge" [class]="'badge-' + appeal.status.toLowerCase()">
            {{ appeal.status | titlecase }}
          </span>
        </div>

        <div class="detail-grid">
          <!-- Applicant Info -->
          <div class="detail-card card">
            <h2>Applicant Information</h2>
            <div class="detail-row">
              <span class="detail-label">Name</span>
              <span>{{ appeal.applicantName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mobile</span>
              <span>{{ appeal.mobile }}</span>
            </div>
          </div>

          <!-- Land Details -->
          <div class="detail-card card">
            <h2>Land Details</h2>
            <div class="detail-row">
              <span class="detail-label">District</span>
              <span>{{ appeal.districtName || appeal.districtCode }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Taluk</span>
              <span>{{ appeal.talukName || appeal.talukCode }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Village</span>
              <span>{{ appeal.villageName || appeal.villageCode }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Survey No.</span>
              <span>{{ appeal.surveyNo }}</span>
            </div>
            @if (appeal.subdivNo) {
              <div class="detail-row">
                <span class="detail-label">Sub-Division No.</span>
                <span>{{ appeal.subdivNo }}</span>
              </div>
            }
            @if (appeal.pattaNo) {
              <div class="detail-row">
                <span class="detail-label">Patta No.</span>
                <span>{{ appeal.pattaNo }}</span>
              </div>
            }
            @if (appeal.extentHect) {
              <div class="detail-row">
                <span class="detail-label">Extent</span>
                <span
                  >{{ appeal.extentHect }} Ha
                  {{
                    appeal.extentAres ? "/ " + appeal.extentAres + " Ares" : ""
                  }}</span
                >
              </div>
            }
          </div>

          <!-- Appeal Info -->
          <div class="detail-card card full-width">
            <h2>Appeal Information</h2>
            @if (appeal.refApplId) {
              <div class="detail-row">
                <span class="detail-label">Reference Appl. ID</span>
                <span
                  ><code>{{ appeal.refApplId }}</code></span
                >
              </div>
            }
            <div class="detail-row">
              <span class="detail-label">Submitted On</span>
              <span>{{ appeal.submitDt | date: "dd MMMM yyyy, hh:mm a" }}</span>
            </div>
            @if (appeal.updateDt) {
              <div class="detail-row">
                <span class="detail-label">Last Updated</span>
                <span>{{
                  appeal.updateDt | date: "dd MMMM yyyy, hh:mm a"
                }}</span>
              </div>
            }
            <div class="detail-row reason-row">
              <span class="detail-label">Reason for Appeal</span>
              <span class="reason-text">{{ appeal.appealReason }}</span>
            </div>
            @if (appeal.remarks) {
              <div class="detail-row reason-row">
                <span class="detail-label">Official Remarks</span>
                <span class="reason-text remarks">{{ appeal.remarks }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Status timeline -->
        <div class="timeline-card card">
          <h2>Status Timeline</h2>
          <div class="timeline">
            <div class="timeline-item" [class.done]="true">
              <div class="tl-dot done"></div>
              <div class="tl-content">
                <strong>Submitted</strong>
                <span>{{ appeal.submitDt | date: "dd/MM/yyyy HH:mm" }}</span>
              </div>
            </div>
            <div
              class="timeline-item"
              [class.done]="
                ['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(appeal.status)
              "
            >
              <div
                class="tl-dot"
                [class.done]="
                  ['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(
                    appeal.status
                  )
                "
              ></div>
              <div class="tl-content">
                <strong>Under Review</strong>
                <span>Pending</span>
              </div>
            </div>
            <div
              class="timeline-item"
              [class.done]="['APPROVED', 'REJECTED'].includes(appeal.status)"
            >
              <div
                class="tl-dot"
                [class.done]="appeal.status === 'APPROVED'"
                [class.rejected]="appeal.status === 'REJECTED'"
              ></div>
              <div class="tl-content">
                <strong>{{
                  appeal.status === "REJECTED" ? "Rejected" : "Decision"
                }}</strong>
                <span>{{
                  ["APPROVED", "REJECTED"].includes(appeal.status)
                    ? (appeal.updateDt | date: "dd/MM/yyyy")
                    : "Pending"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .back-link {
        color: var(--primary);
        text-decoration: none;
        font-size: 0.88rem;
        display: inline-block;
        margin-bottom: 1rem;
      }

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
      }
      .detail-header h1 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.3rem;
      }
      .appl-id {
        font-family: monospace;
        font-size: 0.85rem;
        background: #f0f0f0;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
        margin-bottom: 1.25rem;
      }
      .full-width {
        grid-column: 1 / -1;
      }

      .detail-card h2 {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--primary);
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--primary-light);
      }

      .detail-row {
        display: flex;
        gap: 1rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
        font-size: 0.9rem;
      }
      .detail-row:last-child {
        border-bottom: none;
      }
      .detail-label {
        min-width: 140px;
        color: var(--text-secondary);
        font-weight: 500;
      }
      .reason-row {
        flex-direction: column;
        gap: 0.4rem;
      }
      .reason-text {
        line-height: 1.7;
        color: var(--text-secondary);
      }
      .remarks {
        background: #fff8e1;
        padding: 0.75rem;
        border-radius: var(--radius);
      }

      .timeline-card {
        margin-bottom: 1.5rem;
      }
      .timeline-card h2 {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--primary);
        margin-bottom: 1.25rem;
      }
      .timeline {
        display: flex;
        gap: 0;
      }
      .timeline-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
      }
      .timeline-item:not(:last-child)::after {
        content: "";
        position: absolute;
        top: 12px;
        left: 50%;
        width: 100%;
        height: 2px;
        background: var(--border);
        z-index: 0;
      }
      .timeline-item.done:not(:last-child)::after {
        background: var(--primary);
      }
      .tl-dot {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--border);
        border: 3px solid var(--white);
        box-shadow: 0 0 0 2px var(--border);
        z-index: 1;
        margin-bottom: 0.5rem;
      }
      .tl-dot.done {
        background: var(--primary);
        box-shadow: 0 0 0 2px var(--primary);
      }
      .tl-dot.rejected {
        background: var(--danger);
        box-shadow: 0 0 0 2px var(--danger);
      }
      .tl-content {
        text-align: center;
        font-size: 0.82rem;
      }
      .tl-content strong {
        display: block;
        margin-bottom: 0.2rem;
      }
      .tl-content span {
        color: var(--text-secondary);
      }

      .loading-state {
        display: flex;
        justify-content: center;
        padding: 3rem;
      }

      code {
        font-family: monospace;
        font-size: 0.82rem;
        background: #f0f0f0;
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
      }

      @media (max-width: 640px) {
        .detail-grid {
          grid-template-columns: 1fr;
        }
        .timeline {
          flex-direction: column;
          gap: 0.5rem;
        }
        .timeline-item::after {
          display: none;
        }
      }
    `,
  ],
})
export class AppealDetailComponent implements OnInit {
  appeal: FlineAppealResponse | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private appealService: AppealService,
  ) {}

  ngOnInit(): void {
    const applId = this.route.snapshot.paramMap.get("applId")!;
    this.appealService.getAppeal(applId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.appeal = res.data;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
