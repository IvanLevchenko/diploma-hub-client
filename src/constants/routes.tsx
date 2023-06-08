import PrivateRoute from "../hocs/private-route/private-route";
import RepositoryListPage from "../pages/repository-list-page/repository-list-page";
import AuthPage from "../pages/auth-page/auth-page";
import RepositoryPage from "../pages/repository-page/repository-page";
import GroupListPage from "../pages/group-list-page/group-list-page";
import GroupPage from "../pages/group-page/group-page";
import StudentListPage from "../pages/student-list-page/student-list-page";

const routes = [
  {
    path: "*",
    element: (
      <PrivateRoute>
        <RepositoryListPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <RepositoryListPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/groups",
    element: (
      <PrivateRoute>
        <GroupListPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/group",
    element: (
      <PrivateRoute>
        <GroupPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/students",
    element: (
      <PrivateRoute>
        <StudentListPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/repository",
    element: (
      <PrivateRoute>
        <RepositoryPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/logout",
    element: <AuthPage logout />,
  },
];

export default routes;
