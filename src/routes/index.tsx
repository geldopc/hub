import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "@templates/AppLayout";
import { Home } from "@pages/Home";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout title="hub" />,
      children: [{ index: true, element: <Home /> }],
    },
  ],
  { basename: "/hub" }
);

export function Router() {
  return <RouterProvider router={router} />;
}
