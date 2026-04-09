import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
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

// Portrait types (BP & EX use portrait orientation in templates)
const PORTRAIT_TYPES = new Set(["bp", "ex"]);

// Map cert type to a short display label
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
        {/* Corner ornaments */}
        <div className="cert-mockup__corner cert-mockup__corner--tl">❋</div>
        <div className="cert-mockup__corner cert-mockup__corner--tr">❋</div>
        <div className="cert-mockup__corner cert-mockup__corner--bl">❋</div>
        <div className="cert-mockup__corner cert-mockup__corner--br">❋</div>

        {/* Inner frame */}
        <div className="cert-mockup__frame">
          {/* Header */}
          <div className="cert-mockup__header">
            <img src="/black.png" alt="Zyntiq" className="cert-mockup__logo" />
            <div className="cert-mockup__header-divider" />
            <span className="cert-mockup__org">OFFICIAL CREDENTIAL</span>
          </div>

          <div className="cert-mockup__gold-line" />

          {/* Body */}
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

          {/* Footer */}
          <div className="cert-mockup__footer">
            <div className="cert-mockup__footer-block">
              <span className="cert-mockup__footer-val">{formatIssuedDate(cert.issuedAt)}</span>
              <span className="cert-mockup__footer-lbl">Date of Issue</span>
            </div>

            {/* QR Placeholder */}
            <div className="cert-mockup__seal">
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <rect x="0" y="0" width="15" height="15" rx="2" fill="none" stroke="#c8b870" strokeWidth="1.5"/>
                <rect x="4" y="4" width="7" height="7" fill="#c8b870" opacity="0.6"/>
                <rect x="21" y="0" width="15" height="15" rx="2" fill="none" stroke="#c8b870" strokeWidth="1.5"/>
                <rect x="25" y="4" width="7" height="7" fill="#c8b870" opacity="0.6"/>
                <rect x="0" y="21" width="15" height="15" rx="2" fill="none" stroke="#c8b870" strokeWidth="1.5"/>
                <rect x="4" y="25" width="7" height="7" fill="#c8b870" opacity="0.6"/>
                <rect x="21" y="21" width="4" height="4" fill="#c8b870" opacity="0.5"/>
                <rect x="27" y="21" width="4" height="4" fill="#c8b870" opacity="0.5"/>
                <rect x="33" y="21" width="3" height="4" fill="#c8b870" opacity="0.5"/>
                <rect x="21" y="27" width="4" height="4" fill="#c8b870" opacity="0.5"/>
                <rect x="33" y="27" width="3" height="4" fill="#c8b870" opacity="0.5"/>
                <rect x="21" y="33" width="4" height="3" fill="#c8b870" opacity="0.5"/>
                <rect x="27" y="33" width="9" height="3" fill="#c8b870" opacity="0.5"/>
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

// Empty state when no certs found
const EmptyState = () => (
  <div className="cert-empty-state">
    <div className="cert-empty-state__icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    </div>
    <h3 className="cert-empty-state__title">No Certificates Yet</h3>
    <p className="cert-empty-state__desc">No credentials have been issued to this account yet. Check back later!</p>
    <Link to="/" className="portal-card-btn solid cert-empty-state__link">← Search Again</Link>
  </div>
);

const CertificatesPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const fullName = (searchParams.get("name") || "").trim();
  const email = (searchParams.get("email") || "").trim();
  const prefetched = location.state?.prefetched;
  const canUsePrefetched =
    prefetched &&
    prefetched.name === fullName &&
    prefetched.email === email;

  const [loading, setLoading] = useState(!canUsePrefetched);
  const [error, setError] = useState("");
  const [intern, setIntern] = useState(canUsePrefetched ? prefetched.intern : null);
  const [certificates, setCertificates] = useState(canUsePrefetched ? prefetched.certificates : []);

  useEffect(() => {
    const run = async () => {
      if (!fullName || !email) {
        setError("Missing name or email. Please search again.");
        setLoading(false);
        return;
      }
      if (canUsePrefetched) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      setIntern(null);
      setCertificates([]);
      try {
        const { data } = await certificateApi.findByNameEmail({ fullName, email });
        setIntern(data.intern || null);
        setCertificates(data.certificates || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to fetch certificates.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [fullName, email, canUsePrefetched]);

  const recipientName = intern?.fullName || fullName;
  const sorted = [...certificates].sort(
    (a, b) => new Date(b.issuedAt) - new Date(a.issuedAt)
  );

  return (
    <div className="portal-page">

      {/* Unified Identity & Navigation Section */}
      {!loading && !error && (
        <div className="portal-profile-section">
          <div className="portal-nav-row-integrated" style={{ justifyContent: "space-between" }}>
            <Link to="/" className="brand-logo" style={{ textDecoration: "none" }}>
              <img src="/black.png" alt="Zyntiq" className="brand-img" style={{ height: "30px" }} />
              <div className="brand-divider" style={{ height: "16px" }}></div>
              <span className="brand-portal-label" style={{ fontSize: "0.8rem", color: "#64748b" }}>Verification Portal</span>
            </Link>
            <Link to="/" className="portal-back-btn" title="New Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              New Search
            </Link>
          </div>

          <div className="portal-identity-banner-integrated">
            <div className="identity-left">
              <div className="identity-avatar">
                {(intern?.fullName || fullName).charAt(0).toUpperCase()}
              </div>
              <div className="identity-info">
                <h1 className="identity-name">{intern?.fullName || fullName}</h1>
                <p className="identity-email">{intern?.email || email}</p>
              </div>
            </div>
            <div className="identity-right">
              <div className="identity-stat-card">
                <span className="identity-stat-value">{certificates.length}</span>
                <span className="identity-stat-label">Credentials Issued</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="portal-content">
        {loading ? (
          <div className="portal-feedback">
            <div className="portal-spinner"></div>
            <p>Retrieving secure records…</p>
          </div>
        ) : error ? (
          <div className="portal-feedback error">
            <p>{error}</p>
            <Link to="/" className="portal-back-btn" style={{ marginTop: "1rem" }}>Back to Search</Link>
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="portal-section-label">
              <span>Credential Archive</span>
              <span className="portal-count-badge">{sorted.length} {sorted.length === 1 ? "certificate" : "certificates"}</span>
            </div>

            <div className="portal-cert-grid">
              {sorted.map((cert) => (
                <div key={cert.certificateId} className="portal-cert-card">

                  {/* Certificate Mockup */}
                  <CertMockup cert={cert} recipientName={recipientName} />

                  {/* Action Row */}
                  <div className="portal-card-actions">
                    <Link to={`/verify/${cert.certificateId}`} className="portal-card-btn portal-card-btn--outline">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Verify
                    </Link>
                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/certificate/generate/${cert.certificateId}`}
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
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="portal-footer">
        <p>© {new Date().getFullYear()} Zyntiq · All credentials are cryptographically verified and tamper-proof</p>
      </footer>
    </div>
  );
};

export default CertificatesPage;
