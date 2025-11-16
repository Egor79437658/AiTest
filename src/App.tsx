import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SidebarProvider } from "./contexts";

import { Layout } from "./components";
import { PAGE_ENDPOINTS } from "./constants";
import { HomeContainer, IndexContainer, ProjectContainer } from "./pages";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: PAGE_ENDPOINTS.HOME,
        element: <HomeContainer />,
      },
      {
        path: PAGE_ENDPOINTS.PROJECT,
        element: <ProjectContainer />,
      },
      {
        path: PAGE_ENDPOINTS.INDEX,
        element: <IndexContainer />,
      },

      // {
      //   path: "*",
      //   element: <DefaultPage />,
      // },
    ],
  },
]);

function App() {
  return (
    <HelmetProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </HelmetProvider>
  );
}

export default App;
