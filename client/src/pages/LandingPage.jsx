import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CertificateLookupModal from "../components/CertificateLookupModal";
import { certificateApi } from "../api/certificateApi";

const LandingPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitLookup = async ({ fullName, email }) => {
    setLoading(true);
    try {
      const { data } = await certificateApi.findByNameEmail({ fullName, email });
      navigate(`/certificates?name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}`, {
        state: {
          prefetched: {
            name: fullName,
            email,
            intern: data.intern || null,
            certificates: data.certificates || []
          }
        }
      });
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error?.response?.data?.message || "No certificates found for this name and email."
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-wrapper">
      <div className="landing-bg-accent"></div>

      <div className="landing-container">
        <header className="landing-header">
          <div className="brand-logo">
            <img src="/black.png" alt="Zyntiq" className="brand-img" />
            <div className="brand-divider"></div>
            <span className="brand-portal-label">Verification Portal</span>
          </div>
          <nav className="landing-nav">
            <Link className="admin-access-btn" to="/admin/login" title="Admin Portal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Admin Login</span>
            </Link>
          </nav>
        </header>

        <main className="landing-main">
          <div className="hero-content">
            <h1 className="hero-title">
              Secure Your <span className="text-gradient">Professional</span> Future
            </h1>
            <p className="hero-subtitle">
              Verify authenticated credentials or retrieve your official Zyntiq internship certificates. A cryptographically secure archive for modern professionals.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn-hero-primary" onClick={() => setOpen(true)}>
                <span>Retrieve Your Certificate</span>
                <div className="btn-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </button>
            </div>

            <div className="trust-indicators">
              <div className="trust-item">
                <div className="trust-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div className="trust-text">
                  <strong>Authenticated</strong>
                  <span>Verified Records</span>
                </div>
              </div>
              <div className="trust-item">
                <div className="trust-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </div>
                <div className="trust-text">
                  <strong>Instant Access</strong>
                  <span>Standardized PDF</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-float-stack">
              <div className="float-card card-1 animate-float"></div>
              <div className="float-card card-2 animate-float-delayed"></div>
              <div className="main-cert-preview animate-shine">
                <div className="preview-header">
                  <div className="preview-logo"></div>
                  <div className="preview-pill"></div>
                </div>
                <div className="preview-body">
                  <div className="preview-line-lg"></div>
                  <div className="preview-line-md"></div>
                  <div className="preview-line-sm"></div>
                </div>
                <div className="preview-footer">
                  <div className="preview-seal"></div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="landing-footer">
          <div className="footer-line"></div>
          <p>© 2026 Zyntiq · Secure Verification Portal · All credentials cryptographically signed</p>
        </footer>
      </div>
      <CertificateLookupModal open={open} onClose={() => setOpen(false)} onSubmit={submitLookup} loading={loading} />
    </div>
  );
};

export default LandingPage;
