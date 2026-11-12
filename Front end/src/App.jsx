import { useState } from "react";

import Register from "./Register";
import Login from "./Login";
import DonateFood from "./DonateFood";
import AvailableFood from "./AvailableFood";
import ViewRequests from "./ViewRequests";
import AdminDashboard from "./AdminDashboard";
import Navbar from "./Navbar";
import Profile from "./Profile";

function App() {
  const [page, setPage] = useState("home");

  // Register Page
  if (page === "register") {
    return (
      <>
        <Navbar setPage={setPage} />
        <Register />
      </>
    );
  }

  // Login Page
  if (page === "login") {
    return (
      <>
        <Navbar setPage={setPage} />
        <Login setPage={setPage} />
      </>
    );
  }

  // Donate Food Page
  if (page === "donate") {
    return (
      <>
        <Navbar setPage={setPage} />
        <DonateFood />
      </>
    );
  }

  // Available Food Page
  if (page === "available") {
    return (
      <>
        <Navbar setPage={setPage} />
        <AvailableFood />
      </>
    );
  }

  // Requests Page
  if (page === "requests") {
    return (
      <>
        <Navbar setPage={setPage} />
        <ViewRequests />
      </>
    );
  }

  // Admin Dashboard
  if (page === "admin") {
    return (
      <>
        <Navbar setPage={setPage} />
        <AdminDashboard />
      </>
    );
  }

  // Profile Page
  if (page === "profile") {
    return (
      <>
        <Navbar setPage={setPage} />
        <Profile setPage={setPage} />
      </>
    );
  }

  // Home Page
  return (
    <div>

      {/* Navigation */}
      <Navbar setPage={setPage} />

      {/* Hero Section */}
      <section className="hero">

        <div style={{ fontSize: "70px" }}>
          🍱
        </div>

        <h1>
          Food Waste Management System
        </h1>

        <p>
          Share Food • Reduce Waste • Help People
        </p>

        <p>
          Turn surplus food into a helping hand for
          someone in need.
        </p>

        <div style={{ marginTop: "25px" }}>

          <button
            onClick={() => setPage("donate")}
            style={{
              padding: "14px 28px",
              margin: "8px"
            }}
          >
            🍚 Donate Food
          </button>

          <button
            onClick={() => setPage("available")}
            style={{
              padding: "14px 28px",
              margin: "8px"
            }}
          >
            🔍 Find Food
          </button>

        </div>

      </section>

      {/* How It Works */}
      <section className="section">

        <h2>🌱 How It Works</h2>

        <p>
          A simple way to connect surplus food with
          people who need it.
        </p>

        <div className="dashboard">

          <div className="dashboard-card">

            <div style={{ fontSize: "45px" }}>
              🍚
            </div>

            <h3>Donate</h3>

            <p>
              Donors can share extra food instead of
              letting it go to waste.
            </p>

          </div>

          <div className="dashboard-card">

            <div style={{ fontSize: "45px" }}>
              🔍
            </div>

            <h3>Find Food</h3>

            <p>
              Browse food donations that are currently
              available.
            </p>

          </div>

          <div className="dashboard-card">

            <div style={{ fontSize: "45px" }}>
              🙋
            </div>

            <h3>Request</h3>

            <p>
              People in need can submit a request for
              available food.
            </p>

          </div>

          <div className="dashboard-card">

            <div style={{ fontSize: "45px" }}>
              🤝
            </div>

            <h3>Connect</h3>

            <p>
              Donors and requesters can connect and
              distribute food.
            </p>

          </div>

        </div>

      </section>

      {/* Benefits Section */}
      <section className="section">

        <h2>💚 Why This System?</h2>

        <div className="dashboard">

          <div className="dashboard-card">

            <div style={{ fontSize: "40px" }}>
              ♻️
            </div>

            <h3>Reduce Waste</h3>

            <p>
              Help prevent usable food from being
              unnecessarily wasted.
            </p>

          </div>

          <div className="dashboard-card">

            <div style={{ fontSize: "40px" }}>
              ❤️
            </div>

            <h3>Help People</h3>

            <p>
              Connect surplus food with people who
              need support.
            </p>

          </div>

          <div className="dashboard-card">

            <div style={{ fontSize: "40px" }}>
              🌍
            </div>

            <h3>Build Community</h3>

            <p>
              Encourage responsible food sharing
              within communities.
            </p>

          </div>

        </div>

      </section>

      {/* Call To Action */}
      <section
        className="section"
        style={{
          backgroundColor: "#e8f5e9"
        }}
      >

        <h2>🌱 Be Part of the Solution</h2>

        <p>
          Have extra food? Share it.
          Need food? Request it.
        </p>

        <button
          onClick={() => setPage("register")}
          style={{
            padding: "14px 30px",
            marginTop: "15px"
          }}
        >
          👤 Get Started
        </button>

      </section>

      {/* Footer */}
      <footer className="footer">

        <h3>
          🍱 Food Waste Management System
        </h3>

        <p>
          Share Food • Reduce Waste • Help People
        </p>

        <p>
          🌱 Working towards a community with less
          food waste.
        </p>

        <p>
          © 2026 Food Waste Management System
        </p>

      </footer>

    </div>
  );
}

export default App;
