import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const CertificatesPage = lazy(() => import("./pages/CertificatesPage"));
const CertificateDetailPage = lazy(() => import("./pages/CertificateDetailPage"));
const VerifyPage = lazy(() => import("./pages/VerifyPage"));
const ADMIN_PATH = (import.meta.env.VITE_ADMIN_PATH || "/team-admin").replace(/\/+$/, "");

const App = () => {
  return (
    <Suspense fallback={<div className="page-loader">Loading...</div>}>
      <Routes>
        <Route path={`${ADMIN_PATH}`} element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/certificate/:certificateId" element={<CertificateDetailPage />} />
        <Route path="/verify/:certificateId" element={<VerifyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
