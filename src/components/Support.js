import React from "react";

const Support = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>Support</h1>
          <p style={styles.subtitle}>
            We're here to help! Get in touch with our team.
          </p>
        </header>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Contact Information</h2>
          <div style={styles.contactCard}>
            <div style={styles.contactItem}>
              <div style={styles.iconWrapper}>
                <svg
                  style={styles.icon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 style={styles.contactLabel}>Email</h3>
                <a
                  href="mailto:crisiscircle1@gmail.com"
                  style={styles.contactValue}
                >
                  crisiscircle1@gmail.com
                </a>
              </div>
            </div>

            <div style={styles.contactItem}>
              <div style={styles.iconWrapper}>
                <svg
                  style={styles.icon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <h3 style={styles.contactLabel}>Phone</h3>
                <a href="tel:+1234567890" style={styles.contactValue}>
                  ‪+1 (732) 841‑7720‬
                </a>
                <p style={styles.contactNote}>
                  Monday - Friday, 9 AM - 5 PM EST
                </p>
              </div>
            </div>

            <div style={styles.contactItem}>
              <div style={styles.iconWrapper}>
                <svg
                  style={styles.icon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
           
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>How Can We Help?</h2>
          <p style={styles.text}>
            Our support team is available to assist you with:
          </p>
          <ul style={styles.list}>
            <li>
              <strong>App Issues:</strong> Technical problems, bugs, or errors
              you encounter
            </li>
            <li>
              <strong>General Feedback:</strong> Share your thoughts about your
              experience
            </li>
            <li>
              <strong>Feature Requests:</strong> Suggest improvements or new
              features
            </li>
            <li>
              <strong>Account Help:</strong> Questions about your account or
              settings
            </li>
            <li>
              <strong>Safety Concerns:</strong> Report inappropriate behavior or
              content
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Response Time</h2>
          <p style={styles.text}>
            We strive to respond to all inquiries within 24-48 hours during
            business days. For urgent safety concerns, please indicate "URGENT"
            in your subject line.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Additional Resources</h2>
          <div style={styles.resourceGrid}>
            <a href="/privacy" style={styles.resourceCard}>
              <h3 style={styles.resourceTitle}>Privacy Policy</h3>
              <p style={styles.resourceText}>Learn how we protect your data</p>
            </a>
            <div style={styles.resourceCard}>
              <h3 style={styles.resourceTitle}>Community Guidelines</h3>
              <p style={styles.resourceText}>Review our community standards</p>
            </div>
          </div>
        </section>

        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Thank you for being part of the CrisisCircle community. We're
            committed to providing you with the best possible support
            experience.
          </p>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "32px",
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  content: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "48px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e2e8f0",
  },
  header: {
    textAlign: "center",
    marginBottom: "48px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "24px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 12px 0",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "18px",
    color: "#64748b",
    margin: "0",
    fontWeight: "500",
  },
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 24px 0",
    lineHeight: "1.3",
  },
  text: {
    fontSize: "16px",
    color: "#475569",
    lineHeight: "1.6",
    margin: "0 0 16px 0",
  },
  list: {
    fontSize: "16px",
    color: "#475569",
    lineHeight: "1.8",
    margin: "0 0 16px 0",
    paddingLeft: "20px",
  },
  contactCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "32px",
  },
  contactItem: {
    display: "flex",
    gap: "20px",
    marginBottom: "32px",
    alignItems: "flex-start",
  },
  iconWrapper: {
    backgroundColor: "#38bdf8",
    borderRadius: "12px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "48px",
    height: "48px",
  },
  icon: {
    width: "24px",
    height: "24px",
    color: "white",
  },
  contactLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b",
    margin: "0 0 8px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  contactValue: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0",
    textDecoration: "none",
    display: "block",
    lineHeight: "1.5",
  },
  contactNote: {
    fontSize: "14px",
    color: "#64748b",
    margin: "4px 0 0 0",
  },
  resourceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  resourceCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    textDecoration: "none",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  resourceTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  resourceText: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0",
  },
  footer: {
    marginTop: "48px",
    paddingTop: "24px",
    borderTop: "1px solid #e2e8f0",
    textAlign: "center",
  },
  footerText: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
    margin: "0",
  },
};

export default Support;
