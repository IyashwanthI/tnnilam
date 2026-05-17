import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="hero">
      <div class="container hero-inner">
        <div class="hero-text">
          <div class="hero-badge">Tamil Nadu Land Records</div>
          <h1>F-Line Appeal Portal</h1>
          <p>
            Submit and track your Field Line (F-Line) appeals online. Get
            real-time status updates on your land mutation applications.
          </p>
          @if (isLoggedIn()) {
            <div class="hero-actions">
              <a routerLink="/appeals/new" class="btn btn-primary"
                >Submit New Appeal</a
              >
              <a routerLink="/appeals" class="btn btn-outline"
                >View My Appeals</a
              >
            </div>
          } @else {
            <div class="hero-actions">
              <a routerLink="/auth/register" class="btn btn-primary"
                >Register Now</a
              >
              <a routerLink="/auth/login" class="btn btn-outline">Login</a>
            </div>
          }
        </div>
        <div class="hero-image" aria-hidden="true">🗺️</div>
      </div>
    </div>

    <div class="container">
      <section class="features">
        <h2>How It Works</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>Register</h3>
            <p>
              Create your account with name, email and mobile number. Verify
              with OTP.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Submit Appeal</h3>
            <p>
              Fill in your land details — district, taluk, village, survey
              number — and describe your appeal.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Track Status</h3>
            <p>
              Monitor your appeal status from submission through review to final
              decision.
            </p>
          </div>
        </div>
      </section>

      <section class="info-section">
        <div class="info-card">
          <h3>What is an F-Line Appeal?</h3>
          <p>
            An F-Line (Field Line) appeal is a formal request to review or
            correct the boundary demarcation of your land parcel as recorded in
            the Tamil Nadu land records system. This portal allows citizens to
            submit such appeals digitally, reducing the need for in-person
            visits to the Taluk office.
          </p>
        </div>
        <div class="info-card">
          <h3>Documents Required</h3>
          <ul>
            <li>Patta / Chitta copy</li>
            <li>FMB (Field Measurement Book) sketch</li>
            <li>Encumbrance Certificate</li>
            <li>Previous mutation order (if applicable)</li>
          </ul>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .hero {
        background: linear-gradient(135deg, var(--primary) 0%, #0d4a2a 100%);
        color: #fff;
        padding: 4rem 0 3rem;
        margin-bottom: 3rem;
      }
      .hero-inner {
        display: flex;
        align-items: center;
        gap: 2rem;
      }
      .hero-text {
        flex: 1;
      }
      .hero-badge {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        padding: 0.3rem 0.9rem;
        border-radius: 20px;
        font-size: 0.8rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 1rem;
      }
      .hero-text h1 {
        font-size: 2.4rem;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 1rem;
      }
      .hero-text p {
        font-size: 1.05rem;
        opacity: 0.9;
        max-width: 520px;
        margin-bottom: 2rem;
      }
      .hero-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .hero-actions .btn-outline {
        border-color: rgba(255, 255, 255, 0.7);
        color: #fff;
      }
      .hero-actions .btn-outline:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      .hero-image {
        font-size: 8rem;
        opacity: 0.3;
      }

      .features {
        margin-bottom: 3rem;
      }
      .features h2 {
        font-size: 1.6rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        text-align: center;
      }
      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
      }
      .feature-card {
        background: var(--white);
        border-radius: var(--radius-lg);
        padding: 1.75rem;
        text-align: center;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--border);
        transition:
          box-shadow 0.2s,
          transform 0.2s;
      }
      .feature-card:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-3px);
      }
      .feature-icon {
        font-size: 2.5rem;
        margin-bottom: 0.75rem;
      }
      .feature-card h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
      }
      .feature-card p {
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      .info-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }
      .info-card {
        background: var(--white);
        border-radius: var(--radius-lg);
        padding: 1.75rem;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--border);
      }
      .info-card h3 {
        font-size: 1.05rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--primary);
      }
      .info-card p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.7;
      }
      .info-card ul {
        list-style: none;
        padding: 0;
      }
      .info-card ul li {
        padding: 0.35rem 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .info-card ul li::before {
        content: "✓";
        color: var(--primary);
        font-weight: 700;
      }

      @media (max-width: 600px) {
        .hero-text h1 {
          font-size: 1.7rem;
        }
        .hero-image {
          display: none;
        }
      }
    `,
  ],
})
export class HomeComponent {
  constructor(private authService: AuthService) {}
  isLoggedIn = computed(() => this.authService.isLoggedIn());
}
