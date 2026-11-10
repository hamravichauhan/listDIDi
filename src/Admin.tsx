import { useState, useEffect, type FormEvent } from "react";
import {
  type SiteContent,
  type Inquiry,
  type PricingPlan,
  type FaqItem,
  type TeamMember,
  adminLogin,
  checkAdminAuth,
  adminLogout,
  adminChangePassword,
  fetchAdminInquiries,
  updateInquiryStatus,
  deleteInquiry,
  updateSiteContent,
  uploadImageFile,
} from "./api";

interface AdminProps {
  content: SiteContent;
  onContentUpdate: (newContent: SiteContent) => void;
  onClose: () => void;
}

type AdminTab = "inquiries" | "pricing" | "content" | "faqs" | "settings";

export function AdminPortal({ content, onContentUpdate, onClose }: AdminProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("inquiries");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const showNotify = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    checkAdminAuth().then((auth) => {
      setIsAuthenticated(auth);
      if (auth) {
        loadInquiries();
      }
    });
  }, []);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminInquiries();
      setInquiries(data);
    } catch {
      showNotify("error", "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    loadInquiries();
    showNotify("success", "Welcome back, Rekha!");
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="admin-overlay">
        <div className="admin-loading-box">Checking admin credentials...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm onLogin={handleLoginSuccess} onClose={onClose} />;
  }

  const unreadCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="admin-portal-wrapper">
      {/* Toast Notification */}
      {notification && (
        <div className={`admin-toast admin-toast-${notification.type}`}>
          {notification.type === "success" ? "✓ " : "✕ "}
          {notification.text}
        </div>
      )}

      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <span className="admin-badge">Admin Control Center</span>
            <h2>Listening Korner</h2>
          </div>

          <div className="admin-header-actions">
            <button className="admin-btn admin-btn-ghost" onClick={onClose}>
              ← Return to Website
            </button>
            <button className="admin-btn admin-btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <nav className="admin-tabs" aria-label="Admin Navigation">
          <button
            className={`admin-tab ${activeTab === "inquiries" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("inquiries");
              loadInquiries();
            }}
          >
            <span>📥 Enquiries & Bookings</span>
            {unreadCount > 0 && <span className="tab-pill">{unreadCount}</span>}
          </button>
          <button
            className={`admin-tab ${activeTab === "pricing" ? "active" : ""}`}
            onClick={() => setActiveTab("pricing")}
          >
            <span>💰 Sessions & Pricing</span>
          </button>
          <button
            className={`admin-tab ${activeTab === "content" ? "active" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            <span>✍️ Website & Profile</span>
          </button>
          <button
            className={`admin-tab ${activeTab === "faqs" ? "active" : ""}`}
            onClick={() => setActiveTab("faqs")}
          >
            <span>❓ FAQs</span>
          </button>
          <button
            className={`admin-tab ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <span>⚙️ Security & Password</span>
          </button>
        </nav>
      </header>

      {/* Tab Content */}
      <main className="admin-main">
        {activeTab === "inquiries" && (
          <InquiriesView
            inquiries={inquiries}
            loading={loading}
            onRefresh={loadInquiries}
            onNotify={showNotify}
          />
        )}


        {activeTab === "pricing" && (
          <PricingView
            content={content}
            onUpdate={onContentUpdate}
            onNotify={showNotify}
          />
        )}

        {activeTab === "content" && (
          <ContentView
            content={content}
            onUpdate={onContentUpdate}
            onNotify={showNotify}
          />
        )}

        {activeTab === "faqs" && (
          <FaqsView
            content={content}
            onUpdate={onContentUpdate}
            onNotify={showNotify}
          />
        )}

        {activeTab === "settings" && <SettingsView onNotify={showNotify} />}
      </main>
    </div>
  );
}

// ----------------- LOGIN FORM -----------------
function AdminLoginForm({
  onLogin,
  onClose,
}: {
  onLogin: () => void;
  onClose: () => void;
}) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await adminLogin(username, password);
    setLoading(false);
    if (result.success) {
      onLogin();
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="admin-overlay">
      <div className="admin-login-modal">
        <div className="admin-login-head">
          <div className="login-icon">🔒</div>
          <h2>Admin Login</h2>
          <p>Listening Korner Management Portal</p>
        </div>

        {error && <div className="admin-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <label>
            Username
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin or rekha"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
            />
          </label>

          <div className="login-help-tip">
            💡 Default password: <strong>admin123</strong> (You can change it inside Settings)
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In to Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- ENRICHED INQUIRIES VIEW -----------------
function InquiriesView({
  inquiries,
  loading,
  onRefresh,
  onNotify,
}: {
  inquiries: Inquiry[];
  loading: boolean;
  onRefresh: () => void;
  onNotify: (type: "success" | "error", text: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "completed">("all");
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const filtered = inquiries.filter((inq) => {
    if (filter !== "all" && inq.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inq.name.toLowerCase().includes(q) ||
        (inq.email || "").toLowerCase().includes(q) ||
        (inq.phone || "").toLowerCase().includes(q) ||
        (inq.location || "").toLowerCase().includes(q) ||
        (inq.otherClientDetails || "").toLowerCase().includes(q) ||
        (inq.message || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = async (id: string, status: Inquiry["status"]) => {
    const success = await updateInquiryStatus(id, status);
    if (success) {
      onNotify("success", `Marked as ${status}`);
      onRefresh();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } else {
      onNotify("error", "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    const success = await deleteInquiry(id);
    if (success) {
      onNotify("success", "Enquiry deleted");
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      onRefresh();
    } else {
      onNotify("error", "Failed to delete enquiry");
    }
  };

  const handleExportCsv = () => {
    let csv =
      "ID,Date,Client Name,Age,Location,WhatsApp,Email,Session Mode,Seeking For,Other Client Details,Suitable Timings,Suitable Days,Status,Issue Description\n";
    for (const inq of inquiries) {
      const clean = (s: any) => `"${(s || "").toString().replace(/"/g, '""').replace(/\n/g, " ")}"`;
      csv += `${inq.id},${inq.createdAt},${clean(inq.name)},${clean(inq.age)},${clean(
        inq.location
      )},${clean(inq.phone)},${clean(inq.email)},${clean(inq.sessionMode)},${clean(
        inq.seekingFor
      )},${clean(inq.otherClientDetails)},${clean(inq.suitableTiming)},${clean(
        inq.suitableDays
      )},${inq.status},${clean(inq.message)}\n`;
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `listeningkorner-enquiries-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify("success", "Downloaded CSV spreadsheet");
  };

  return (
    <div className="admin-section">
      {/* Quick Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="stat-label">Total Enquiries</span>
          <span className="stat-value">{inquiries.length}</span>
        </div>
        <div className="admin-stat-card stat-accent">
          <span className="stat-label">New / Pending</span>
          <span className="stat-value">{inquiries.filter((i) => i.status === "new").length}</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Contacted</span>
          <span className="stat-value">
            {inquiries.filter((i) => i.status === "contacted").length}
          </span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Completed Sessions</span>
          <span className="stat-value">
            {inquiries.filter((i) => i.status === "completed").length}
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="admin-toolbar">
        <div className="admin-filter-group">
          {(["all", "new", "contacted", "completed"] as const).map((tab) => (
            <button
              key={tab}
              className={`filter-pill ${filter === tab ? "active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "new" && (
                <span className="pill-count">
                  {inquiries.filter((i) => i.status === "new").length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="admin-search-wrap">
          <input
            type="search"
            placeholder="Search by client name, phone, email, notes, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-toolbar-actions">
          <button className="admin-btn admin-btn-sm" onClick={onRefresh} title="Refresh">
            🔄 Refresh
          </button>
          <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={handleExportCsv}>
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* Inquiry List */}
      {loading ? (
        <div className="admin-empty">Loading enquiries...</div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <p>No enquiries found matching your filter.</p>
        </div>
      ) : (
        <div className="inquiries-grid">
          {filtered.map((inq) => {
            const dateStr = new Date(inq.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            });
            const phoneDigits = (inq.phone || "").replace(/\D/g, "");
            const whatsappMsg = `Hello ${inq.name}, thank you for reaching out to Listening Korner. We received your booking enquiry for a therapy session. We would love to connect with you regarding scheduling your session during ${
              inq.suitableTiming || "your preferred time"
            } on ${inq.suitableDays || "weekdays"}.`;

            const whatsappUrl = phoneDigits
              ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(whatsappMsg)}`
              : null;

            return (
              <div
                key={inq.id}
                className={`inquiry-card status-${inq.status} ${
                  selectedInquiry?.id === inq.id ? "selected" : ""
                }`}
                onClick={() => setSelectedInquiry(inq)}
              >
                <div className="inquiry-card-top">
                  <div>
                    <span className="inquiry-client-name">
                      {inq.name}
                      {inq.age && <small style={{ fontWeight: 400, color: "#6e7c70" }}> ({inq.age} yrs)</small>}
                    </span>
                    <span className="inquiry-date">{dateStr}</span>
                  </div>
                  <span className={`status-badge badge-${inq.status}`}>{inq.status}</span>
                </div>

                {inq.location && (
                  <div className="inquiry-detail-row" style={{ fontSize: 13, color: "#3d4e40" }}>
                    📍 {inq.location} • 💻 {inq.sessionMode || "Online"}
                  </div>
                )}

                {inq.seekingFor === "someone else" && inq.otherClientDetails && (
                  <div
                    style={{
                      fontSize: 12,
                      background: "#fdf8ee",
                      border: "1px solid #ebdfc8",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      color: "#6b5636",
                    }}
                  >
                    👥 Seeking for: <strong>{inq.otherClientDetails}</strong>
                  </div>
                )}

                <div className="inquiry-contact-links">
                  {inq.phone && <span className="contact-tag">📞 {inq.phone}</span>}
                  {inq.email && inq.email !== "Not provided" && (
                    <a
                      href={`mailto:${inq.email}?subject=Listening Korner - Session Enquiry`}
                      className="contact-tag"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ✉️ {inq.email}
                    </a>
                  )}
                </div>

                {(inq.suitableTiming || inq.suitableDays) && (
                  <div style={{ fontSize: 12, color: "#606d62" }}>
                    ⏱ {inq.suitableTiming || "Flexible"} • 📅 {inq.suitableDays || "Flexible"}
                  </div>
                )}

                {inq.message && (
                  <p className="inquiry-preview-msg">
                    <strong>Issue Note:</strong> “{inq.message.length > 120 ? inq.message.slice(0, 120) + "..." : inq.message}”
                  </p>
                )}

                <div className="inquiry-actions-row">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="action-btn-whatsapp"
                      onClick={(e) => e.stopPropagation()}
                    >
                      💬 WhatsApp
                    </a>
                  )}
                  {inq.status === "new" ? (
                    <button
                      className="action-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(inq.id, "contacted");
                      }}
                    >
                      Mark Contacted
                    </button>
                  ) : inq.status === "contacted" ? (
                    <button
                      className="action-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(inq.id, "completed");
                      }}
                    >
                      Mark Completed
                    </button>
                  ) : (
                    <button
                      className="action-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(inq.id, "new");
                      }}
                    >
                      Mark as New
                    </button>
                  )}
                  <button
                    className="action-btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(inq.id);
                    }}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="admin-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Enquiry Details: {selectedInquiry.name}</h3>
              <button className="admin-close-btn" onClick={() => setSelectedInquiry(null)}>
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="modal-field">
                <span className="modal-label">Received At</span>
                <span>{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
              </div>
              <div className="modal-field">
                <span className="modal-label">Client Name & Age</span>
                <strong>
                  {selectedInquiry.name} ({selectedInquiry.age || "N/A"} years)
                </strong>
              </div>
              <div className="modal-field">
                <span className="modal-label">Location</span>
                <span>{selectedInquiry.location || "Not specified"}</span>
              </div>
              <div className="modal-field">
                <span className="modal-label">WhatsApp Number</span>
                <span>{selectedInquiry.phone}</span>
              </div>
              <div className="modal-field">
                <span className="modal-label">Email</span>
                <a href={`mailto:${selectedInquiry.email}`} className="text-link">
                  {selectedInquiry.email || "Not provided"}
                </a>
              </div>
              <div className="modal-field">
                <span className="modal-label">Session Mode</span>
                <span className="badge-service">{selectedInquiry.sessionMode || "Online"}</span>
              </div>
              <div className="modal-field">
                <span className="modal-label">Seeking For</span>
                <span>
                  {selectedInquiry.seekingFor === "self"
                    ? "Self"
                    : `Someone else: ${selectedInquiry.otherClientDetails || "Client details"}`}
                </span>
              </div>
              <div className="modal-field">
                <span className="modal-label">Suitable Days & Timings</span>
                <span>
                  {selectedInquiry.suitableDays || "Flexible"} •{" "}
                  {selectedInquiry.suitableTiming || "Flexible"}
                </span>
              </div>
              <div className="modal-field">
                <span className="modal-label">Describe your issue in your own words</span>
                <div
                  style={{
                    background: "#fbfdfa",
                    border: "1px solid #d8e2d5",
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginTop: 4,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#28382b",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedInquiry.message || (
                    <em style={{ color: "#7a8a7c" }}>
                      No note provided — client opted to discuss directly during the first session.
                    </em>
                  )}
                </div>
              </div>
              <div className="modal-field">
                <span className="modal-label">Status</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) =>
                    handleStatusChange(selectedInquiry.id, e.target.value as Inquiry["status"])
                  }
                  className="admin-select"
                >
                  <option value="new">New / Unread</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="admin-modal-actions">
              {selectedInquiry.phone && (
                <a
                  href={`https://wa.me/${selectedInquiry.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-btn admin-btn-success"
                >
                  💬 Open in WhatsApp
                </a>
              )}
              {selectedInquiry.email && selectedInquiry.email !== "Not provided" && (
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Listening Korner`}
                  className="admin-btn admin-btn-primary"
                >
                  ✉️ Send Email
                </a>
              )}
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => handleDelete(selectedInquiry.id)}
              >
                Delete Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// ----------------- PRICING & SESSIONS VIEW -----------------
function PricingView({
  content,
  onUpdate,
  onNotify,
}: {
  content: SiteContent;
  onUpdate: (newContent: SiteContent) => void;
  onNotify: (type: "success" | "error", text: string) => void;
}) {
  const [plans, setPlans] = useState<PricingPlan[]>(content.pricing || []);
  const [pricingNote, setPricingNote] = useState(content.pricingNote || "");
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fee Structure
  const [feeStructure, setFeeStructure] = useState<FeeStructure>(
    content.feeStructure || {
      india: { individual: "₹800 / 60 mins", couple: "₹1000 / 60 mins" },
      international: { individual: "₹1000 / 60 mins", couple: "₹1500 / 60 mins" },
      note: "Extra charges if session exceeds beyond 60 mins",
    }
  );

  const handleSave = async (updatedPlans: PricingPlan[], updatedNote: string, updatedFees: FeeStructure) => {
    setSaving(true);
    const updatedContent = {
      ...content,
      pricing: updatedPlans,
      pricingNote: updatedNote,
      feeStructure: updatedFees,
    };
    const res = await updateSiteContent("all", updatedContent);
    setSaving(false);
    if (res.success && res.content) {
      onUpdate(res.content);
      onNotify("success", "Pricing and fees updated successfully!");
    } else {
      onNotify("error", "Failed to update pricing");
    }
  };

  const handleEditPlan = (plan: PricingPlan) => {
    setEditingPlan({ ...plan });
    setIsNewPlan(false);
  };

  const handleAddNewPlan = () => {
    setEditingPlan({
      id: `plan-${Date.now()}`,
      type: "Individual Therapy",
      name: "Custom Session",
      price: "800",
      duration: "60 minutes",
      description: "Personalized support tailored to your unique journey.",
      featured: false,
    });
    setIsNewPlan(true);
  };

  const handleSavePlanModal = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    let updated: PricingPlan[];
    if (isNewPlan) {
      updated = [...plans, editingPlan];
    } else {
      updated = plans.map((p) => (p.id === editingPlan.id ? editingPlan : p));
    }
    setPlans(updated);
    setEditingPlan(null);
    await handleSave(updated, pricingNote, feeStructure);
  };

  const handleDeletePlan = async (id: string) => {
    if (plans.length <= 1) {
      alert("You must have at least one pricing plan.");
      return;
    }
    if (!confirm("Are you sure you want to remove this pricing plan?")) return;
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    await handleSave(updated, pricingNote, feeStructure);
  };

  return (
    <div className="admin-section">
      <div className="section-title-row">
        <div>
          <h3>Session Pricing & Packages</h3>
          <p>
            Update your rates, fee structure for India and International, session durations, and
            descriptions.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAddNewPlan}>
          + Add New Session Plan
        </button>
      </div>

      {/* Official Fee Structure Editor */}
      <div className="admin-card-box">
        <h4>Intake Fee Structure (India & International)</h4>
        <p>These official rates are shown on the Sessions page and Intake Booking form:</p>

        <div className="form-row-2">
          <label>
            India — Individual Session
            <input
              type="text"
              value={feeStructure.india.individual}
              onChange={(e) =>
                setFeeStructure({
                  ...feeStructure,
                  india: { ...feeStructure.india, individual: e.target.value },
                })
              }
            />
          </label>
          <label>
            India — Couple Counselling
            <input
              type="text"
              value={feeStructure.india.couple}
              onChange={(e) =>
                setFeeStructure({
                  ...feeStructure,
                  india: { ...feeStructure.india, couple: e.target.value },
                })
              }
            />
          </label>
        </div>

        <div className="form-row-2">
          <label>
            International — Individual Session
            <input
              type="text"
              value={feeStructure.international.individual}
              onChange={(e) =>
                setFeeStructure({
                  ...feeStructure,
                  international: { ...feeStructure.international, individual: e.target.value },
                })
              }
            />
          </label>
          <label>
            International — Couple Counselling
            <input
              type="text"
              value={feeStructure.international.couple}
              onChange={(e) =>
                setFeeStructure({
                  ...feeStructure,
                  international: { ...feeStructure.international, couple: e.target.value },
                })
              }
            />
          </label>
        </div>

        <label>
          Additional Fee Note
          <input
            type="text"
            value={feeStructure.note}
            onChange={(e) => setFeeStructure({ ...feeStructure, note: e.target.value })}
          />
        </label>

        <div style={{ marginTop: 8 }}>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => handleSave(plans, pricingNote, feeStructure)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Fee Structure"}
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="pricing-admin-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`admin-price-card ${plan.featured ? "is-featured" : ""}`}>
            {plan.featured && <span className="admin-featured-tag">★ Featured / Most Chosen</span>}
            <div className="admin-price-card-head">
              <span className="plan-category">{plan.type}</span>
              <h4>{plan.name}</h4>
              <div className="admin-price-display">
                <span className="currency">₹</span>
                <span className="amount">{plan.price}</span>
                <span className="unit">/ session</span>
              </div>
              <span className="plan-duration">⏱ {plan.duration}</span>
            </div>
            <p className="admin-price-desc">{plan.description}</p>
            <div className="admin-price-actions">
              <button
                className="admin-btn admin-btn-sm admin-btn-outline"
                onClick={() => handleEditPlan(plan)}
              >
                ✏ Edit Details & Price
              </button>
              <button
                className="admin-btn admin-btn-sm admin-btn-danger"
                onClick={() => handleDeletePlan(plan.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Barrier Note */}
      <div className="admin-card-box">
        <h4>Pricing Bottom Note</h4>
        <p>Text shown below your pricing table for clients who need financial accommodations:</p>
        <textarea
          rows={2}
          value={pricingNote}
          onChange={(e) => setPricingNote(e.target.value)}
          className="admin-textarea"
        />
        <div style={{ marginTop: 12 }}>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => handleSave(plans, pricingNote, feeStructure)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Pricing Note"}
          </button>
        </div>
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="admin-overlay" onClick={() => setEditingPlan(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{isNewPlan ? "Add New Session Plan" : `Edit Plan: ${editingPlan.name}`}</h3>
              <button className="admin-close-btn" onClick={() => setEditingPlan(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSavePlanModal}>
              <div className="admin-modal-body">
                <div className="form-row-2">
                  <label>
                    Plan Name
                    <input
                      type="text"
                      required
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      placeholder="e.g. Introductory, Standard, Extended"
                    />
                  </label>
                  <label>
                    Category
                    <input
                      type="text"
                      required
                      value={editingPlan.type}
                      onChange={(e) => setEditingPlan({ ...editingPlan, type: e.target.value })}
                      placeholder="e.g. Individual Therapy"
                    />
                  </label>
                </div>

                <div className="form-row-2">
                  <label>
                    Price (INR ₹)
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingPlan.price}
                      onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                      placeholder="e.g. 600"
                    />
                  </label>
                  <label>
                    Duration
                    <input
                      type="text"
                      required
                      value={editingPlan.duration}
                      onChange={(e) =>
                        setEditingPlan({ ...editingPlan, duration: e.target.value })
                      }
                      placeholder="e.g. 60 minutes"
                    />
                  </label>
                </div>

                <label>
                  Short Description
                  <textarea
                    rows={3}
                    required
                    value={editingPlan.description}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, description: e.target.value })
                    }
                    placeholder="Brief description of what this session provides"
                  />
                </label>

                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={editingPlan.featured || false}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, featured: e.target.checked })
                    }
                  />
                  Highlight as "Most chosen" / featured plan
                </label>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  onClick={() => setEditingPlan(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------- WEBSITE & PROFILE CONTENT VIEW -----------------
function ContentView({
  content,
  onUpdate,
  onNotify,
}: {
  content: SiteContent;
  onUpdate: (newContent: SiteContent) => void;
  onNotify: (type: "success" | "error", text: string) => void;
}) {
  const [profile, setProfile] = useState(content.profile);
  const [hero, setHero] = useState(content.hero);
  const [contact, setContact] = useState(content.contact);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const updated = {
      ...content,
      profile,
      hero,
      contact,
    };
    const res = await updateSiteContent("all", updated);
    setSaving(false);
    if (res.success && res.content) {
      onUpdate(res.content);
      onNotify("success", "Website details updated successfully!");
    } else {
      onNotify("error", "Failed to update website content");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      setProfile((prev) => ({ ...prev, photo: url }));
      onNotify("success", "Photo uploaded successfully!");
    } catch {
      onNotify("error", "Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSelectDefaultPhoto = () => {
    setProfile((prev) => ({ ...prev, photo: "/rekha.jpg" }));
    onNotify("success", "Set to Rekha Devi Chauhan portrait (/rekha.jpg)");
  };

  return (
    <form onSubmit={handleSave} className="admin-section">
      <div className="section-title-row">
        <div>
          <h3>Website Content & Personal Profile</h3>
          <p>
            Complete control over your personal bio, therapist photo, contact channels, and hero text.
          </p>
        </div>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? "Saving Changes..." : "💾 Save All Changes"}
        </button>
      </div>

      {/* Profile Photo Section */}
      <div className="admin-card-box">
        <h4>Therapist Portrait Photo</h4>
        <div className="photo-editor-grid">
          <div className="photo-preview-wrap">
            <img
              src={profile.photo || "/rekha.jpg"}
              alt={profile.name}
              className="photo-preview-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/rekha.jpg";
              }}
            />
          </div>
          <div className="photo-controls">
            <p>
              Current photo: <code>{profile.photo}</code>
            </p>
            <div className="photo-button-row">
              <button
                type="button"
                className="admin-btn admin-btn-sm admin-btn-outline"
                onClick={handleSelectDefaultPhoto}
              >
                📸 Use Uploaded Photo (/rekha.jpg)
              </button>
              <label className="admin-btn admin-btn-sm admin-btn-ghost file-input-label">
                {uploading ? "Uploading..." : "📁 Upload New Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
              </label>
            </div>
            <label style={{ marginTop: 12 }}>
              Or enter custom image URL:
              <input
                type="text"
                value={profile.photo}
                onChange={(e) => setProfile({ ...profile, photo: e.target.value })}
                placeholder="https://... or /rekha.jpg"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Profile Identity */}
      <div className="admin-card-box">
        <h4>Therapist Details & Bio</h4>
        <div className="form-row-2">
          <label>
            Full Name
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </label>
          <label>
            Qualifications & Degree
            <input
              type="text"
              required
              value={profile.credentials}
              onChange={(e) => setProfile({ ...profile, credentials: e.target.value })}
            />
          </label>
        </div>

        <label>
          Professional Title
          <input
            type="text"
            required
            value={profile.title}
            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
          />
        </label>

        <label>
          Bio Paragraph 1
          <textarea
            rows={3}
            value={profile.bioParagraphs[0] || ""}
            onChange={(e) => {
              const paras = [...profile.bioParagraphs];
              paras[0] = e.target.value;
              setProfile({ ...profile, bioParagraphs: paras });
            }}
          />
        </label>

        <label>
          Bio Paragraph 2 (Experience & Neurodivergence)
          <textarea
            rows={3}
            value={profile.bioParagraphs[1] || ""}
            onChange={(e) => {
              const paras = [...profile.bioParagraphs];
              paras[1] = e.target.value;
              setProfile({ ...profile, bioParagraphs: paras });
            }}
          />
        </label>

        <label>
          Bio Paragraph 3 (Session Flow)
          <textarea
            rows={3}
            value={profile.bioParagraphs[2] || ""}
            onChange={(e) => {
              const paras = [...profile.bioParagraphs];
              paras[2] = e.target.value;
              setProfile({ ...profile, bioParagraphs: paras });
            }}
          />
        </label>

        <label>
          Personal Philosophy / Guiding Quote
          <input
            type="text"
            value={profile.philosophy}
            onChange={(e) => setProfile({ ...profile, philosophy: e.target.value })}
          />
        </label>

        <label>
          Philosophy Subtext
          <textarea
            rows={2}
            value={profile.philosophySubtext}
            onChange={(e) => setProfile({ ...profile, philosophySubtext: e.target.value })}
          />
        </label>

        <label>
          Languages Spoken (comma separated)
          <input
            type="text"
            value={(profile.languages || []).join(", ")}
            onChange={(e) =>
              setProfile({
                ...profile,
                languages: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
        </label>
      </div>

      {/* Hero Content */}
      <div className="admin-card-box">
        <h4>Hero Section</h4>
        <label>
          Eyebrow Badge
          <input
            type="text"
            value={hero.eyebrow}
            onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
          />
        </label>
        <label>
          Headline
          <textarea
            rows={2}
            value={hero.headline}
            onChange={(e) => setHero({ ...hero, headline: e.target.value })}
          />
        </label>
        <label>
          Introductory Paragraph
          <textarea
            rows={3}
            value={hero.intro}
            onChange={(e) => setHero({ ...hero, intro: e.target.value })}
          />
        </label>
        <div className="form-row-2">
          <label>
            Image Card Note
            <input
              type="text"
              value={hero.quote}
              onChange={(e) => setHero({ ...hero, quote: e.target.value })}
            />
          </label>
          <label>
            Trust Note Title
            <input
              type="text"
              value={hero.trustTitle}
              onChange={(e) => setHero({ ...hero, trustTitle: e.target.value })}
            />
          </label>
        </div>
      </div>

      {/* Contact Channels */}
      <div className="admin-card-box">
        <h4>Contact & Channels</h4>
        <div className="form-row-2">
          <label>
            Email Address
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
            />
          </label>
          <label>
            Phone Number
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            />
          </label>
        </div>
        <div className="form-row-2">
          <label>
            WhatsApp (Country code + digits, e.g. 9146776914)
            <input
              type="text"
              value={contact.whatsapp}
              onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
            />
          </label>
          <label>
            Instagram Handle
            <input
              type="text"
              value={contact.instagram}
              onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
            />
          </label>
        </div>
        <div className="form-row-2">
          <label>
            Location / Coverage
            <input
              type="text"
              value={contact.location}
              onChange={(e) => setContact({ ...contact, location: e.target.value })}
            />
          </label>
          <label>
            Session Mode
            <input
              type="text"
              value={contact.mode}
              onChange={(e) => setContact({ ...contact, mode: e.target.value })}
            />
          </label>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-lg" disabled={saving}>
          {saving ? "Saving Changes..." : "💾 Save All Changes"}
        </button>
      </div>
    </form>
  );
}

// ----------------- FAQS VIEW -----------------
function FaqsView({
  content,
  onUpdate,
  onNotify,
}: {
  content: SiteContent;
  onUpdate: (newContent: SiteContent) => void;
  onNotify: (type: "success" | "error", text: string) => void;
}) {
  const [faqs, setFaqs] = useState<FaqItem[]>(content.faqs || []);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveFaqs = async (updated: FaqItem[]) => {
    setSaving(true);
    const updatedContent = { ...content, faqs: updated };
    const res = await updateSiteContent("all", updatedContent);
    setSaving(false);
    if (res.success && res.content) {
      onUpdate(res.content);
      onNotify("success", "FAQs saved!");
    } else {
      onNotify("error", "Failed to save FAQs");
    }
  };

  const handleAddFaq = () => {
    setEditingFaq({
      id: `faq-${Date.now()}`,
      q: "New Question?",
      a: "Answer here...",
    });
    setIsNew(true);
  };

  const handleSaveModal = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    let updated: FaqItem[];
    if (isNew) {
      updated = [...faqs, editingFaq];
    } else {
      updated = faqs.map((f) => (f.id === editingFaq.id ? editingFaq : f));
    }
    setFaqs(updated);
    setEditingFaq(null);
    await handleSaveFaqs(updated);
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    await handleSaveFaqs(updated);
  };

  return (
    <div className="admin-section">
      <div className="section-title-row">
        <div>
          <h3>Frequently Asked Questions</h3>
          <p>Clients see these reassuring FAQs on your sessions page.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAddFaq}>
          + Add New FAQ
        </button>
      </div>

      <div className="admin-faq-list">
        {faqs.map((faq, i) => (
          <div key={faq.id} className="admin-faq-card">
            <div className="admin-faq-head">
              <span className="faq-num">Q{i + 1}.</span>
              <h4>{faq.q}</h4>
            </div>
            <p className="admin-faq-answer">{faq.a}</p>
            <div className="admin-faq-actions">
              <button
                className="admin-btn admin-btn-sm admin-btn-outline"
                onClick={() => {
                  setEditingFaq({ ...faq });
                  setIsNew(false);
                }}
              >
                ✏ Edit
              </button>
              <button
                className="admin-btn admin-btn-sm admin-btn-danger"
                onClick={() => handleDeleteFaq(faq.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingFaq && (
        <div className="admin-overlay" onClick={() => setEditingFaq(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{isNew ? "Add FAQ" : "Edit FAQ"}</h3>
              <button className="admin-close-btn" onClick={() => setEditingFaq(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveModal}>
              <div className="admin-modal-body">
                <label>
                  Question
                  <input
                    type="text"
                    required
                    value={editingFaq.q}
                    onChange={(e) => setEditingFaq({ ...editingFaq, q: e.target.value })}
                  />
                </label>
                <label>
                  Answer
                  <textarea
                    rows={4}
                    required
                    value={editingFaq.a}
                    onChange={(e) => setEditingFaq({ ...editingFaq, a: e.target.value })}
                  />
                </label>
              </div>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  onClick={() => setEditingFaq(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------- SETTINGS & SECURITY VIEW -----------------
function SettingsView({
  onNotify,
}: {
  onNotify: (type: "success" | "error", text: string) => void;
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      onNotify("error", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      onNotify("error", "New password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const res = await adminChangePassword(oldPassword, newPassword);
    setLoading(false);
    if (res.success) {
      onNotify("success", "Password updated! Please remember your new password.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      onNotify("error", res.error || "Failed to update password");
    }
  };

  return (
    <div className="admin-section narrow-admin">
      <div className="admin-card-box">
        <h4>Change Admin Password</h4>
        <p>Update your admin login password to keep your dashboard secure.</p>

        <form onSubmit={handlePasswordSubmit} className="admin-form" style={{ marginTop: 16 }}>
          <label>
            Current Password
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password (default: admin123)"
            />
          </label>

          <label>
            New Password (at least 6 characters)
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
            />
          </label>

          <label>
            Confirm New Password
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
            />
          </label>

          <div style={{ marginTop: 16 }}>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card-box info-box">
        <h4>🔒 Security & Access Information</h4>
        <p>
          • <strong>Admin Route:</strong> You can access this portal at any time by visiting <code>#admin</code> on your browser or clicking "Admin Portal" in the footer.
        </p>
        <p>
          • <strong>Session Duration:</strong> You remain logged in for 14 days on this device.
        </p>
        <p>
          • <strong>Data Storage:</strong> All inquiries, custom prices, team psychologists, and website edits are stored in lightweight, automated server storage.
        </p>
      </div>
    </div>
  );
}
