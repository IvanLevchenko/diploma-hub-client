import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

import WithLsi from "./hocs/with-lsi/with-lsi";
import ErrorBoundary from "./hocs/error-boundary/error-boundary";

import reportWebVitals from "./reportWebVitals";
import routes from "./constants/routes";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter(routes);

root.render(
  <ErrorBoundary>
    <WithLsi>
      <RouterProvider router={router} />
    </WithLsi>
  </ErrorBoundary>
);

reportWebVitals();
