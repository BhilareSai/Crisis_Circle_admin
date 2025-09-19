import React, { useState, useEffect } from "react";
import AxiosComponent from "../services/axiosComponent";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});
  
  // Filter and sort states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    role: "",
    isEmailVerified: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  // UI states
  const [actionLoading, setActionLoading] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await AxiosComponent.get(`/api/admin/users/all?${queryParams}`);

      if (response.data && response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.meta.pagination);
        setStats(response.data.data.stats);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount and filter changes
  useEffect(() => {
    fetchUsers();
  }, [filters]);

  // Handle search
  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1
    }));
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  // Handle sorting
  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
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

  // Handle user approval
  const handleApproveUser = async (userId) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: "approving" }));

      const response = await AxiosComponent.put(`/api/admin/users/${userId}/approve`, {
        reason: "Account approved by admin",
        userId
      });

      if (response.data && response.data.success) {
        // Update user in local state
        setUsers(prev => prev.map(user => 
          user._id === userId 
            ? { ...user, status: "approved" }
            : user
        ));
        // Refresh to get updated stats
        fetchUsers();
      }
    } catch (error) {
      console.error("Error approving user:", error);
      setError(error.response?.data?.message || "Failed to approve user");
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  // Handle user rejection
  const handleRejectUser = async (userId) => {
    const reason = prompt("Please enter a reason for rejection:");
    if (!reason) return;

    try {
      setActionLoading(prev => ({ ...prev, [userId]: "rejecting" }));

      const response = await AxiosComponent.put(`/api/admin/users/${userId}/reject`, {
        reason: reason
    ,
        userId
      });

      if (response.data && response.data.success) {
        // Update user in local state
        setUsers(prev => prev.map(user => 
          user._id === userId 
            ? { ...user, status: "rejected" }
            : user
        ));
        // Refresh to get updated stats
        fetchUsers();
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      setError(error.response?.data?.message || "Failed to reject user");
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const statusStyles = {
      approved: { background: "#dcfce7", color: "#059669", border: "#bbf7d0" },
      pending: { background: "#fef3c7", color: "#d97706", border: "#fde68a" },
      rejected: { background: "#fecaca", color: "#dc2626", border: "#fca5a5" }
    };

    return (
      <span style={{
        ...styles.statusBadge,
        backgroundColor: statusStyles[status]?.background || "#f1f5f9",
        color: statusStyles[status]?.color || "#64748b",
        borderColor: statusStyles[status]?.border || "#e2e8f0"
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      status: "",
      role: "",
      isEmailVerified: "",
      sortBy: "createdAt",
      sortOrder: "desc"
    });
  };

  return (
    <div style={styles.tableContainer}>
      {/* Table Header */}
      <div style={styles.tableHeader}>
        <div style={styles.headerLeft}>
          <h3 style={styles.tableTitle}>Users Management</h3>
          <div style={styles.statsSummary}>
            <span style={styles.statItem}>
              Total: <strong>{stats.total || 0}</strong>
            </span>
            <span style={styles.statItem}>
              Pending: <strong>{stats.byStatus?.find(s => s._id === "pending")?.count || 0}</strong>
            </span>
            <span style={styles.statItem}>
              Approved: <strong>{stats.byStatus?.find(s => s._id === "approved")?.count || 0}</strong>
            </span>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.filterToggleBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 {showFilters ? "Hide" : "Show"} Filters
          </button>
          <button style={styles.refreshBtn} onClick={fetchUsers}>
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
                placeholder="Search by name, email, phone..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Role</label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Email Verified</label>
              <select
                value={filters.isEmailVerified}
                onChange={(e) => handleFilterChange("isEmailVerified", e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Per Page</label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
                style={styles.filterSelect}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div style={styles.filterActions}>
              <button style={styles.clearFiltersBtn} onClick={clearFilters}>
                Clear All
              </button>
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

      {/* Table Content */}
      <div style={styles.tableWrapper}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <h4 style={styles.emptyTitle}>No users found</h4>
            <p style={styles.emptyText}>
              {filters.search || filters.status || filters.role 
                ? "Try adjusting your filters to see more results"
                : "No users have been registered yet"
              }
            </p>
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={styles.tableHeader} onClick={() => handleSort("name")}>
                    <div style={styles.headerContent}>
                      Name
                      <span style={styles.sortIcon}>
                        {filters.sortBy === "name" ? (filters.sortOrder === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </div>
                  </th>
                  <th style={styles.tableHeader}>Contact</th>
                  <th style={styles.tableHeader} onClick={() => handleSort("zipCode")}>
                    <div style={styles.headerContent}>
                      Location
                      <span style={styles.sortIcon}>
                        {filters.sortBy === "zipCode" ? (filters.sortOrder === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </div>
                  </th>
                  <th style={styles.tableHeader} onClick={() => handleSort("role")}>
                    <div style={styles.headerContent}>
                      Role
                      <span style={styles.sortIcon}>
                        {filters.sortBy === "role" ? (filters.sortOrder === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </div>
                  </th>
                  <th style={styles.tableHeader} onClick={() => handleSort("status")}>
                    <div style={styles.headerContent}>
                      Status
                      <span style={styles.sortIcon}>
                        {filters.sortBy === "status" ? (filters.sortOrder === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </div>
                  </th>
                  <th style={styles.tableHeader} onClick={() => handleSort("createdAt")}>
                    <div style={styles.headerContent}>
                      Joined
                      <span style={styles.sortIcon}>
                        {filters.sortBy === "createdAt" ? (filters.sortOrder === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </div>
                  </th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody style={styles.tableBody}>
                {users.map((user) => (
                  <tr key={user._id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.userInfo}>
                        <div style={styles.userAvatar}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.userDetails}>
                          <div style={styles.userName}>{user.name}</div>
                          <div style={styles.userEmail}>
                            {user.email}
                            {user.isEmailVerified && (
                              <span style={styles.verifiedBadge}>✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.contactInfo}>
                        <div style={styles.phone}>{user.phone}</div>
                        {user.lastLoginAt && (
                          <div style={styles.lastLogin}>
                            Last login: {formatDate(user.lastLoginAt)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.locationInfo}>
                        <div style={styles.zipCode}>{user.zipCode}</div>
                        <div style={styles.address}>{user.address}</div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.roleBadge}>
                        {user.role === "admin" ? "👑" : "👤"} {user.role}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      {getStatusBadge(user.status)}
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.dateInfo}>
                        <div style={styles.joinDate}>{formatDate(user.createdAt)}</div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionButtons}>
                        {user.status === "pending" && (
                          <>
                            <button
                              style={{
                                ...styles.actionBtn,
                                ...styles.approveBtn,
                                ...(actionLoading[user._id] === "approving" ? styles.actionBtnLoading : {})
                              }}
                              onClick={() => handleApproveUser(user._id)}
                              disabled={actionLoading[user._id]}
                            >
                              {actionLoading[user._id] === "approving" ? "..." : "✓"}
                            </button>
                            <button
                              style={{
                                ...styles.actionBtn,
                                ...styles.rejectBtn,
                                ...(actionLoading[user._id] === "rejecting" ? styles.actionBtnLoading : {})
                              }}
                              onClick={() => handleRejectUser(user._id)}
                              disabled={actionLoading[user._id]}
                            >
                              {actionLoading[user._id] === "rejecting" ? "..." : "✗"}
                            </button>
                          </>
                        )}
                        <button style={{ ...styles.actionBtn, ...styles.viewBtn }}>
                          👁️
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
                  {pagination.totalItems} users
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
    </div>
  );
};

const styles = {
  tableContainer: {
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
  },
  
  // Header styles
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderBottom: "1px solid #e2e8f0",
  },
  headerLeft: {
    flex: 1,
  },
  tableTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  statsSummary: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  statItem: {
    fontSize: "14px",
    color: "#64748b",
  },
  headerActions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
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
    background: "linear-gradient(135deg, #38bdf8, #3b82f6)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "white",
    transition: "all 0.3s ease",
  },

  // Filters styles
  filtersSection: {
    padding: "20px 24px",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    alignItems: "end",
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
  filterActions: {
    display: "flex",
    alignItems: "end",
  },
  clearFiltersBtn: {
    padding: "8px 16px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },

  // Error message
  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 24px",
    background: "#fef2f2",
    color: "#dc2626",
    borderBottom: "1px solid #fecaca",
    fontSize: "14px",
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

  // Table wrapper
  tableWrapper: {
    overflowX: "auto",
  },

  // Table styles
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
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    borderBottom: "1px solid #e2e8f0",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  sortIcon: {
    fontSize: "12px",
    color: "#94a3b8",
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

  // User info styles
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #38bdf8, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: "16px",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  userName: {
    fontWeight: "500",
    color: "#1e293b",
  },
  userEmail: {
    fontSize: "12px",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  verifiedBadge: {
    color: "#059669",
    fontSize: "12px",
  },

  // Contact info
  contactInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  phone: {
    color: "#475569",
    fontWeight: "500",
  },
  lastLogin: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  // Location info
  locationInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  zipCode: {
    fontWeight: "500",
    color: "#475569",
  },
  address: {
    fontSize: "12px",
    color: "#64748b",
    maxWidth: "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  // Role badge
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    background: "#f1f5f9",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    color: "#475569",
    textTransform: "capitalize",
  },

  // Status badge
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    border: "1px solid",
    textTransform: "capitalize",
  },

  // Date info
  dateInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  joinDate: {
    color: "#475569",
    fontSize: "12px",
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
  approveBtn: {
    color: "#059669",
    borderColor: "#bbf7d0",
  },
  rejectBtn: {
    color: "#dc2626",
    borderColor: "#fca5a5",
  },
  viewBtn: {
    color: "#3b82f6",
    borderColor: "#bfdbfe",
  },
  actionBtnLoading: {
    opacity: 0.6,
    cursor: "not-allowed",
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

  // Pagination styles
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
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
};

export default UsersTable;