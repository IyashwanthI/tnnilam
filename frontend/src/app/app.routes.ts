import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },

  // Auth (public)
  {
    path: "auth",
    loadChildren: () =>
      import("./features/auth/auth.routes").then((m) => m.authRoutes),
  },

  // Dashboard
  {
    path: "dashboard",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/dashboard/dashboard.component").then(
        (m) => m.DashboardComponent,
      ),
  },

  // Profile
  {
    path: "profile",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/profile/profile.component").then(
        (m) => m.ProfileComponent,
      ),
  },

  // Apply hub
  {
    path: "apply",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/apply/apply.component").then((m) => m.ApplyComponent),
  },

  // Apply sub-forms
  {
    path: "apply/not-involving-subdivision",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/apply/forms/nisd-form.component").then(
        (m) => m.NisdFormComponent,
      ),
  },
  {
    path: "apply/involving-subdivision",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/apply/forms/isd-form.component").then(
        (m) => m.IsdFormComponent,
      ),
  },
  {
    path: "apply/fline",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/apply/forms/fline-form.component").then(
        (m) => m.FlineFormComponent,
      ),
  },
  {
    path: "apply/fline-appeal",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/appeals/new/new-appeal.component").then(
        (m) => m.NewAppealComponent,
      ),
  },
  {
    path: "apply/history-patta",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/apply/forms/history-patta-form.component").then(
        (m) => m.HistoryPattaFormComponent,
      ),
  },

  // Status
  {
    path: "status",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/status/status.component").then(
        (m) => m.StatusComponent,
      ),
  },

  // Reprint ACK
  {
    path: "reprint-ack",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/reprint-ack/reprint-ack.component").then(
        (m) => m.ReprintAckComponent,
      ),
  },

  // Legacy appeals routes (keep existing)
  {
    path: "appeals",
    canActivate: [authGuard],
    loadChildren: () =>
      import("./features/appeals/appeals.routes").then((m) => m.appealRoutes),
  },

  // Home (legacy)
  {
    path: "home",
    loadComponent: () =>
      import("./features/home/home.component").then((m) => m.HomeComponent),
  },

  { path: "**", redirectTo: "dashboard" },
];
