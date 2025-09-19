import React, { useState, useEffect } from "react";
import AxiosComponent from "../services/axiosComponent";

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});
  
  // Filter and sort states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    category: "",
    type: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    category: "general",
    isPinned: false,
    targetAudience: "approved_users",
    displaySettings: {
      showOnDashboard: true,
      showInNotifications: true,
      autoHide: false
    },
    scheduling: {
      publishAt: "",
      expireAt: ""
    },
    links: []
  });

  // Action loading states
  const [actionLoading, setActionLoading] = useState({});

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await AxiosComponent.get(`/api/announcements/admin/all?${queryParams}`);

      if (response.data && response.data.success) {
        setAnnouncements(response.data.data.announcements || []);
        setPagination(response.data.meta?.pagination || {});
      } else {
        setError("Failed to fetch announcements");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to load announcements"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await AxiosComponent.get("/api/announcements/admin/statistics");
      
      if (response.data && response.data.success) {
        setStatistics(response.data.data || {});
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  // Fetch data on component mount and filter changes
  useEffect(() => {
    fetchAnnouncements();
  }, [filters]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Handle form input changes
  const handleFormChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      type: "info",
      category: "general",
      isPinned: false,
      targetAudience: "approved_users",
      displaySettings: {
        showOnDashboard: true,
        showInNotifications: true,
        autoHide: false
      },
      scheduling: {
        publishAt: "",
        expireAt: ""
      },
      links: []
    });
  };

  // Create announcement
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(prev => ({ ...prev, create: true }));

      // Prepare data
      const submitData = { ...formData };
      
      // Convert dates to ISO format if provided
      if (submitData.scheduling.publishAt) {
        submitData.scheduling.publishAt = new Date(submitData.scheduling.publishAt).toISOString();
      }
      if (submitData.scheduling.expireAt) {
        submitData.scheduling.expireAt = new Date(submitData.scheduling.expireAt).toISOString();
      }

      const response = await AxiosComponent.post("/api/announcements/admin/create", submitData);

      if (response.data && response.data.success) {
        setShowCreateModal(false);
        resetForm();
        fetchAnnouncements();
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      setError(error.response?.data?.message || "Failed to create announcement");
    } finally {
      setActionLoading(prev => ({ ...prev, create: false }));
    }
  };

  // Update announcement
  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(prev => ({ ...prev, edit: true }));

      const response = await AxiosComponent.put(
        `/api/announcements/admin/${selectedAnnouncement._id}`,
        formData
      );

      if (response.data && response.data.success) {
        setShowEditModal(false);
        setSelectedAnnouncement(null);
        resetForm();
        fetchAnnouncements();
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error updating announcement:", error);
      setError(error.response?.data?.message || "Failed to update announcement");
    } finally {
      setActionLoading(prev => ({ ...prev, edit: false }));
    }
  };

  // Delete announcement
  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      setActionLoading(prev => ({ ...prev, [announcementId]: "deleting" }));

      const response = await AxiosComponent.delete(`/api/announcements/admin/${announcementId}`);

      if (response.data && response.data.success) {
        fetchAnnouncements();
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      setError(error.response?.data?.message || "Failed to delete announcement");
    } finally {
      setActionLoading(prev => ({ ...prev, [announcementId]: null }));
    }
  };

  // Toggle pin status
  const handleTogglePin = async (announcementId) => {
    try {
      setActionLoading(prev => ({ ...prev, [announcementId]: "pinning" }));

      const response = await AxiosComponent.put(`/api/announcements/admin/${announcementId}/pin`);

      if (response.data && response.data.success) {
        fetchAnnouncements();
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
      setError(error.response?.data?.message || "Failed to toggle pin status");
    } finally {
      setActionLoading(prev => ({ ...prev, [announcementId]: null }));
    }
  };

  // Toggle active status
  const handleToggleActive = async (announcementId) => {
    try {
      setActionLoading(prev => ({ ...prev, [announcementId]: "activating" }));

      const response = await AxiosComponent.put(`/api/announcements/admin/${announcementId}/active`);

      if (response.data && response.data.success) {
        fetchAnnouncements();
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error toggling active status:", error);
      setError(error.response?.data?.message || "Failed to toggle active status");
    } finally {
      setActionLoading(prev => ({ ...prev, [announcementId]: null }));
    }
  };

  // Cleanup expired announcements
  const handleCleanupExpired = async () => {
    if (!window.confirm("Are you sure you want to cleanup all expired announcements?")) return;

    try {
      setActionLoading(prev => ({ ...prev, cleanup: true }));

      const response = await AxiosComponent.post("/api/announcements/admin/cleanup-expired");

      if (response.data && response.data.success) {
        fetchAnnouncements();
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error cleaning up expired announcements:", error);
      setError(error.response?.data?.message || "Failed to cleanup expired announcements");
    } finally {
      setActionLoading(prev => ({ ...prev, cleanup: false }));
    }
  };

  // Open edit modal
  const openEditModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title || "",
      message: announcement.message || "",
      type: announcement.type || "info",
      category: announcement.category || "general",
      isPinned: announcement.isPinned || false,
      targetAudience: announcement.targetAudience || "approved_users",
      displaySettings: announcement.displaySettings || {
        showOnDashboard: true,
        showInNotifications: true,
        autoHide: false
      },
      scheduling: {
        publishAt: announcement.scheduling?.publishAt ? 
          new Date(announcement.scheduling.publishAt).toISOString().slice(0, 16) : "",
        expireAt: announcement.scheduling?.expireAt ? 
          new Date(announcement.scheduling.expireAt).toISOString().slice(0, 16) : ""
      },
      links: announcement.links || []
    });
    setShowEditModal(true);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get type badge style
  const getTypeBadge = (type) => {
    const typeStyles = {
      success: { background: "#dcfce7", color: "#059669", border: "#bbf7d0" },
      warning: { background: "#fef3c7", color: "#d97706", border: "#fde68a" },
      error: { background: "#fecaca", color: "#dc2626", border: "#fca5a5" },
      info: { background: "#dbeafe", color: "#2563eb", border: "#bfdbfe" }
    };

    return (
      <span style={{
        ...styles.typeBadge,
        backgroundColor: typeStyles[type]?.background || "#f1f5f9",
        color: typeStyles[type]?.color || "#64748b",
        borderColor: typeStyles[type]?.border || "#e2e8f0"
      }}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (announcement) => {
    const now = new Date();
    const publishAt = announcement.scheduling?.publishAt ? new Date(announcement.scheduling.publishAt) : null;
    const expireAt = announcement.scheduling?.expireAt ? new Date(announcement.scheduling.expireAt) : null;

    let status = "active";
    let color = "#10b981";
    let bgColor = "#dcfce7";

    if (!announcement.isActive) {
      status = "inactive";
      color = "#6b7280";
      bgColor = "#f3f4f6";
    } else if (publishAt && now < publishAt) {
      status = "scheduled";
      color = "#3b82f6";
      bgColor = "#dbeafe";
    } else if (expireAt && now > expireAt) {
      status = "expired";
      color = "#dc2626";
      bgColor = "#fecaca";
    }

    return (
      <span style={{
        ...styles.statusBadge,
        backgroundColor: bgColor,
        color: color
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Announcement Management</h2>
          <p style={styles.subtitle}>Create and manage system announcements</p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.createBtn}
            onClick={() => setShowCreateModal(true)}
          >
            <span style={styles.btnIcon}>+</span>
            Create Announcement
          </button>
          <button
            style={styles.cleanupBtn}
            onClick={handleCleanupExpired}
            disabled={actionLoading.cleanup}
          >
            <span style={styles.btnIcon}>🗑️</span>
            {actionLoading.cleanup ? "Cleaning..." : "Cleanup Expired"}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📢</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{statistics.total || 0}</div>
              <div style={styles.statLabel}>Total Announcements</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{statistics.active || 0}</div>
              <div style={styles.statLabel}>Active</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📌</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{statistics.pinned || 0}</div>
              <div style={styles.statLabel}>Pinned</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👀</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{statistics.totalViews || 0}</div>
              <div style={styles.statLabel}>Total Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={styles.filtersContainer}>
        <div style={styles.filterActions}>
          <button
            style={styles.filterToggleBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 {showFilters ? "Hide" : "Show"} Filters
          </button>
          <button style={styles.refreshBtn} onClick={fetchAnnouncements}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div style={styles.filtersSection}>
          <div style={styles.filtersGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Search</label>
              <input
                type="text"
                placeholder="Search announcements..."
                value={filters.search}
                onChange={handleSearch}
                style={styles.filterInput}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="system">System</option>
                <option value="maintenance">Maintenance</option>
                <option value="feature">Feature</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={styles.errorMessage}>
          <span style={styles.errorIcon}>⚠️</span>
          {error}
          <button style={styles.errorClose} onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* Announcements Table */}
      <div style={styles.tableContainer}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📢</div>
            <h4 style={styles.emptyTitle}>No announcements found</h4>
            <p style={styles.emptyText}>
              {filters.search || filters.status || filters.type || filters.category
                ? "Try adjusting your filters to see more results"
                : "Create your first announcement to get started"
              }
            </p>
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={styles.tableHeader}>Title</th>
                  <th style={styles.tableHeader}>Type</th>
                  <th style={styles.tableHeader}>Category</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Created</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody style={styles.tableBody}>
                {announcements.map((announcement) => (
                  <tr key={announcement._id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.titleCell}>
                        <div style={styles.announcementTitle}>
                          {announcement.isPinned && (
                            <span style={styles.pinnedIcon}>📌</span>
                          )}
                          {announcement.title}
                        </div>
                        <div style={styles.announcementMessage}>
                          {announcement.message.substring(0, 100)}
                          {announcement.message.length > 100 && "..."}
                        </div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      {getTypeBadge(announcement.type)}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.categoryBadge}>
                        {announcement.category}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      {getStatusBadge(announcement)}
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.dateCell}>
                        {formatDate(announcement.createdAt)}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionButtons}>
                        <button
                          style={styles.actionBtn}
                          onClick={() => openEditModal(announcement)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          style={{
                            ...styles.actionBtn,
                            ...(announcement.isPinned ? styles.pinnedActionBtn : {})
                          }}
                          onClick={() => handleTogglePin(announcement._id)}
                          disabled={actionLoading[announcement._id] === "pinning"}
                          title={announcement.isPinned ? "Unpin" : "Pin"}
                        >
                          {actionLoading[announcement._id] === "pinning" ? "..." : "📌"}
                        </button>
                        <button
                          style={{
                            ...styles.actionBtn,
                            ...(announcement.isActive ? styles.activeActionBtn : styles.inactiveActionBtn)
                          }}
                          onClick={() => handleToggleActive(announcement._id)}
                          disabled={actionLoading[announcement._id] === "activating"}
                          title={announcement.isActive ? "Deactivate" : "Activate"}
                        >
                          {actionLoading[announcement._id] === "activating" ? "..." : 
                           announcement.isActive ? "🟢" : "🔴"}
                        </button>
                        <button
                          style={{...styles.actionBtn, ...styles.deleteBtn}}
                          onClick={() => handleDeleteAnnouncement(announcement._id)}
                          disabled={actionLoading[announcement._id] === "deleting"}
                          title="Delete"
                        >
                          {actionLoading[announcement._id] === "deleting" ? "..." : "🗑️"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={styles.paginationContainer}>
                <div style={styles.paginationInfo}>
                  Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{" "}
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalItems)} of{" "}
                  {pagination.totalItems} announcements
                </div>
                <div style={styles.paginationControls}>
                  <button
                    style={{
                      ...styles.paginationBtn,
                      ...(pagination.hasPrev ? {} : styles.paginationBtnDisabled)
                    }}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    ← Previous
                  </button>
                  
                  <div style={styles.pageNumbers}>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        const start = Math.max(1, pagination.currentPage - 2);
                        pageNum = start + i;
                      }
                      
                      return pageNum <= pagination.totalPages ? (
                        <button
                          key={pageNum}
                          style={{
                            ...styles.pageBtn,
                            ...(pageNum === pagination.currentPage ? styles.pageBtnActive : {})
                          }}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ) : null;
                    })}
                  </div>

                  <button
                    style={{
                      ...styles.paginationBtn,
                      ...(pagination.hasNext ? {} : styles.paginationBtnDisabled)
                    }}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Create New Announcement</h3>
              <button
                style={styles.closeBtn}
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  style={styles.formInput}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleFormChange("message", e.target.value)}
                  style={styles.formTextarea}
                  rows="4"
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                    style={styles.formSelect}
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFormChange("category", e.target.value)}
                    style={styles.formSelect}
                  >
                    <option value="general">General</option>
                    <option value="community">Community</option>
                    <option value="system">System</option>
                    <option value="policy">Policy</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="feature">Feature</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => handleFormChange("targetAudience", e.target.value)}
                    style={styles.formSelect}
                  >
                    <option value="all">All Users</option>
                    <option value="approved_users">Approved Users</option>
                    <option value="pending_users">Pending Users</option>
                    <option value="admins">Admins Only</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => handleFormChange("isPinned", e.target.checked)}
                      style={styles.formCheckbox}
                    />
                    Pin this announcement
                  </label>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Publish At (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduling.publishAt}
                    onChange={(e) => handleFormChange("scheduling.publishAt", e.target.value)}
                    style={styles.formInput}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Expire At (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduling.expireAt}
                    onChange={(e) => handleFormChange("scheduling.expireAt", e.target.value)}
                    style={styles.formInput}
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAnnouncement(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.submitBtn}
                  disabled={actionLoading.edit}
                >
                  {actionLoading.edit ? "Updating..." : "Update Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "0",
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // Header styles
  header: {
    background: "white",
    padding: "32px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "16px",
    margin: "0",
    fontWeight: "400",
  },
  headerActions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  createBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    background: "linear-gradient(135deg, #38bdf8, #3b82f6)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
  },
  cleanupBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
  },
  btnIcon: {
    fontSize: "16px",
  },

  // Statistics section
  statsSection: {
    padding: "24px 32px 0",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  statCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  statIcon: {
    fontSize: "32px",
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    lineHeight: "1",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  },

  // Filters section
  filtersContainer: {
    padding: "0 32px",
  },
  filterActions: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
  },
  filterToggleBtn: {
    padding: "8px 16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    transition: "all 0.3s ease",
  },
  refreshBtn: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #94a3b8, #64748b)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "white",
    transition: "all 0.3s ease",
  },
  filtersSection: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    marginBottom: "24px",
  },
  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  filterLabel: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#475569",
  },
  filterInput: {
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    color: "#334155",
    fontWeight: "300",
    transition: "border-color 0.3s ease",
  },
  filterSelect: {
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    color: "#334155",
    fontWeight: "300",
    cursor: "pointer",
  },

  // Error message
  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 32px",
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: "14px",
    margin: "0 32px 24px",
    borderRadius: "8px",
  },
  errorIcon: {
    fontSize: "16px",
  },
  errorClose: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "18px",
    padding: "4px",
  },

  // Table styles
  tableContainer: {
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    margin: "0 32px 32px",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  tableHead: {
    background: "#f8fafc",
  },
  tableHeader: {
    padding: "16px",
    textAlign: "left",
    fontWeight: "600",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
  },
  tableBody: {
    background: "white",
  },
  tableRow: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background-color 0.3s ease",
  },
  tableCell: {
    padding: "16px",
    verticalAlign: "top",
  },

  // Table cell content
  titleCell: {
    maxWidth: "300px",
  },
  announcementTitle: {
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  pinnedIcon: {
    fontSize: "14px",
    color: "#f59e0b",
  },
  announcementMessage: {
    fontSize: "12px",
    color: "#64748b",
    lineHeight: "1.4",
  },
  typeBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    border: "1px solid",
    textTransform: "capitalize",
  },
  categoryBadge: {
    display: "inline-block",
    padding: "4px 8px",
    background: "#f1f5f9",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    color: "#475569",
    textTransform: "capitalize",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  dateCell: {
    fontSize: "12px",
    color: "#64748b",
  },

  // Action buttons
  actionButtons: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  actionBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    background: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  pinnedActionBtn: {
    background: "#fef3c7",
    borderColor: "#fde68a",
    color: "#d97706",
  },
  activeActionBtn: {
    background: "#dcfce7",
    borderColor: "#bbf7d0",
    color: "#059669",
  },
  inactiveActionBtn: {
    background: "#fee2e2",
    borderColor: "#fecaca",
    color: "#dc2626",
  },
  deleteBtn: {
    color: "#dc2626",
    borderColor: "#fca5a5",
  },

  // Loading and empty states
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #f1f5f9",
    borderTop: "3px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  loadingText: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  emptyText: {
    fontSize: "14px",
    color: "#64748b",
    maxWidth: "400px",
    lineHeight: "1.5",
    margin: "0",
  },

  // Pagination
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderTop: "1px solid #e2e8f0",
    background: "#f8fafc",
  },
  paginationInfo: {
    fontSize: "14px",
    color: "#64748b",
  },
  paginationControls: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  paginationBtn: {
    padding: "8px 16px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    transition: "all 0.3s ease",
  },
  paginationBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  pageNumbers: {
    display: "flex",
    gap: "4px",
  },
  pageBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    background: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  pageBtnActive: {
    background: "linear-gradient(135deg, #38bdf8, #3b82f6)",
    color: "white",
    borderColor: "#38bdf8",
  },

  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    background: "white",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 24px 0",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "24px",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    transition: "color 0.3s ease",
  },
  modalForm: {
    padding: "0 24px 24px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px",
  },
  formLabel: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "500",
    color: "#475569",
    fontSize: "14px",
  },
  formInput: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    color: "#334155",
    fontWeight: "300",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  },
  formTextarea: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    color: "#334155",
    fontWeight: "300",
    transition: "border-color 0.3s ease",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  formSelect: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    color: "#334155",
    fontWeight: "300",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  formCheckbox: {
    marginRight: "8px",
    transform: "scale(1.2)",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#475569",
    cursor: "pointer",
    marginBottom: "8px",
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  linkHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  addLinkBtn: {
    padding: "6px 12px",
    background: "linear-gradient(135deg, #38bdf8, #3b82f6)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  linkItem: {
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    marginBottom: "8px",
  },
  linkRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  removeLinkBtn: {
    width: "32px",
    height: "32px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "32px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  cancelBtn: {
    padding: "12px 24px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  submitBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #38bdf8, #3b82f6)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
  },

  // Responsive Design
  "@media (max-width: 768px)": {
    header: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "16px",
    },
    headerActions: {
      width: "100%",
      justifyContent: "flex-start",
    },
    statsGrid: {
      gridTemplateColumns: "1fr",
    },
    filtersGrid: {
      gridTemplateColumns: "1fr",
    },
    formRow: {
      gridTemplateColumns: "1fr",
    },
    linkRow: {
      flexDirection: "column",
      gap: "8px",
    },
    modal: {
      margin: "10px",
      maxHeight: "calc(100vh - 20px)",
    },
    tableContainer: {
      overflowX: "auto",
    },
    actionButtons: {
      flexDirection: "column",
      gap: "4px",
    },
  },
};

export default AnnouncementPage;