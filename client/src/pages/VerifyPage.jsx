import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { certificateApi } from "../api/certificateApi";

const formatDateTime = (value) => {
  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
};

const VerifyPage = () => {
  const { certificateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await certificateApi.verifyById(certificateId);
        setResult(data);
      } catch (err) {
        const payload = err?.response?.data;
        if (payload?.status === "invalid") {
          setResult(payload);
          return;
        }
        setError(payload?.message || "Certificate verification failed.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [certificateId]);

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
          <Link to="/" className="admin-access-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span>Back Home</span>
          </Link>
        </header>

        <main className="landing-main" style={{ display: 'block', padding: '3rem 0' }}>
          <div className="verify-content-box">
            {loading ? (
              <div className="v-status-loading">
                <div className="v-spinner-gold"></div>
                <h2 className="v-status-title">Verifying Credential</h2>
                <p className="v-status-desc">Establishing secure connection to database...</p>
              </div>
            ) : error ? (
              <div className="v-status-container v-error">
                <div className="v-status-icon-box">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <h2 className="v-status-title">System Error</h2>
                <p className="v-status-desc">{error}</p>
                <Link to="/" className="btn-hero-primary" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>
                  <span>Return to Home</span>
                </Link>
              </div>
            ) : result?.status === "valid" ? (
              <div className="v-success-card">
                <div className="v-success-top">
                  <div className="v-badge-secure">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <span>SECURE RECORD</span>
                  </div>
                  <h1 className="v-heading">Credential <span className="text-gradient">Verified</span></h1>
                  <p className="v-subheading">This certificate is authentic and recorded in our official database.</p>
                </div>

                <div className="v-info-grid">
                  <div className="v-info-item full-width">
                    <label className="v-info-label">Issued To</label>
                    <div className="v-info-value recipient-display">{result.fullName}</div>
                  </div>
                  
                  <div className="v-info-item">
                    <label className="v-info-label">Certificate ID</label>
                    <div className="v-info-value id-display">{result.certificateId}</div>
                  </div>

                  <div className="v-info-item">
                    <label className="v-info-label">Credential Type</label>
                    <div className="v-info-value">{result.title}</div>
                  </div>

                  <div className="v-info-item">
                    <label className="v-info-label">Issue Date</label>
                    <div className="v-info-value">{formatDateTime(result.issuedAt)}</div>
                  </div>

                  <div className="v-info-item">
                    <label className="v-info-label">Issuer</label>
                    <div className="v-info-value">Zyntiq Official</div>
                  </div>
                </div>

                <div className="v-seal-section">
                  <div className="v-seal-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <p>Digital signatures verified against public ledger. Integrity maintained.</p>
                </div>
              </div>
            ) : (
              <div className="v-status-container v-invalid">
                <div className="v-status-icon-box">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </div>
                <h2 className="v-status-title">Verification Failed</h2>
                <p className="v-status-desc">The certificate ID <strong>{certificateId}</strong> was not found or is no longer valid.</p>
                <Link to="/" className="btn-hero-primary" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>
                  <span>Try Again</span>
                </Link>
              </div>
            )}
          </div>
        </main>

        <footer className="landing-footer" style={{ padding: '2rem 0' }}>
           <p>© 2026 Zyntiq · Official Verification Portal · Cryptographically Signed</p>
        </footer>
      </div>
    </div>
  );
};

export default VerifyPage;
