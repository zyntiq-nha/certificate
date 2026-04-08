import { useEffect, useState } from "react";

const makeInitial = () => ({ fullName: "", email: "" });

const CertificateLookupModal = ({ open, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState(makeInitial);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(makeInitial());
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.fullName.trim() || !form.email.trim()) {
      setError("Name and email are required to process the request.");
      return;
    }
    if (form.fullName.trim().length > 100) {
      setError("Name length exceeds allowed parameters.");
      return;
    }
    const result = await onSubmit({
      fullName: form.fullName.trim(),
      email: form.email.trim()
    });
    if (!result.ok) {
      setError(result.message || "Unable to locate records for provided credentials.");
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card lookup-modal">
        <div className="modal-head">
          <h2 className="modal-title">Verification Request</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <p className="modal-description">Please provide your registered credential details to access the system.</p>
        <form className="form-grid modal-form" onSubmit={submit}>
          <label className="form-control">
            <span>Primary Name</span>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              maxLength={100}
              autoFocus
            />
          </label>
          <label className="form-control">
            <span>Registered Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@domain.com"
              maxLength={120}
            />
          </label>
          {error ? <div className="error-box">{error}</div> : null}
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Processing..." : "Retrieve Records"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateLookupModal;
