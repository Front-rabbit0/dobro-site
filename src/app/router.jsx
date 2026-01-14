import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/widgets/layout/AppLayout";
import { HomePage } from "@/pages/HomePage/HomePage";
import { OpportunitiesPage } from "@/pages/OpportunitiesPage/OpportunitiesPage";
import { OpportunityDetailsPage } from "@/pages/OpportunityDetailsPage/OpportunityDetailsPage";
import { NotFoundPage } from "@/pages/NotFoundPage/NotFoundPage";
import { CabinetPage } from "@/pages/CabinetPage/CabinetPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "opportunities", element: <OpportunitiesPage /> },
      { path: "opportunities/:id", element: <OpportunityDetailsPage /> },
      { path: "*", element: <NotFoundPage /> },
      { path: "cabinet", element: <CabinetPage /> },
    ],
  },
]);
