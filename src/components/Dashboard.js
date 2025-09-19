import React, { useState, useEffect } from "react";
import AxiosComponent from "../services/axiosComponent";
import UsersTable from "./AdminUSerTable.js"; // Import the new UsersTable component
import logo from "../assets/logo.png";
import AnnouncementPage from "./announcementPage.js";
const Dashboard = ({ onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // Add state for active tab

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await AxiosComponent.get("/api/admin/dashboard");

      if (response.data && response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const formatNumber = (num) => {
    return num?.toLocaleString() || "0";
  };

  const formatPercentage = (num) => {
    return num ? `${num.toFixed(1)}%` : "0.0%";
  };

  const getStatusColor = (type, value) => {
    if (type === "approval" && value > 70) return "#10b981";
    if (type === "approval" && value > 50) return "#f59e0b";
    if (type === "completion" && value > 80) return "#10b981";
    if (type === "completion" && value > 60) return "#f59e0b";
    return "#ef4444";
  };

  const ProgressBar = ({ value, max, color = "#10b981" }) => (
    <div style={styles.progressContainer}>
      <div
        style={{
          ...styles.progressBar,
          width: `${Math.min((value / max) * 100, 100)}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersTable />;

      case "announcements":
        return <AnnouncementPage />;
      case "dashboard":
      default:
        return renderDashboardContent();
    }
  };

  // Render main dashboard content
  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading dashboard data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Failed to Load Data</h3>
          <p style={styles.errorText}>{error}</p>
          <button style={styles.retryBtn} onClick={fetchDashboardData}>
            <span style={styles.retryIcon}>🔄</span>
            Try Again
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Stats Cards Section */}
        <section style={styles.statsSection}>
          <div style={styles.statsGrid}>
            {/* Users Card */}
            <div style={styles.statCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <span style={styles.iconEmoji}>👥</span>
                </div>
                <div style={styles.cardTitleSection}>
                  <h3 style={styles.cardTitle}>Total Users</h3>
                  <p style={styles.cardSubtitle}>User Management</p>
                </div>
                <div style={styles.cardMenu}>⋮</div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.primaryStat}>
                  {formatNumber(dashboardData?.users?.total)}
                </div>
                <div style={styles.statChange}>
                  <span style={styles.changeIndicator}>↗</span>
                  <span style={styles.changeText}>
                    +{dashboardData?.users?.recent || 0} this week
                  </span>
                </div>
                <div style={styles.statsBreakdown}>
                  <div style={styles.breakdownItem}>
                    <span style={styles.breakdownLabel}>Pending</span>
                    <span style={styles.breakdownValue}>
                      {formatNumber(dashboardData?.users?.pending)}
                    </span>
                  </div>
                  <div style={styles.breakdownItem}>
                    <span style={styles.breakdownLabel}>Approved</span>
                    <span style={styles.breakdownValue}>
                      {formatNumber(dashboardData?.users?.approved)}
                    </span>
                  </div>
                </div>
                <div style={styles.progressSection}>
                  <div style={styles.progressLabel}>
                    <span>Approval Rate</span>
                    <span style={styles.progressPercentage}>
                      {formatPercentage(dashboardData?.users?.approvalRate)}
                    </span>
                  </div>
                  <ProgressBar
                    value={dashboardData?.users?.approvalRate || 0}
                    max={100}
                    color={getStatusColor(
                      "approval",
                      dashboardData?.users?.approvalRate
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Help Requests Card */}
            <div style={styles.statCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <span style={styles.iconEmoji}>🆘</span>
                </div>
                <div style={styles.cardTitleSection}>
                  <h3 style={styles.cardTitle}>Help Requests</h3>
                  <p style={styles.cardSubtitle}>Support Management</p>
                </div>
                <div style={styles.cardMenu}>⋮</div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.primaryStat}>
                  {formatNumber(dashboardData?.helpRequests?.total)}
                </div>
                <div style={styles.statChange}>
                  <span style={styles.changeIndicator}>→</span>
                  <span style={styles.changeText}>
                    {dashboardData?.helpRequests?.recent || 0} recent
                  </span>
                </div>
                <div style={styles.statsBreakdown}>
                  <div style={styles.breakdownItem}>
                    <span style={styles.breakdownLabel}>Open</span>
                    <span style={styles.breakdownValue}>
                      {formatNumber(dashboardData?.helpRequests?.open)}
                    </span>
                  </div>
                  <div style={styles.breakdownItem}>
                    <span style={styles.breakdownLabel}>Completed</span>
                    <span style={styles.breakdownValue}>
                      {formatNumber(dashboardData?.helpRequests?.completed)}
                    </span>
                  </div>
                </div>
                <div style={styles.progressSection}>
                  <div style={styles.progressLabel}>
                    <span>Completion Rate</span>
                    <span style={styles.progressPercentage}>
                      {formatPercentage(
                        dashboardData?.helpRequests?.completionRate
                      )}
                    </span>
                  </div>
                  <ProgressBar
                    value={dashboardData?.helpRequests?.completionRate || 0}
                    max={100}
                    color={getStatusColor(
                      "completion",
                      dashboardData?.helpRequests?.completionRate
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Help Items Card */}
            <div style={styles.statCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <span style={styles.iconEmoji}>📦</span>
                </div>
                <div style={styles.cardTitleSection}>
                  <h3 style={styles.cardTitle}>Help Items</h3>
                  <p style={styles.cardSubtitle}>Inventory Management</p>
                </div>
                <div style={styles.cardMenu}>⋮</div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.primaryStat}>
                  {formatNumber(dashboardData?.helpItems?.total)}
                </div>
                <div style={styles.statChange}>
                  <span style={styles.changeIndicator}>✓</span>
                  <span style={styles.changeText}>
                    {dashboardData?.helpItems?.active || 0} active items
                  </span>
                </div>
                <div style={styles.categoryList}>
                  {dashboardData?.helpItems?.statistics
                    ?.slice(0, 3)
                    .map((category, index) => (
                      <div key={index} style={styles.categoryItem}>
                        <div style={styles.categoryDot}></div>
                        <span style={styles.categoryName}>{category._id}</span>
                        <span style={styles.categoryCount}>
                          {category.totalItems}
                        </span>
                      </div>
                    ))}
                  {dashboardData?.helpItems?.statistics?.length > 3 && (
                    <div style={styles.categoryMore}>
                      +{dashboardData.helpItems.statistics.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Announcements Card */}
            <div style={styles.statCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <span style={styles.iconEmoji}>📢</span>
                </div>
                <div style={styles.cardTitleSection}>
                  <h3 style={styles.cardTitle}>Announcements</h3>
                  <p style={styles.cardSubtitle}>Communication</p>
                </div>
                <div style={styles.cardMenu}>⋮</div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.primaryStat}>
                  {formatNumber(dashboardData?.announcements?.total)}
                </div>
                <div style={styles.statChange}>
                  <span style={styles.changeIndicator}>📊</span>
                  <span style={styles.changeText}>
                    {dashboardData?.announcements?.active || 0} active
                  </span>
                </div>
                <div style={styles.announcementTypes}>
                  {dashboardData?.announcements?.statistics?.[0]?.breakdown?.map(
                    (type, index) => (
                      <div key={index} style={styles.typeTag}>
                        <span
                          style={{
                            ...styles.typeIndicator,
                            backgroundColor:
                              type.type === "success"
                                ? "#10b981"
                                : type.type === "warning"
                                ? "#f59e0b"
                                : "#3b82f6",
                          }}
                        ></span>
                        {type.category}
                      </div>
                    )
                  )}
                </div>
                <div style={styles.viewsSection}>
                  <span style={styles.viewsLabel}>Total Views</span>
                  <span style={styles.viewsCount}>
                    {formatNumber(
                      dashboardData?.announcements?.statistics?.[0]
                        ?.totalViews || 0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section style={styles.quickActionsSection}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={styles.quickActions}>
            <button
              style={styles.actionBtn}
              onClick={() => handleTabChange("users")}
            >
              <span style={styles.actionIcon}>👥</span>
              Manage Users
            </button>
            <button style={styles.actionBtn}
           
            >
              <span style={styles.actionIcon}>📝</span>
              New Announcement
            </button>
            <button style={styles.actionBtn}>
              <span style={styles.actionIcon}>📊</span>
              View Reports
            </button>
            <button style={styles.actionBtn}>
              <span style={styles.actionIcon}>⚙️</span>
              Settings
            </button>
            <button style={styles.actionBtn}>
              <span style={styles.actionIcon}>📋</span>
              Export Data
            </button>
            <button style={styles.actionBtn}>
              <span style={styles.actionIcon}>🔔</span>
              Notifications
            </button>
          </div>
        </section>
      </>
    );
  };

  return (
    <div style={styles.container}>
      {/* Top Navigation */}
      <nav style={styles.topNav}>
        <div style={styles.navLeft}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="CrisisCircle Logo" style={styles.navLogo} />
            <div style={styles.brandInfo}>
              <h1 style={styles.appTitle}>CRISISCIRCLE</h1>
              <span style={styles.adminLabel}>Admin Dashboard</span>
            </div>
          </div>
        </div>

        <div style={styles.navCenter}>
          <div style={styles.navTabs}>
            <button
              style={{
                ...styles.navTab,
                ...(activeTab === "dashboard" ? styles.navTabActive : {}),
              }}
              onClick={() => handleTabChange("dashboard")}
            >
              <span style={styles.tabIcon}>📊</span>
              Dashboard
            </button>
            <button
              style={{
                ...styles.navTab,
                ...(activeTab === "users" ? styles.navTabActive : {}),
              }}
              onClick={() => handleTabChange("users")}
            >
              <span style={styles.tabIcon}>👥</span>
              Users
            </button>
            <button style={styles.navTab}>
              <span style={styles.tabIcon}>🆘</span>
              Help Requests
            </button>
            <button style={styles.navTab}>
              <span style={styles.tabIcon}>📦</span>
              Help Items
            </button>
            <button style={styles.navTab}
            onClick={() => handleTabChange("announcements")}
            >
              <span style={styles.tabIcon}>📢</span>
              Announcements
            </button>
          </div>
        </div>

        <div style={styles.navRight}>
          <button style={styles.refreshBtn} onClick={fetchDashboardData}>
            <span style={styles.refreshIcon}>🔄</span>
            Refresh
          </button>
          <div style={styles.adminProfile}>
            <div style={styles.profilePic}>👤</div>
            <span style={styles.adminName}>Admin</span>
          </div>
          <button style={styles.logoutButton} onClick={handleLogout}>
            <span style={styles.logoutIcon}>🚪</span>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Page Header */}
        <header style={styles.pageHeader}>
          <div style={styles.headerContent}>
            <h2 style={styles.pageTitle}>
              {activeTab === "dashboard"
                ? "Dashboard Overview"
                : "User Management"}
            </h2>
            <p style={styles.pageSubtitle}>
              {activeTab === "dashboard"
                ? "Monitor your platform's performance and key metrics"
                : "Manage user accounts, approvals, and permissions"}
            </p>
          </div>
          <div style={styles.headerActions}>
            <div style={styles.lastUpdated}>
              Last updated:{" "}
              {dashboardData?.lastUpdated
                ? new Date(dashboardData.lastUpdated).toLocaleString()
                : "Loading..."}
            </div>
          </div>
        </header>

        {/* Dynamic Content Based on Active Tab */}
        <div style={styles.dashboardContent}>{renderTabContent()}</div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily:
      '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // Top Navigation
  topNav: {
    background: "white",
    borderBottom: "1px solid #e2e8f0",
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navLogo: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    objectFit: "cover",
  },
  brandInfo: {
    display: "flex",
    flexDirection: "column",
  },
  appTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0",
    letterSpacing: "0.5px",
  },
  adminLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  navCenter: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    maxWidth: "800px",
    margin: "0 32px",
  },
  navTabs: {
    display: "flex",
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "4px",
    gap: "4px",
  },
  navTab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#64748b",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  },
  navTabActive: {
    background: "white",
    color: "#1e293b",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
  tabIcon: {
    fontSize: "16px",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  refreshBtn: {
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    transition: "all 0.3s ease",
  },
  refreshIcon: {
    fontSize: "16px",
  },
  adminProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 16px",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  profilePic: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #38bdf8, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "white",
  },
  adminName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  logoutButton: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    border: "none",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
  },
  logoutIcon: {
    fontSize: "16px",
  },

  // Main Content
  mainContent: {
    padding: "0",
    minHeight: "calc(100vh - 81px)",
  },
  pageHeader: {
    background: "white",
    padding: "32px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  pageSubtitle: {
    color: "#64748b",
    fontSize: "16px",
    margin: "0",
    fontWeight: "400",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  lastUpdated: {
    fontSize: "14px",
    color: "#64748b",
    background: "#f8fafc",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },

  // Dashboard Content
  dashboardContent: {
    padding: "32px",
  },
  statsSection: {
    marginBottom: "32px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  statCard: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "20px",
    gap: "16px",
  },
  cardIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  iconEmoji: {
    fontSize: "24px",
  },
  cardTitleSection: {
    flex: 1,
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  cardSubtitle: {
    fontSize: "12px",
    color: "#64748b",
    margin: "0",
    fontWeight: "400",
  },
  cardMenu: {
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  primaryStat: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#1e293b",
    lineHeight: "1",
  },
  statChange: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  changeIndicator: {
    fontSize: "16px",
    color: "#10b981",
  },
  changeText: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  },
  statsBreakdown: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
  },
  breakdownItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  breakdownLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
  },
  breakdownValue: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
  },
  progressSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
  },
  progressPercentage: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  progressContainer: {
    width: "100%",
    height: "6px",
    background: "#f1f5f9",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.3s ease",
  },
  categoryList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  categoryItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 0",
  },
  categoryDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#38bdf8",
  },
  categoryName: {
    flex: 1,
    fontSize: "14px",
    color: "#475569",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  categoryCount: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
    background: "#f1f5f9",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  categoryMore: {
    fontSize: "12px",
    color: "#64748b",
    fontStyle: "italic",
    padding: "4px 0",
  },
  announcementTypes: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  typeTag: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 8px",
    background: "#f8fafc",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    color: "#475569",
    textTransform: "capitalize",
  },
  typeIndicator: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },
  viewsSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "#f8fafc",
    borderRadius: "8px",
  },
  viewsLabel: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  },
  viewsCount: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
  },

  // Quick Actions
  quickActionsSection: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 16px 0",
  },
  quickActions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    justifyContent: "center",
  },
  actionIcon: {
    fontSize: "18px",
  },

  // Loading and Error States
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f1f5f9",
    borderTop: "4px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  loadingText: {
    color: "#64748b",
    fontSize: "16px",
    fontWeight: "500",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px",
    textAlign: "center",
  },
  errorIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  errorTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#ef4444",
    margin: "0 0 8px 0",
  },
  errorText: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0 0 24px 0",
    maxWidth: "400px",
  },
  retryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    background: "linear-gradient(135deg, #38bdf8, #3b82f6)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  retryIcon: {
    fontSize: "16px",
  },

  // Responsive Design
  "@media (max-width: 1024px)": {
    navCenter: {
      display: "none",
    },
    statsGrid: {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    },
  },

  "@media (max-width: 768px)": {
    topNav: {
      padding: "12px 20px",
      flexWrap: "wrap",
    },
    navRight: {
      order: 3,
      width: "100%",
      justifyContent: "center",
      marginTop: "12px",
    },
    pageHeader: {
      padding: "20px",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "16px",
    },
    dashboardContent: {
      padding: "20px",
    },
    statsGrid: {
      gridTemplateColumns: "1fr",
    },
    quickActions: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
};

export default Dashboard;
