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
    <div className="verify-wrapper">
      <div className="verify-bg-blur"></div>
      
      <div className="verify-container">
        <header className="verify-header">
           <Link to="/" className="v-brand-logo">
             <img src="/black.png" alt="Zyntiq" className="brand-img" />
           </Link>
           <Link to="/" className="v-back-home">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              <span>Back Home</span>
           </Link>
        </header>

        <main className="verify-main">
          {loading ? (
            <div className="verify-status-card loading">
              <div className="v-spinner"></div>
              <h2>Verifying Credential</h2>
              <p>Establishing secure connection to database...</p>
            </div>
          ) : error ? (
            <div className="verify-status-card error">
              <div className="v-icon-error">!</div>
              <h2>System Error</h2>
              <p>{error}</p>
              <Link to="/" className="v-action-btn">New Verification</Link>
            </div>
          ) : result?.status === "valid" ? (
            <div className="verify-result-layout">
              <div className="v-success-banner">
                <div className="v-success-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div className="v-success-text">
                  <h3>Cryptographically Verified</h3>
                  <p>This certificate is authentic and recorded in our official database.</p>
                </div>
              </div>

              <div className="v-details-grid">
                <div className="v-detail-card main-info">
                   <div className="v-label">Issued To</div>
                   <div className="v-value recipient-name">{result.fullName}</div>
                </div>
                
                <div className="v-detail-card">
                   <div className="v-label">Certificate ID</div>
                   <div className="v-value id-box">{result.certificateId}</div>
                </div>

                <div className="v-detail-card">
                   <div className="v-label">Credential Type</div>
                   <div className="v-value">{result.title}</div>
                </div>

                <div className="v-detail-card">
                   <div className="v-label">Issue Date</div>
                   <div className="v-value">{formatDateTime(result.issuedAt)}</div>
                </div>
              </div>

              <div className="v-footer-info">
                <p>Digital signatures verified against public ledger. Integrity maintained.</p>
              </div>
            </div>
          ) : (
            <div className="verify-status-card invalid">
              <div className="v-icon-invalid">×</div>
              <h2>Verification Failed</h2>
              <p>The certificate ID <strong>{certificateId}</strong> was not found or is no longer valid.</p>
              <Link to="/" className="v-action-btn">Try Another ID</Link>
            </div>
          )}
        </main>

        <footer className="verify-footer-simple">
          <p>© 2026 Zyntiq · Official Verification Portal</p>
        </footer>
      </div>
    </div>
  );
};

export default VerifyPage;
