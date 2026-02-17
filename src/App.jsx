import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { Toaster } from "sonner";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import PrivateLayout from "./components/layout/PrivateLayout";

const AuthForms = lazy(() => import("./pages/auth/AuthForms"));
const SuperAdmin = lazy(() => import("./pages/SuperAdmin/SuperAdmin"));
const OrgAdmin = lazy(() => import("./pages/OrgAdmin/OrgAdmin"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));

const App = () => {
  return (
    <Router basename={import.meta.env.VITE_BASE_NAME}>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>

          {/* Public Route */}
          <Route path="/" element={<AuthForms />} />

          {/* Private Routes with Header */}
          <Route element={<PrivateLayout />}>
            <Route path="/super-admin" element={<SuperAdmin />} />
            <Route path="/org-admin" element={<OrgAdmin />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </Suspense>

      <Toaster
        position="top-right"
        richColors
        expand
        duration={4000}
        closeButton
        visibleToasts={5}
      />
    </Router>
  );
};

export default App;
