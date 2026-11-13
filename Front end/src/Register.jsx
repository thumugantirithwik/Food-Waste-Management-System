import { useState } from "react";

function Register({ setPage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "donor",
    organizationName: "",
    organizationRegNo: "",
    city: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Account created successfully! Redirecting...");
        
        // Auto-save user to localStorage so they are logged in
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setTimeout(() => {
          if (setPage) {
            setPage("home");
          }
        }, 1200);
      } else {
        setErrorMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Cannot connect to server. Please ensure the backend server is running on http://localhost:5001.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>👤 Create Account</h2>
      <p>Register to donate surplus food or request food for your organization.</p>

      <div className="card" style={{ maxWidth: "450px", margin: "20px auto", textAlign: "left" }}>
        <div style={{ textAlign: "center", fontSize: "50px", marginBottom: "10px" }}>
          📝
        </div>
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Join Our Community</h3>

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

        {successMessage && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "14px",
              textAlign: "center"
            }}
          >
            ✅ {successMessage}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <label style={{ fontWeight: "bold", fontSize: "14px" }}>I want to register as:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ marginBottom: "15px", marginTop: "5px" }}
          >
            <option value="donor">🍲 Food Donor (Restaurant, Caterer, Household)</option>
            <option value="ngo">🏢 NGO / Charitable Organization / Shelter</option>
            <option value="volunteer">🚚 Food Collection Volunteer</option>
          </select>

          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Full Name:</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Ramesh Kumar"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ marginBottom: "15px", marginTop: "5px" }}
          />

          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Email Address:</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. ramesh@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ marginBottom: "15px", marginTop: "5px" }}
          />

          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Create Password:</label>
          <input
            type="password"
            name="password"
            placeholder="At least 4 characters"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ marginBottom: "15px", marginTop: "5px" }}
          />

          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ marginBottom: "15px", marginTop: "5px" }}
          />

          {formData.role === "ngo" && (
            <>
              <label style={{ fontWeight: "bold", fontSize: "14px" }}>Organization Name:</label>
              <input
                type="text"
                name="organizationName"
                placeholder="e.g. Helping Hands Foundation"
                value={formData.organizationName}
                onChange={handleChange}
                style={{ marginBottom: "15px", marginTop: "5px" }}
              />

              <label style={{ fontWeight: "bold", fontSize: "14px" }}>Organization Reg. Number:</label>
              <input
                type="text"
                name="organizationRegNo"
                placeholder="e.g. NGO-MH-2024-001"
                value={formData.organizationRegNo}
                onChange={handleChange}
                style={{ marginBottom: "15px", marginTop: "5px" }}
              />
            </>
          )}

          <label style={{ fontWeight: "bold", fontSize: "14px" }}>City / Location (Optional):</label>
          <input
            type="text"
            name="city"
            placeholder="e.g. Bangalore, Mumbai, Chennai"
            value={formData.city}
            onChange={handleChange}
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
            {loading ? "Creating Account..." : "📝 Register Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setPage && setPage("login")}
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
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
