function Navbar({ setPage }) {

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");

    alert("Logged out successfully");

    setPage("home");
  };

  return (
    <nav className="navbar">

      <button onClick={() => setPage("home")}>
        🏠 Home
      </button>

      {!user && (
        <button onClick={() => setPage("register")}>
          👤 Register
        </button>
      )}

      {!user && (
        <button onClick={() => setPage("login")}>
          🔐 Login
        </button>
      )}

      <button onClick={() => setPage("donate")}>
        🍚 Donate
      </button>

      <button onClick={() => setPage("available")}>
        🔍 Available Food
      </button>

      <button onClick={() => setPage("requests")}>
        📋 Requests
      </button>

      <button onClick={() => setPage("admin")}>
        📊 Dashboard
      </button>

      {user && (
        <>
          <button onClick={() => setPage("profile")}>
            👤 {user.name}
          </button>

          <button onClick={handleLogout}>
            🚪 Logout
          </button>
        </>
      )}

    </nav>
  );
}

export default Navbar;