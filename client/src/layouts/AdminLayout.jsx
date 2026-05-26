import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Zyntiq</p>
          <h1 className="title">Admin Panel</h1>
        </div>
          <a className="btn btn-outline link-btn" href="/">
            Public Site
          </a>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
