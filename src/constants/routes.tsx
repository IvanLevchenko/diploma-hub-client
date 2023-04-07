import App from "../pages/app/app";
import Auth from "../pages/auth/auth";
import Admin from "../pages/admin/admin";

const routes = [
  {
    path: "*",
    element: <App />,
  },
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
];

export default routes;
