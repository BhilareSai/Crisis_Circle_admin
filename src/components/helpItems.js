import React, { useState, useEffect } from "react";
import AxiosComponent from "../services/axiosComponent";

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});

  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    category: "",
    active: "",
    sortBy: "name",
    sortOrder: "asc",
  });

  // UI states
  const [showFilters, setShowFilters] = useState(false);

  // Categories for filter dropdown (based on the API response)
  const categories = ["food", "clothing", "medical", "household", "education"];

  // Fetch help items
  const fetchItems = async () => {
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

      const response = await AxiosComponent.get(
        `/api/admin/help-items?${queryParams}`
      );

      if (response.data && response.data.success) {
        setItems(response.data.data.items || []);
        setPagination(response.data.meta?.pagination || {});
      } else {
        setError("Failed to fetch help items");
      }
    } catch (error) {
      console.error("Error fetching help items:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load help items"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch items on component mount and filter changes
  useEffect(() => {
    fetchItems();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  // Handle sorting
  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      search: "",
      category: "",
      active: "",
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get category badge style
  const getCategoryBadge = (category) => {
    const categoryColors = {
      food: { bg: "#dcfce7", color: "#059669" },
      clothing: { bg: "#dbeafe", color: "#2563eb" },
      medical: { bg: "#fecaca", color: "#dc2626" },
      household: { bg: "#fef3c7", color: "#d97706" },
      education: { bg: "#e0e7ff", color: "#4f46e5" },
    };

    const colors = categoryColors[category] || {
      bg: "#f1f5f9",
      color: "#64748b",
    };

    return (
      <span
        style={{
          ...styles.categoryBadge,
          backgroundColor: colors.bg,
          color: colors.color,
        }}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    return (
      <span
        style={{
          ...styles.statusBadge,
          backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
          color: isActive ? "#059669" : "#dc2626",
        }}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Help Items Management</h2>
          <p style={styles.subtitle}>
            Manage available help items and categories
          </p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.filterToggleBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 {showFilters ? "Hide" : "Show"} Filters
          </button>
          <button style={styles.refreshBtn} onClick={fetchItems}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📦</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{pagination.totalItems || 0}</div>
              <div style={styles.statLabel}>Total Items</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>
                {items.filter((item) => item.isActive).length}
              </div>
              <div style={styles.statLabel}>Active Items</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📂</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>
                {new Set(items.map((item) => item.category)).size}
              </div>
              <div style={styles.statLabel}>Categories</div>
            </div>
          </div>
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
                placeholder="Search items..."
                value={filters.search}
                onChange={handleSearch}
                style={styles.filterInput}
              />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Status</label>
              <select
                value={filters.active}
                onChange={(e) => handleFilterChange("active", e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Per Page</label>
              <select
                value={filters.limit}
                onChange={(e) =>
                  handleFilterChange("limit", parseInt(e.target.value))
                }
                style={styles.filterSelect}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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
          <button style={styles.errorClose} onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}

      {/* Items Table */}
      <div style={styles.tableContainer}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading help items...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h4 style={styles.emptyTitle}>No help items found</h4>
            <p style={styles.emptyText}>
              {filters.search || filters.category || filters.active
                ? "Try adjusting your filters to see more results"
                : "No help items have been created yet"}
            </p>
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th
                    style={styles.tableHeader}
                    onClick={() => handleSort("name")}
                  >
                    <div style={styles.headerContent}>
                      Item Name
                      <span style={styles.sortIcon}>
                        {filters.sortBy === "name"
                          ? filters.sortOrder === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </div>
                  </th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => handleSort("category")}
                  >
                    <div style={styles.headerContent}>
                      Category
                      <span style={styles.sortIcon}>
                        {filters.sortBy === "category"
                          ? filters.sortOrder === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </div>
                  </th>
                  <th style={styles.tableHeader}>Unit</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => handleSort("priority")}
                  >
                    <div style={styles.headerContent}>
                      Priority
                      <span style={styles.sortIcon}>
                        {filters.sortBy === "priority"
                          ? filters.sortOrder === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </div>
                  </th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => handleSort("createdAt")}
                  >
                    <div style={styles.headerContent}>
                      Created
                      <span style={styles.sortIcon}>
                        {filters.sortBy === "createdAt"
                          ? filters.sortOrder === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </div>
                  </th>
                  <th style={styles.tableHeader}>Created By</th>
                </tr>
              </thead>
              <tbody style={styles.tableBody}>
                {items.map((item) => (
                  <tr key={item._id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.itemName}>{item.name}</div>
                      {item.tags && item.tags.length > 0 && (
                        <div style={styles.tags}>
                          {item.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} style={styles.tag}>
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span style={styles.tagMore}>
                              +{item.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      {getCategoryBadge(item.category)}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.unit}>
                        {item.defaultQuantityUnit}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      {getStatusBadge(item.isActive)}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.priority}>
                        {item.priority > 0 ? item.priority : "Default"}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.dateCell}>
                        {formatDate(item.createdAt)}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.createdBy}>
                        <div style={styles.creatorName}>
                          {item.createdBy.name}
                        </div>
                        <div style={styles.creatorEmail}>
                          {item.createdBy.email}
                        </div>
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
                  Showing {(pagination.currentPage - 1) * filters.limit + 1} to{" "}
                  {Math.min(
                    pagination.currentPage * filters.limit,
                    pagination.totalItems
                  )}{" "}
                  of {pagination.totalItems} items
                </div>
                <div style={styles.paginationControls}>
                  <button
                    style={{
                      ...styles.paginationBtn,
                      ...(pagination.hasPrev
                        ? {}
                        : styles.paginationBtnDisabled),
                    }}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    ← Previous
                  </button>

                  <div style={styles.pageNumbers}>
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
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
                              ...(pageNum === pagination.currentPage
                                ? styles.pageBtnActive
                                : {}),
                            }}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        ) : null;
                      }
                    )}
                  </div>

                  <button
                    style={{
                      ...styles.paginationBtn,
                      ...(pagination.hasNext
                        ? {}
                        : styles.paginationBtnDisabled),
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
  container: {
    padding: "0",
    fontFamily:
      '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
  filtersSection: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    margin: "0 32px 24px",
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
    cursor: "pointer",
    borderBottom: "1px solid #e2e8f0",
    transition: "background-color 0.3s ease",
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

  // Table cell content
  itemName: {
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "4px",
  },
  tags: {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
  },
  tag: {
    fontSize: "10px",
    padding: "2px 6px",
    background: "#e0f2fe",
    color: "#0891b2",
    borderRadius: "4px",
    fontWeight: "500",
  },
  tagMore: {
    fontSize: "10px",
    color: "#64748b",
    fontStyle: "italic",
  },
  categoryBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  unit: {
    color: "#475569",
    fontWeight: "500",
    fontSize: "13px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
  },
  priority: {
    color: "#64748b",
    fontSize: "13px",
  },
  dateCell: {
    fontSize: "12px",
    color: "#64748b",
  },
  createdBy: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  creatorName: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#475569",
  },
  creatorEmail: {
    fontSize: "11px",
    color: "#94a3b8",
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
    tableContainer: {
      overflowX: "auto",
    },
    paginationContainer: {
      flexDirection: "column",
      gap: "12px",
    },
  },
};

export default ItemsPage;
