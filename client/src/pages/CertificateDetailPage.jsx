import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { certificateApi } from "../api/certificateApi";

const formatIssuedDate = (value) => {
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const PORTRAIT_TYPES = new Set(["bp", "ex"]);
const TYPE_LABELS = {
  ap: "Appreciation",
  bl: "Best Leader",
  bp: "Best Performer",
  ca: "Campus Ambassador",
  ex: "Excellence",
  ta_1: "Talent Acquisition",
  ta_2: "Talent Acquisition",
  ta_4: "Talent Acquisition",
};

const CertMockup = ({ cert, recipientName }) => {
  const isPortrait = PORTRAIT_TYPES.has(cert.type?.toLowerCase());
  const typeKey = cert.type?.toLowerCase();
  const displayType = TYPE_LABELS[typeKey] || cert.title;

  return (
    <div className={`cert-mockup ${isPortrait ? "cert-mockup--portrait" : "cert-mockup--landscape"} cert-mockup--${typeKey}`}>
      <div className="cert-mockup__paper">
        <div className="cert-mockup__corner cert-mockup__corner--tl">❋</div>
        <div className="cert-mockup__corner cert-mockup__corner--tr">❋</div>
        <div className="cert-mockup__corner cert-mockup__corner--bl">❋</div>
        <div className="cert-mockup__corner cert-mockup__corner--br">❋</div>

        <div className="cert-mockup__frame">
          <div className="cert-mockup__header">
            <img src="/black.png" alt="Zyntiq" className="cert-mockup__logo" />
            <div className="cert-mockup__header-divider" />
            <span className="cert-mockup__org">OFFICIAL CREDENTIAL</span>
          </div>

          <div className="cert-mockup__gold-line" />

          <div className="cert-mockup__body">
            <p className="cert-mockup__certifies">Certificate of</p>
            <p className="cert-mockup__type-title">{displayType}</p>
            <p className="cert-mockup__presented">This is to certify that</p>
            <h2 className="cert-mockup__name">{recipientName}</h2>
            <p className="cert-mockup__desc">
              has been recognized and awarded this certificate in acknowledgment of their outstanding contribution.
            </p>
          </div>

          <div className="cert-mockup__gold-line" />

          <div className="cert-mockup__footer">
            <div className="cert-mockup__footer-block">
              <span className="cert-mockup__footer-val">{formatIssuedDate(cert.issuedAt)}</span>
              <span className="cert-mockup__footer-lbl">Date of Issue</span>
            </div>

            <div className="cert-mockup__seal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>

            <div className="cert-mockup__footer-block cert-mockup__footer-block--right">
              <span className="cert-mockup__footer-val cert-mockup__footer-id">{cert.certificateId}</span>
              <span className="cert-mockup__footer-lbl">Certificate ID</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificateDetailPage = () => {
  const { certificateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [intern, setIntern] = useState(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await certificateApi.getById(certificateId);
        setCertificate(data.certificate || null);
        setIntern(data.intern || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Certificate not found.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [certificateId]);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  return (
    <div className="portal-page">
      <div className="portal-content" style={{ paddingTop: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/" className="portal-back-arrow" style={{ color: '#64748b', background: 'transparent' }} title="Back Home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
        </div>
        {loading ? (
          <div className="portal-feedback">
            <div className="portal-spinner"></div>
            <p>Retrieving secure record…</p>
          </div>
        ) : error ? (
          <div className="portal-feedback error">
            <p>{error}</p>
            <Link to="/" className="portal-back-btn" style={{ marginTop: "1rem" }}>Back to Search</Link>
          </div>
        ) : (
          <div className="portal-cert-grid" style={{ gridTemplateColumns: "1fr", maxWidth: "600px", margin: "0 auto" }}>
             <div className="portal-cert-card">
                <CertMockup cert={certificate} recipientName={intern?.fullName || "N/A"} />
                
                <div className="portal-card-actions">
                    <Link to={`/verify/${certificate.certificateId}`} className="portal-card-btn portal-card-btn--outline">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Verify Authenticity
                    </Link>
                    <a
                      href={`${apiBase}/certificate/generate/${certificate.certificateId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="portal-card-btn portal-card-btn--solid"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download PDF
                    </a>
                </div>
             </div>
          </div>
        )}
      </div>

      <footer className="portal-footer">
        <p>© {new Date().getFullYear()} Zyntiq · Official Secure Credential View</p>
      </footer>
    </div>
  );
};

export default CertificateDetailPage;
