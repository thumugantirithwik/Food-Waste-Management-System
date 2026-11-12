import { useState } from "react";

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
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
        // Save logged-in user
        localStorage.setItem("user", JSON.stringify(data.user));

        alert(`Welcome, ${data.user.name} 👋`);

        setEmail("");
        setPassword("");

        // Go to home page
        setPage("home");
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert("Login failed. Please check your connection.");
    }
  };

  return (
    <div className="section">

      <h2>🔐 Login</h2>

      <p>
        Login to access the Food Waste Management System.
      </p>

      <div className="card">

        <div style={{ fontSize: "50px" }}>
          👤
        </div>

        <h3>Welcome Back!</h3>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <br /><br />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <br /><br />

          <button
            type="submit"
            style={{
              padding: "12px 30px"
            }}
          >
            🔐 Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;