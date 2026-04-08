import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminLayout = () => {
  const { admin, logout } = useAuth();

  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Zyntiq</p>
          <h1 className="title">Admin Panel</h1>
        </div>
        <div className="topbar-actions">
          <span className="admin-chip">{admin?.email}</span>
          <a className="btn btn-outline link-btn" href="/">
            Public Site
          </a>
          <button type="button" className="btn btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
