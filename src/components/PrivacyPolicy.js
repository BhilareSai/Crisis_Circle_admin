import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>Privacy Policy</h1>
          <p style={styles.lastUpdated}>Last updated: September 25, 2025</p>
        </header>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Introduction</h2>
          <p style={styles.text}>
            Welcome to CrisisCircle ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our community help platform.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Information We Collect</h2>
          <div style={styles.subsection}>
            <h3 style={styles.subsectionTitle}>Personal Information</h3>
            <ul style={styles.list}>
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials (username, encrypted password)</li>
              <li>Profile information and preferences</li>
              <li>Location data (when you request or offer help)</li>
            </ul>
          </div>
          <div style={styles.subsection}>
            <h3 style={styles.subsectionTitle}>Usage Information</h3>
            <ul style={styles.list}>
              <li>Help requests and offers you create or respond to</li>
              <li>Messages and communications on the platform</li>
              <li>Activity logs and interaction data</li>
              <li>Device information and technical data</li>
            </ul>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>How We Use Your Information</h2>
          <p style={styles.text}>We use your information to:</p>
          <ul style={styles.list}>
            <li>Provide and maintain our community help services</li>
            <li>Connect help seekers with help providers</li>
            <li>Facilitate communication between community members</li>
            <li>Send important notifications and updates</li>
            <li>Improve our platform and user experience</li>
            <li>Ensure safety and prevent misuse of our services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Information Sharing</h2>
          <p style={styles.text}>
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul style={styles.list}>
            <li>With other community members when you post help requests or offers</li>
            <li>With service providers who help us operate our platform</li>
            <li>When required by law or to protect safety</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Data Security</h2>
          <p style={styles.text}>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
          </p>
          <ul style={styles.list}>
            <li>Encryption of sensitive data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication measures</li>
            <li>Secure data storage and backup procedures</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Your Rights</h2>
          <p style={styles.text}>You have the right to:</p>
          <ul style={styles.list}>
            <li>Access and review your personal information</li>
            <li>Correct or update your information</li>
            <li>Delete your account and associated data</li>
            <li>Withdraw consent for data processing</li>
            <li>Request data portability</li>
            <li>Object to certain data processing activities</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Data Retention</h2>
          <p style={styles.text}>
            We retain your personal information only as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will remove your personal information from our active systems, though some information may be retained in backup systems for a limited period.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Cookies and Tracking</h2>
          <p style={styles.text}>
            We use cookies and similar technologies to enhance your experience on our platform. These help us remember your preferences, analyze usage patterns, and improve our services. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Children's Privacy</h2>
          <p style={styles.text}>
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Changes to This Policy</h2>
          <p style={styles.text}>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after such modifications constitutes acceptance of the updated policy.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Contact Us</h2>
          <p style={styles.text}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div style={styles.contactInfo}>
            <p>Email: crisiscircle1@gmail.com</p>
            {/* <p>Address: [Your Business Address]</p>
            <p>Phone: [Your Contact Number]</p> */}
          </div>
        </section>
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
  lastUpdated: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0",
    fontWeight: "500",
  },
  section: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 16px 0",
    lineHeight: "1.3",
  },
  subsection: {
    marginBottom: "24px",
  },
  subsectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#334155",
    margin: "0 0 12px 0",
    lineHeight: "1.4",
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
    lineHeight: "1.6",
    margin: "0 0 16px 0",
    paddingLeft: "20px",
  },
  contactInfo: {
    backgroundColor: "#f8fafc",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    margin: "16px 0 0 0",
  },
};

export default PrivacyPolicy;