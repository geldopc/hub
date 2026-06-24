import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "@templates/AppLayout";
import { Home } from "@pages/Home";
import { ProjectDetail } from "@pages/ProjectDetail";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout title="hub" />,
      children: [
        { index: true, element: <Home /> },
        { path: "project/:repo", element: <ProjectDetail /> },
      ],
    },
  ],
  { basename: "/hub" }
);

export function Router() {
  return <RouterProvider router={router} />;
}
