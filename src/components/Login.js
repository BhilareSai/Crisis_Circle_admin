import React, { useState, useEffect } from "react";
import AxiosComponent from "../services/axiosComponent.js"; // Adjust path as needed

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    if (AxiosComponent.isAuthenticated()) {
      setIsLoggedIn(true);
      // You might want to fetch user info here if needed
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // Make API call to login
      const response = await AxiosComponent.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Store tokens
        const { accessToken, refreshToken } = response.data.data.tokens;
        AxiosComponent.setTokens(accessToken, refreshToken);

        // Store user info
        setUserInfo(response.data.data.user);
        setIsLoggedIn(true);

        console.log("Login successful:", response.data.message);
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    AxiosComponent.removeToken();
    setIsLoggedIn(false);
    setUserInfo(null);
    setFormData({ email: "", password: "" });
  };

  if (isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.welcomeCard}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>
              <div style={styles.hands}>🤝</div>
              <div style={styles.circle}></div>
            </div>
          </div>

          <h2 style={styles.welcomeTitle}>Welcome to CrisisCircle!</h2>
          {userInfo && (
            <div style={styles.userInfo}>
              <p style={styles.userName}>Hello, {userInfo.name}</p>
              <p style={styles.userRole}>Role: {userInfo.role}</p>
              <p style={styles.userStatus}>Status: {userInfo.status}</p>
            </div>
          )}

          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <div style={styles.hands}>🤝</div>
            <div style={styles.circle}></div>
          </div>
          <h1 style={styles.appName}>CRISISCIRCLE</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.loginTitle}>Welcome Back</h2>
          <p style={styles.loginSubtitle}>Sign in to your account</p>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.loginBtn,
              ...(isLoading ? styles.loginBtnDisabled : {}),
            }}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #6dd5ed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  loginCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  welcomeCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  },
  logoContainer: {
    marginBottom: "30px",
  },
  logo: {
    width: "80px",
    height: "80px",
    background:
      "linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #6dd5ed 100%)",
    borderRadius: "50%",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
  },
  hands: {
    fontSize: "30px",
    color: "white",
  },
  circle: {
    position: "absolute",
    top: "10px",
    width: "12px",
    height: "12px",
    background: "white",
    borderRadius: "50%",
  },
  appName: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "0",
    letterSpacing: "1px",
  },
  form: {
    textAlign: "left",
  },
  loginTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "0 0 8px 0",
    textAlign: "center",
  },
  loginSubtitle: {
    color: "#7f8c8d",
    margin: "0 0 30px 0",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#2c3e50",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    fontSize: "16px",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
    ":focus": {
      borderColor: "#3498db",
      outline: "none",
    },
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #3498db, #2c3e50)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
    marginTop: "10px",
  },
  loginBtnDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    transform: "none",
  },
  logoutBtn: {
    padding: "12px 30px",
    background: "linear-gradient(135deg, #e74c3c, #c0392b)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s ease",
    boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
  },
  errorMessage: {
    background: "#ffebee",
    color: "#c62828",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #ffcdd2",
    fontSize: "14px",
  },
  welcomeTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "0 0 20px 0",
  },
  userInfo: {
    background: "#f8f9fa",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
    textAlign: "left",
  },
  userName: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "0 0 8px 0",
  },
  userRole: {
    fontSize: "14px",
    color: "#7f8c8d",
    margin: "0 0 4px 0",
    textTransform: "capitalize",
  },
  userStatus: {
    fontSize: "14px",
    color: "#27ae60",
    margin: "0",
    textTransform: "capitalize",
  },
};

export default Login;
