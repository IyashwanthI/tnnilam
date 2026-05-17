import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

interface ServicePanel {
  title: string;
  rows: number;
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tn-page">
      <h1 class="page-title">DASHBOARD</h1>

      <div class="icon-center">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="12"
            width="72"
            height="48"
            rx="4"
            stroke="#2e7d6b"
            stroke-width="3"
            fill="#e8f5f2"
          />
          <rect
            x="12"
            y="20"
            width="56"
            height="32"
            rx="2"
            fill="#fff"
            stroke="#2e7d6b"
            stroke-width="1.5"
          />
          <polyline
            points="16,44 26,34 34,40 44,28 56,36"
            stroke="#4a90d9"
            stroke-width="2.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="26" cy="34" r="2.5" fill="#4a90d9" />
          <circle cx="34" cy="40" r="2.5" fill="#4a90d9" />
          <circle cx="44" cy="28" r="2.5" fill="#4a90d9" />
          <circle cx="56" cy="36" r="2.5" fill="#4a90d9" />
          <rect x="30" y="60" width="20" height="6" rx="1" fill="#2e7d6b" />
          <rect x="20" y="66" width="40" height="3" rx="1.5" fill="#2e7d6b" />
        </svg>
      </div>

      <div class="panels-grid">
        @for (panel of panels; track panel.title) {
          <div class="service-panel">
            <div class="panel-header">{{ panel.title }}</div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Applications Received</th>
                    <th>Fees Received</th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of getRows(panel.rows); track r) {
                    <tr>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  }
                  <tr class="no-data-row">
                    <td
                      colspan="4"
                      style="text-align:center; color:#aaa; font-style:italic; padding: 1rem;"
                    >
                      No data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        }
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
      .icon-center {
        display: flex;
        justify-content: center;
        margin-bottom: 1.5rem;
      }
      .panels-grid {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .service-panel {
        background: #fff;
        border: 1px solid #e0ddd0;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
        overflow: hidden;
      }
      .panel-header {
        background: #f0f0e8;
        padding: 0.6rem 1rem;
        font-weight: 700;
        font-size: 0.92rem;
        color: #2e7d6b;
        border-bottom: 1px solid #e0ddd0;
      }
      .table-wrapper {
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.88rem;
        min-width: 500px;
      }
      th {
        background: #fff;
        color: #4a90d9;
        padding: 0.6rem 1rem;
        text-align: left;
        font-weight: 600;
        border-bottom: 2px solid #e0ddd0;
      }
      td {
        padding: 0.55rem 1rem;
        border-bottom: 1px solid #f0ede4;
        color: #555;
      }
      tr:nth-child(even) td {
        background: #fafaf7;
      }
      .no-data-row td {
        background: #fff !important;
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
    `,
  ],
})
export class DashboardComponent {
  panels: ServicePanel[] = [
    { title: "ISD (Rural)", rows: 2 },
    { title: "NISD (Rural)", rows: 2 },
    { title: "FLINE (Rural)", rows: 2 },
    { title: "FLINE APPEAL", rows: 2 },
    { title: "History of Patta Transfer", rows: 2 },
  ];

  getRows(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }
}
