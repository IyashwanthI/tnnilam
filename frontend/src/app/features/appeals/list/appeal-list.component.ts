import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AppealService } from "../../../core/services/appeal.service";
import { FlineAppealResponse } from "../../../core/models/appeal.model";

@Component({
  selector: "app-appeal-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <div>
          <h1>My F-Line Appeals</h1>
          <p>Track all your submitted appeals</p>
        </div>
        <a routerLink="/appeals/new" class="btn btn-primary">+ New Appeal</a>
      </div>

      @if (loading) {
        <div class="loading-state">
          <span
            class="spinner"
            style="border-color:rgba(26,107,60,.3);border-top-color:var(--primary);width:32px;height:32px;border-width:3px"
          ></span>
          <p>Loading your appeals...</p>
        </div>
      } @else if (appeals.length === 0) {
        <div class="empty-state card">
          <div class="empty-icon">📋</div>
          <h3>No Appeals Yet</h3>
          <p>
            You haven't submitted any F-Line appeals. Click the button below to
            get started.
          </p>
          <a
            routerLink="/appeals/new"
            class="btn btn-primary"
            style="margin-top:1rem"
            >Submit Your First Appeal</a
          >
        </div>
      } @else {
        <div class="table-wrapper card">
          <table>
            <thead>
              <tr>
                <th>Application ID</th>
                <th>District</th>
                <th>Taluk</th>
                <th>Village</th>
                <th>Survey No.</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @for (appeal of appeals; track appeal.applId) {
                <tr>
                  <td>
                    <code>{{ appeal.applId }}</code>
                  </td>
                  <td>{{ appeal.districtName || appeal.districtCode }}</td>
                  <td>{{ appeal.talukName || appeal.talukCode }}</td>
                  <td>{{ appeal.villageName || appeal.villageCode }}</td>
                  <td>
                    {{ appeal.surveyNo
                    }}{{ appeal.subdivNo ? "/" + appeal.subdivNo : "" }}
                  </td>
                  <td>{{ appeal.submitDt | date: "dd/MM/yyyy HH:mm" }}</td>
                  <td>
                    <span
                      class="badge"
                      [class]="'badge-' + appeal.status.toLowerCase()"
                    >
                      {{ appeal.status | titlecase }}
                    </span>
                  </td>
                  <td>
                    <a
                      [routerLink]="['/appeals', appeal.applId]"
                      class="btn btn-outline btn-sm"
                    >
                      View
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
      }
      .page-header h1 {
        font-size: 1.6rem;
        font-weight: 700;
        margin-bottom: 0.3rem;
      }
      .page-header p {
        color: var(--text-secondary);
      }

      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 3rem;
        color: var(--text-secondary);
      }

      .empty-state {
        text-align: center;
        padding: 3rem;
        max-width: 480px;
        margin: 0 auto;
      }
      .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      .empty-state h3 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
      }
      .empty-state p {
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      code {
        font-family: monospace;
        font-size: 0.82rem;
        background: #f0f0f0;
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
      }
    `,
  ],
})
export class AppealListComponent implements OnInit {
  appeals: FlineAppealResponse[] = [];
  loading = true;

  constructor(private appealService: AppealService) {}

  ngOnInit(): void {
    this.appealService.getMyAppeals().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.appeals = res.data;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
