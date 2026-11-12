import { useEffect, useState } from "react";

function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  const loadData = () => {
    fetch("http://localhost:5000/api/food/available")
      .then((response) => response.json())
      .then((data) => setDonations(data))
      .catch(() => alert("Failed to load donations"));

    fetch("http://localhost:5000/api/requests/all")
      .then((response) => response.json())
      .then((data) => setRequests(data))
      .catch(() => alert("Failed to load requests"));
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
  );

  const acceptedRequests = requests.filter(
    (request) => request.status === "Accepted"
  );

  const rejectedRequests = requests.filter(
    (request) => request.status === "Rejected"
  );

  const statCard = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    width: "190px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
  };

  return (
    <div className="section">

      <h2>📊 Admin Dashboard</h2>

      <p>
        Food Waste Management System Overview
      </p>

      {/* Statistics */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "30px"
        }}
      >

        <div style={statCard}>
          <div style={{ fontSize: "40px" }}>🍱</div>
          <h2>{donations.length}</h2>
          <p>Available Donations</p>
        </div>

        <div style={statCard}>
          <div style={{ fontSize: "40px" }}>📋</div>
          <h2>{requests.length}</h2>
          <p>Total Requests</p>
        </div>

        <div style={statCard}>
          <div style={{ fontSize: "40px" }}>⏳</div>
          <h2>{pendingRequests.length}</h2>
          <p>Pending Requests</p>
        </div>

        <div style={statCard}>
          <div style={{ fontSize: "40px" }}>✅</div>
          <h2>{acceptedRequests.length}</h2>
          <p>Accepted Requests</p>
        </div>

        <div style={statCard}>
          <div style={{ fontSize: "40px" }}>❌</div>
          <h2>{rejectedRequests.length}</h2>
          <p>Rejected Requests</p>
        </div>

      </div>

      <hr style={{ margin: "45px 0" }} />

      {/* Recent Requests */}

      <h2>📋 Recent Requests</h2>

      {requests.length === 0 ? (

        <div className="card">
          <h3>📭 No Requests</h3>
          <p>No food requests available.</p>
        </div>

      ) : (

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap"
          }}
        >

          {requests.slice(0, 6).map((request) => (

            <div
              key={request._id}
              className="card"
              style={{
                width: "350px",
                margin: "10px"
              }}
            >

              <h3>
                🍱 {request.foodId?.foodName || "Food"}
              </h3>

              <p>
                👤 <strong>Requester:</strong>{" "}
                {request.requesterName}
              </p>

              <p>
                📦 <strong>Quantity:</strong>{" "}
                {request.quantityRequested}
              </p>

              <p>
                📍 <strong>Location:</strong>{" "}
                {request.foodId?.location || "Not available"}
              </p>

              <p>
                📌 <strong>Status:</strong>{" "}
                {request.status}
              </p>

            </div>

          ))}

        </div>

      )}

      <button
        onClick={loadData}
        style={{
          padding: "12px 25px",
          marginTop: "25px"
        }}
      >
        🔄 Refresh Dashboard
      </button>

    </div>
  );
}

export default AdminDashboard;