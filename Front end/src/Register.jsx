import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: ""
        });
      }

    } catch (error) {
      alert("Registration failed. Please check your connection.");
    }
  };

  return (
    <div className="section">

      <h2>👤 Create Account</h2>

      <p>
        Register to donate or request food.
      </p>

      <div className="card">

        <div style={{ fontSize: "50px" }}>
          📝
        </div>

        <h3>Join Our Community</h3>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <br /><br />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <br /><br />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <br /><br />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <br /><br />

          <button
            type="submit"
            style={{
              padding: "12px 30px"
            }}
          >
            📝 Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;