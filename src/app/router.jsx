import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/widgets/layout/AppLayout";
import { HomePage } from "@/pages/HomePage/HomePage";
import { OpportunitiesPage } from "@/pages/OpportunitiesPage/OpportunitiesPage";
import { OpportunityDetailsPage } from "@/pages/OpportunityDetailsPage/OpportunityDetailsPage";
import { NotFoundPage } from "@/pages/NotFoundPage/NotFoundPage";
import { CabinetPage } from "@/pages/CabinetPage/CabinetPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "opportunities", element: <OpportunitiesPage /> },
        { path: "opportunities/:id", element: <OpportunityDetailsPage /> },
        { path: "cabinet", element: <CabinetPage /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  {
    // ✅ В dev будет "/", в GitHub Pages будет "/dobro-site/"
    basename: import.meta.env.BASE_URL,
  }
);
