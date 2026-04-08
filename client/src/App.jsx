import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const CertificatesPage = lazy(() => import("./pages/CertificatesPage"));
const CertificateDetailPage = lazy(() => import("./pages/CertificateDetailPage"));
const VerifyPage = lazy(() => import("./pages/VerifyPage"));

const App = () => {
  return (
    <Suspense fallback={<div className="page-loader">Loading...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/certificate/:certificateId" element={<CertificateDetailPage />} />
        <Route path="/verify/:certificateId" element={<VerifyPage />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
