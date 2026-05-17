import { Component, computed } from "@angular/core";
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "./core/services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    @if (isLoggedIn()) {
      <nav class="tn-navbar no-print">
        <div class="tn-navbar-inner">
          <div class="tn-brand">
            <span class="tn-brand-icon">🌿</span>
            <span class="tn-brand-text">Tamil Nilam</span>
          </div>
          <div class="tn-nav-tabs">
            <a
              routerLink="/dashboard"
              routerLinkActive="tn-tab-active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="tn-tab"
              >HOME</a
            >
            <a
              routerLink="/profile"
              routerLinkActive="tn-tab-active"
              class="tn-tab"
              >MY PROFILE</a
            >
            <a
              routerLink="/apply"
              routerLinkActive="tn-tab-active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="tn-tab"
              >APPLY</a
            >
            <a
              routerLink="/status"
              routerLinkActive="tn-tab-active"
              class="tn-tab"
              >STATUS</a
            >
            <a
              routerLink="/reprint-ack"
              routerLinkActive="tn-tab-active"
              class="tn-tab"
              >REPRINT ACK</a
            >
            <button class="tn-tab tn-tab-btn" (click)="logout()">LOGOUT</button>
          </div>
        </div>
      </nav>
    }

    <main class="tn-main">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .tn-navbar {
        background: #3d7a6e;
        color: #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .tn-navbar-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        align-items: stretch;
        gap: 1rem;
      }
      .tn-brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.6rem 1rem 0.6rem 0;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
        margin-right: 0.5rem;
        white-space: nowrap;
      }
      .tn-brand-icon {
        font-size: 1.3rem;
      }
      .tn-brand-text {
        font-size: 1rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: 0.03em;
      }
      .tn-nav-tabs {
        display: flex;
        align-items: stretch;
        flex: 1;
      }
      .tn-tab {
        display: flex;
        align-items: center;
        padding: 0 1.1rem;
        color: rgba(255, 255, 255, 0.88);
        text-decoration: none;
        font-size: 0.82rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        border: none;
        background: transparent;
        cursor: pointer;
        font-family: inherit;
        transition:
          background 0.15s,
          color 0.15s;
        white-space: nowrap;
        border-bottom: 3px solid transparent;
      }
      .tn-tab:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
      .tn-tab-active {
        background: rgba(0, 0, 0, 0.15);
        color: #fff;
        border-bottom-color: #fff;
      }
      .tn-tab-btn {
        margin-left: auto;
        color: rgba(255, 255, 255, 0.88);
      }
      .tn-tab-btn:hover {
        background: rgba(255, 0, 0, 0.15);
        color: #fff;
      }
      .tn-main {
        min-height: calc(100vh - 52px);
        background: #f5f5f0;
      }
      @media (max-width: 700px) {
        .tn-brand-text {
          display: none;
        }
        .tn-tab {
          padding: 0 0.6rem;
          font-size: 0.72rem;
        }
      }
    `,
  ],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  isLoggedIn = computed(() => !!this.authService.currentUser());

  logout(): void {
    this.authService.logout();
  }
}
