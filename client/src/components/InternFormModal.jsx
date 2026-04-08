import { useEffect, useMemo, useState } from "react";
import { CERT_TYPES } from "../constants";

const makeInitialState = (intern) => ({
  fullName: intern?.fullName || "",
  email: intern?.email || "",
  certificates: intern?.certificates?.map((item) => item.type) || []
});

const InternFormModal = ({ open, intern, onClose, onSubmit, submitting }) => {
  const [form, setForm] = useState(() => makeInitialState(intern));
  const [error, setError] = useState("");

  const title = useMemo(() => (intern ? "Edit Intern" : "Add Intern"), [intern]);

  useEffect(() => {
    if (open) {
      setForm(makeInitialState(intern));
      setError("");
    }
  }, [open, intern]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCertificateToggle = (key) => {
    setForm((prev) => {
      const exists = prev.certificates.includes(key);
      const certificates = exists ? prev.certificates.filter((t) => t !== key) : [...prev.certificates, key];
      return { ...prev, certificates };
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.fullName.trim() || !form.email.trim()) {
      setError("Full name and email are required.");
      return;
    }
    if (form.fullName.trim().length > 100) {
      setError("Full name is too long.");
      return;
    }
    const result = await onSubmit({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      certificates: form.certificates
    });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card">
        <div className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            x
          </button>
        </div>
        <form onSubmit={submit} className="form-grid">
          <label>
            Full Name
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Rahul Sharma"
              maxLength={100}
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="rahul@email.com"
              maxLength={120}
            />
          </label>
          <div>
            <p className="field-label">Certificate Types</p>
            <div className="chips">
              {Object.entries(CERT_TYPES).map(([key, label]) => {
                const active = form.certificates.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    className={`chip ${active ? "chip-active" : ""}`}
                    onClick={() => handleCertificateToggle(key)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          {error ? <p className="error-text">{error}</p> : null}
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InternFormModal;
