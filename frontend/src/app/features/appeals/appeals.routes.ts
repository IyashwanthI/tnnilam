import { Routes } from "@angular/router";

export const appealRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./list/appeal-list.component").then((m) => m.AppealListComponent),
  },
  {
    path: "new",
    loadComponent: () =>
      import("./new/new-appeal.component").then((m) => m.NewAppealComponent),
  },
  {
    path: ":applId",
    loadComponent: () =>
      import("./detail/appeal-detail.component").then(
        (m) => m.AppealDetailComponent,
      ),
  },
];
