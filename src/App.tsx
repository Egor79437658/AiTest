import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SidebarProvider } from "./contexts/SidebarProviderT";

import "./index.css";
import { PAGE_ENDPOINTS } from "./constants/pageEndPoints";
import { Home } from "./pages/Home";
import { Project } from "./pages/Project";
import { Index } from "./pages/Index";

const router = createBrowserRouter([
  {
    path: PAGE_ENDPOINTS.HOME,
    element: <Home />,
  },
  {
    path: PAGE_ENDPOINTS.PROJECT,
    element: <Project />,
  },
  {
    path: PAGE_ENDPOINTS.INDEX,
    element: <Index />,
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
