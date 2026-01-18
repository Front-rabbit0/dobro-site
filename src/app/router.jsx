import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/widgets/layout/AppLayout";
import { HomePage } from "@/pages/HomePage/HomePage";
import { OpportunitiesPage } from "@/pages/OpportunitiesPage/OpportunitiesPage";
import { OpportunityDetailsPage } from "@/pages/OpportunityDetailsPage/OpportunityDetailsPage";
import { NotFoundPage } from "@/pages/NotFoundPage/NotFoundPage";
import { CabinetPage } from "@/pages/CabinetPage/CabinetPage";

import { LoginPage } from "@/pages/LoginPage/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage/RegisterPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage/ForgotPasswordPage";

import { AdminContentPage } from "@/pages/AdminContentPage/AdminContentPage";
import { RequireRole } from "@/app/router/RequireRole";
import { AdminStatsPage } from "@/pages/AdminStatsPage/AdminStatsPage";
import { AdminProjectsPage } from "@/pages/AdminProjectsPage/AdminProjectsPage";


import { RequireAuth } from "@/app/router/RequireAuth";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <HomePage /> },

        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "forgot", element: <ForgotPasswordPage /> },

        { path: "opportunities", element: <OpportunitiesPage /> },
        { path: "opportunities/:id", element: <OpportunityDetailsPage /> },

        {
          path: "cabinet",
          element: (
            <RequireAuth>
              <CabinetPage />
            </RequireAuth>
          ),
        },

        {
          path: "admin/content",
          element: (
            <RequireRole allow={["curator"]}>
              <AdminContentPage />
            </RequireRole>
          ),
        },
        {
          path: "admin/stats",
          element: (
            <RequireRole allow={["curator"]}>
              <AdminStatsPage />
            </RequireRole>
          ),
        },
        {
          path: "admin/projects",
          element: (
            <RequireRole allow={["curator"]}>
              <AdminProjectsPage />
            </RequireRole>
          ),
        },

        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
