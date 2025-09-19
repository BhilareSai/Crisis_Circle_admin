import React, { useState } from "react";
import AxiosComponent from "../services/axiosComponent.js"; // Adjust path as needed
import logo from "../assets/logo.png";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setFieldErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Mark field as touched
    setTouched({
      ...touched,
      [name]: true,
    });

    // Real-time validation
    if (touched[name]) {
      let fieldError = "";
      if (name === "email") {
        fieldError = validateEmail(value);
      } else if (name === "password") {
        fieldError = validatePassword(value);
      }

      setFieldErrors({
        ...fieldErrors,
        [name]: fieldError,
      });
    }

    // Clear general error when user starts typing
    if (error) setError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Mark field as touched on blur
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate field on blur
    let fieldError = "";
    if (name === "email") {
      fieldError = validateEmail(value);
    } else if (name === "password") {
      fieldError = validatePassword(value);
    }

    setFieldErrors({
      ...fieldErrors,
      [name]: fieldError,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Validate form
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", { email: formData.email });

      // Make API call to login
      const response = await AxiosComponent.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login response:", response);
      console.log("Response data:", response.data);
      console.log("Success status:", response.data.success);

      if (response.data && response.data.success === true) {
        // Store tokens
        const tokens = response.data.data?.tokens;
        if (tokens && tokens.accessToken && tokens.refreshToken) {
          AxiosComponent.setTokens(tokens.accessToken, tokens.refreshToken);
          console.log("Tokens stored successfully");
        } else {
          console.error("Tokens not found in response");
        }

        // Clear form and errors
        setFormData({ email: "", password: "" });
        setFieldErrors({ email: "", password: "" });
        setTouched({ email: false, password: false });

        console.log("Login successful:", response.data.message);

        // Call onLogin callback to notify App.js
        if (onLogin) {
          onLogin();
        }
      } else {
        console.log("Login failed - success is not true:", response.data);
        setError(response.data?.message || "Login failed - invalid response");
      }
    } catch (error) {
      console.error("Login error details:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);

      if (error.response && error.response.status === 200) {
        // If we get a 200 but still hit the catch block, something is wrong
        console.log("Got 200 but still in catch block - this is unusual");
        console.log("Response data:", error.response.data);
      }

      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <img src={logo} alt="CrisisCircle Logo" style={styles.logoImg} />
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
              onBlur={handleBlur}
              placeholder="Enter your email"
              style={{
                ...styles.input,
                ...(fieldErrors.email && touched.email
                  ? styles.inputError
                  : {}),
              }}
              required
              disabled={isLoading}
            />
            {fieldErrors.email && touched.email && (
              <span style={styles.fieldError}>{fieldErrors.email}</span>
            )}
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
              onBlur={handleBlur}
              placeholder="Enter your password"
              style={{
                ...styles.input,
                ...(fieldErrors.password && touched.password
                  ? styles.inputError
                  : {}),
              }}
              required
              disabled={isLoading}
            />
            {fieldErrors.password && touched.password && (
              <span style={styles.fieldError}>{fieldErrors.password}</span>
            )}
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
      "linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 25%, #bae6fd 50%, #7dd3fc 75%, #38bdf8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily:
      '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  loginCard: {
    background: "rgba(255, 255, 255, 0.85)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  logoContainer: {
    marginBottom: "30px",
  },
  logoImg: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    margin: "0 auto 20px",
    display: "block",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  appName: {
    fontSize: "24px",
    fontWeight: "500",
    color: "#475569",
    margin: "0",
    letterSpacing: "0.5px",
  },
  form: {
    textAlign: "left",
  },
  loginTitle: {
    fontSize: "28px",
    fontWeight: "400",
    color: "#334155",
    margin: "0 0 8px 0",
    textAlign: "center",
  },
  loginSubtitle: {
    color: "#94a3b8",
    margin: "0 0 30px 0",
    textAlign: "center",
    fontWeight: "300",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "400",
    color: "#475569",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.8)",
    color: "#334155",
    fontWeight: "300",
  },
  inputError: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
  },
  fieldError: {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "4px",
    display: "block",
    fontWeight: "300",
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #94a3b8, #64748b)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "400",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 2px 12px rgba(148, 163, 184, 0.3)",
    marginTop: "10px",
  },
  loginBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none",
  },
  errorMessage: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
    fontSize: "14px",
    fontWeight: "300",
  },
};

export default Login;
