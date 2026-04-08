import { useEffect, useState } from "react";
import { internApi } from "../api/internApi";
import Pagination from "../components/Pagination";
import InternFormModal from "../components/InternFormModal";

const DashboardPage = () => {
  const [interns, setInterns] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchInterns = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await internApi.list({ page, limit, search });
      setInterns(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load interns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  const openCreateModal = () => {
    setEditingIntern(null);
    setModalOpen(true);
  };

  const openEditModal = (intern) => {
    setEditingIntern(intern);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingIntern(null);
  };

  const handleSubmitIntern = async (payload) => {
    setSubmitting(true);
    try {
      if (editingIntern?._id) {
        await internApi.update(editingIntern._id, payload);
      } else {
        await internApi.create(payload);
      }
      await fetchInterns();
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err?.response?.data?.message || "Failed to save intern"
      };
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (intern) => {
    const agreed = window.confirm(`Delete intern "${intern.fullName}"?`);
    if (!agreed) return;
    try {
      await internApi.remove(intern._id);
      await fetchInterns();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete intern");
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <div className="dashboard-content">
      <section className="dashboard-head">
        <div>
          <h1 className="title" style={{ fontSize: "1.75rem", fontWeight: 800 }}>Admin Dashboard</h1>
          <p className="muted">Managing {total} intern records across the platform</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New Intern
        </button>
      </section>

      {/* Statistical Overview */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-card-label">Total Interns</span>
          <span className="stat-card-value">{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Active Records</span>
          <span className="stat-card-value">{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">System Status</span>
          <span className="stat-card-value" style={{ color: '#22c55e', fontSize: '1.25rem' }}>● Operational</span>
        </div>
      </section>

      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
           <form className="search-row" onSubmit={handleSearchSubmit} style={{ marginBottom: 0, flex: 1, maxWidth: '400px' }}>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, or ID..."
              style={{ marginTop: 0 }}
            />
          </form>
          <div className="pagination-compact">
             <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>

        {error ? <div className="error-box" style={{ marginBottom: '1.5rem' }}>{error}</div> : null}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Recipient Name</th>
                <th>Registered Email</th>
                <th>Issued Certificates</th>
                <th style={{ textAlign: 'right' }}>Management</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: '3rem', textAlign: 'center' }}>
                    <div className="portal-spinner" style={{ margin: '0 auto 1rem' }}></div>
                    <p className="muted">Refreshing secure records...</p>
                  </td>
                </tr>
              ) : interns.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '3rem', textAlign: 'center' }}>
                    <p className="muted">No matching intern records found.</p>
                  </td>
                </tr>
              ) : (
                interns.map((intern) => (
                  <tr key={intern._id}>
                    <td>
                       <div style={{ fontWeight: 600, color: '#0f172a' }}>{intern.fullName}</div>
                    </td>
                    <td>{intern.email}</td>
                    <td>
                      <div className="chips">
                        {intern.certificates?.length ? (
                          intern.certificates.map((cert) => (
                            <span key={cert.certificateId} className="chip chip-static" title={cert.certificateId}>
                              {cert.type?.toUpperCase()}
                            </span>
                          ))
                        ) : (
                          <span className="muted" style={{ fontSize: '0.8rem' }}>None issued</span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-row" style={{ justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-outline" onClick={() => openEditModal(intern)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(intern)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <InternFormModal
        open={modalOpen}
        intern={editingIntern}
        onClose={closeModal}
        onSubmit={handleSubmitIntern}
        submitting={submitting}
      />
    </div>
  );
};

export default DashboardPage;
