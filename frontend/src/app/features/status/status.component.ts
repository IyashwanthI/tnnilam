import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

interface StatusRow {
  sno: number;
  applId: string;
  serviceType: string;
  district: string;
  taluk: string;
  village: string;
  surveyNo: string;
  submittedDate: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected";
}

@Component({
  selector: "app-status",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tn-page">
      <h1 class="page-title">APPLICATION STATUS</h1>

      <!-- Search bar -->
      <div class="search-bar">
        <input
          type="text"
          class="search-input"
          [(ngModel)]="searchId"
          placeholder="Enter Application ID"
          (keyup.enter)="onSearch()"
        />
        <button class="btn-search" (click)="onSearch()">Search</button>
      </div>

      <!-- Results table -->
      <div class="results-panel">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Application ID</th>
                <th>Service Type</th>
                <th>District</th>
                <th>Taluk</th>
                <th>Village</th>
                <th>Survey No</th>
                <th>Submitted Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (row of displayRows; track row.applId) {
                <tr>
                  <td>{{ row.sno }}</td>
                  <td>
                    <strong>{{ row.applId }}</strong>
                  </td>
                  <td>{{ row.serviceType }}</td>
                  <td>{{ row.district }}</td>
                  <td>{{ row.taluk }}</td>
                  <td>{{ row.village }}</td>
                  <td>{{ row.surveyNo }}</td>
                  <td>{{ row.submittedDate }}</td>
                  <td>
                    <span
                      [class]="
                        'status-badge status-' +
                        row.status.toLowerCase().replace(' ', '-')
                      "
                    >
                      {{ row.status }}
                    </span>
                  </td>
                </tr>
              }
              @if (displayRows.length === 0) {
                <tr>
                  <td colspan="9" class="no-data">No records found.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="contact-footer no-print">CONTACT US</div>
    </div>
  `,
  styles: [
    `
      .tn-page {
        padding: 1.5rem 1.5rem 0;
        max-width: 1100px;
        margin: 0 auto;
      }
      .search-bar {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        max-width: 500px;
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
        white-space: nowrap;
      }
      .btn-search:hover {
        background: #1f5c4f;
      }
      .results-panel {
        background: #fff;
        border: 1px solid #e0ddd0;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
        overflow: hidden;
        margin-bottom: 1.5rem;
      }
      .table-wrapper {
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.88rem;
        min-width: 800px;
      }
      th {
        background: #fff;
        color: #4a90d9;
        padding: 0.7rem 0.9rem;
        text-align: left;
        font-weight: 600;
        border-bottom: 2px solid #e0ddd0;
        white-space: nowrap;
      }
      td {
        padding: 0.65rem 0.9rem;
        border-bottom: 1px solid #f0ede4;
        color: #333;
      }
      tr:nth-child(even) td {
        background: #fafaf7;
      }
      tr:hover td {
        background: #f0f8f5;
      }
      .no-data {
        text-align: center;
        color: #aaa;
        font-style: italic;
        padding: 1.5rem;
      }
      .status-badge {
        display: inline-block;
        padding: 0.2rem 0.65rem;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 600;
        white-space: nowrap;
      }
      .status-submitted {
        background: #e3f2fd;
        color: #1565c0;
      }
      .status-under-review {
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
    `,
  ],
})
export class StatusComponent {
  searchId = "";

  private sampleRows: StatusRow[] = [
    {
      sno: 1,
      applId: "FLN20240001",
      serviceType: "F-LINE Appeal",
      district: "Chennai",
      taluk: "Egmore",
      village: "Nungambakkam",
      surveyNo: "45/2",
      submittedDate: "2024-01-15",
      status: "Approved",
    },
    {
      sno: 2,
      applId: "NISD20240002",
      serviceType: "Not Involving Subdivision",
      district: "Coimbatore",
      taluk: "Coimbatore North",
      village: "Peelamedu",
      surveyNo: "112/1A",
      submittedDate: "2024-02-20",
      status: "Under Review",
    },
    {
      sno: 3,
      applId: "ISD20240003",
      serviceType: "Involving Subdivision",
      district: "Madurai",
      taluk: "Madurai North",
      village: "Avaniyapuram",
      surveyNo: "78/3",
      submittedDate: "2024-03-05",
      status: "Submitted",
    },
  ];

  displayRows: StatusRow[] = [...this.sampleRows];

  onSearch(): void {
    const q = this.searchId.trim().toLowerCase();
    if (!q) {
      this.displayRows = [...this.sampleRows];
      return;
    }
    this.displayRows = this.sampleRows.filter((r) =>
      r.applId.toLowerCase().includes(q),
    );
  }
}
