import { Component, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

interface ServiceButton {
  label: string;
  route: string;
  fullWidth?: boolean;
}

@Component({
  selector: "app-apply",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tn-page">
      <h1 class="page-title">APPLICANT'S DETAIL</h1>

      <div class="icon-center">
        <span style="font-size: 4rem; line-height:1;">👆</span>
      </div>

      <!-- User Details Panel -->
      <div class="user-panel">
        <div class="panel-title">User Details</div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Father Name</th>
                <th>Mobile Number</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ user()?.name || "—" }}</td>
                <td>—</td>
                <td>{{ user()?.mobile || "—" }}</td>
                <td>{{ user()?.email || "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Service Buttons -->
      <div class="service-grid">
        <button
          class="service-btn"
          (click)="navigate('/apply/not-involving-subdivision')"
        >
          Not Involving Subdivision
        </button>
        <button
          class="service-btn"
          (click)="navigate('/apply/involving-subdivision')"
        >
          Involving Subdivision
        </button>
        <button class="service-btn" (click)="navigate('/apply/fline')">
          Measurement of Field Boundary
        </button>
        <button class="service-btn" (click)="navigate('/apply/fline-appeal')">
          F-LINE Appeal
        </button>
        <button
          class="service-btn service-btn-full"
          (click)="navigate('/apply/history-patta')"
        >
          History of Patta Transfer
        </button>
      </div>

      <div class="contact-footer no-print">CONTACT US</div>
    </div>
  `,
  styles: [
    `
      .tn-page {
        padding: 1.5rem 1.5rem 0;
        max-width: 900px;
        margin: 0 auto;
      }
      .icon-center {
        display: flex;
        justify-content: center;
        margin-bottom: 1.5rem;
      }
      .user-panel {
        background: #fff;
        border: 1px solid #e0ddd0;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
        overflow: hidden;
        margin-bottom: 1.5rem;
      }
      .panel-title {
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
        font-size: 0.9rem;
        min-width: 400px;
      }
      th {
        background: #fff;
        color: #4a90d9;
        padding: 0.65rem 1rem;
        text-align: left;
        font-weight: 600;
        border-bottom: 2px solid #e0ddd0;
      }
      td {
        padding: 0.65rem 1rem;
        border-bottom: 1px solid #f0ede4;
        color: #333;
      }

      /* Service buttons grid */
      .service-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.85rem;
        margin-bottom: 1.5rem;
      }
      .service-btn {
        background: #c8c4a0;
        color: #333;
        border: none;
        border-radius: 50px;
        padding: 0.85rem 1.5rem;
        font-size: 0.92rem;
        font-weight: 600;
        cursor: pointer;
        text-align: center;
        transition:
          background 0.2s,
          transform 0.1s;
        font-family: inherit;
        line-height: 1.3;
      }
      .service-btn:hover {
        background: #b0ac88;
        transform: translateY(-1px);
      }
      .service-btn:active {
        transform: scale(0.98);
      }
      .service-btn-full {
        grid-column: 1 / -1;
        max-width: 50%;
        margin: 0 auto;
        width: 100%;
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
      @media (max-width: 600px) {
        .service-grid {
          grid-template-columns: 1fr;
        }
        .service-btn-full {
          max-width: 100%;
        }
      }
    `,
  ],
})
export class ApplyComponent {
  user = computed(() => this.authService.currentUser());

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
