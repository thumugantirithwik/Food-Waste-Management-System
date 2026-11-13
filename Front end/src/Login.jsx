import { useState } from "react";

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save logged-in user and token
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setEmail("");
        setPassword("");

        // Go to home page
        if (setPage) {
          setPage("home");
        }
      } else {
        setErrorMessage(data.message || "Invalid email or password");
      }

    } catch (error) {
      console.error(error);
      setErrorMessage("Login failed. Please ensure the backend is running on http://localhost:5001.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>🔐 Login</h2>
      <p>Login to access the Food Waste Management System.</p>

      <div className="card" style={{ maxWidth: "420px", margin: "20px auto", textAlign: "left" }}>
        <div style={{ textAlign: "center", fontSize: "50px", marginBottom: "10px" }}>
          👤
        </div>

        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Welcome Back!</h3>

        {errorMessage && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "14px"
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Email Address:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
            }}
            required
            style={{ marginBottom: "15px", marginTop: "5px" }}
          />

          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
            required
            style={{ marginBottom: "20px", marginTop: "5px" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Logging in..." : "🔐 Login"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => setPage && setPage("register")}
            style={{
              background: "none",
              color: "#2e7d32",
              textDecoration: "underline",
              padding: "0",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
