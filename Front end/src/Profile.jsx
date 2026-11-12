function Profile({ setPage }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div className="section">
        <div className="card">
          <h2>🔐 Please Login</h2>

          <button
            onClick={() => setPage("login")}
            style={{
              padding: "12px 25px"
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">

      <h2>👤 My Profile</h2>

      <div className="card">

        <div style={{ fontSize: "70px" }}>
          👤
        </div>

        <h2>
          Welcome, {user.name} 👋
        </h2>

        <hr />

        <p>
          <strong>👤 Name:</strong> {user.name}
        </p>

        <p>
          <strong>📧 Email:</strong> {user.email}
        </p>

        <p>
          <strong>📞 Phone:</strong> {user.phone}
        </p>

        <button
          onClick={() => setPage("home")}
          style={{
            padding: "12px 25px",
            marginTop: "15px"
          }}
        >
          🏠 Back Home
        </button>

      </div>

    </div>
  );
}

export default Profile;