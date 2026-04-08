import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const { isAuthenticated, login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    const result = await login(form);
    if (!result.ok) {
      setError(result.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-brand">
          <img src="/black.png" alt="Zyntiq" className="brand-img-large" />
        </div>
        <div className="login-card-modern">
          <div className="login-header">
            <h2>Authorized Access Only</h2>
          </div>
          <form className="form-grid login-form" onSubmit={handleSubmit}>
            <label className="form-control">
              <span>Admin Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="administrator@zyntiq.com"
                maxLength={120}
                required
              />
            </label>
            <label className="form-control">
              <span>Security Key</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                minLength={8}
                maxLength={120}
                required
              />
            </label>
            {error ? <div className="error-box">{error}</div> : null}
            <button className="btn btn-primary login-btn" type="submit" disabled={loading}>
              {loading ? "Authenticating..." : "Secure Login"}
            </button>
          </form>
        </div>
        <div className="login-footer">
          <p>Protected by active encryption & audit logging.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
