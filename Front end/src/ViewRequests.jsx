import { useEffect, useState } from "react";

function ViewRequests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    fetch("http://localhost:5001/api/requests/all")
      .then((response) => response.json())
      .then((data) => setRequests(data))
      .catch(() => alert("Failed to load food requests"));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateRequest = async (id, action) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/requests/${action}/${id}`,
        {
          method: "PUT"
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        loadRequests();
      }

    } catch (error) {
      console.error(error);
      alert("Failed to update request");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Accepted") {
      return {
        color: "#2e7d32",
        backgroundColor: "#e8f5e9"
      };
    }

    if (status === "Rejected") {
      return {
        color: "#c62828",
        backgroundColor: "#ffebee"
      };
    }

    return {
      color: "#ef6c00",
      backgroundColor: "#fff3e0"
    };
  };

  return (
    <div className="section">

      <h2>📋 Food Requests</h2>

      <p>
        Manage requests submitted by people in need.
      </p>

      {requests.length === 0 ? (

        <div className="card">
          <h3>📭 No Requests</h3>
          <p>No food requests have been submitted yet.</p>
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

          {requests.map((request) => (

            <div
              key={request._id}
              className="card"
              style={{
                width: "350px",
                margin: "10px"
              }}
            >

              <div style={{ fontSize: "45px" }}>
                🍱
              </div>

              <h3>
                {request.foodId?.foodName || "Food"}
              </h3>

              <p>
                👤 <strong>Requester:</strong>{" "}
                {request.requesterName}
              </p>

              <p>
                📞 <strong>Phone:</strong>{" "}
                {request.phone}
              </p>

              <p>
                📦 <strong>Quantity:</strong>{" "}
                {request.quantityRequested}
              </p>

              <p>
                📍 <strong>Location:</strong>{" "}
                {request.foodId?.location || "Not available"}
              </p>

              <p
                style={{
                  ...getStatusStyle(request.status),
                  padding: "8px",
                  borderRadius: "6px",
                  fontWeight: "bold"
                }}
              >
                Status: {request.status}
              </p>

              {request.status === "Pending" && (

                <div style={{ marginTop: "15px" }}>

                  <button
                    onClick={() =>
                      updateRequest(request._id, "accept")
                    }
                    style={{
                      padding: "10px 18px",
                      margin: "5px"
                    }}
                  >
                    ✅ Accept
                  </button>

                  <button
                    onClick={() =>
                      updateRequest(request._id, "reject")
                    }
                    style={{
                      padding: "10px 18px",
                      margin: "5px",
                      backgroundColor: "#c62828"
                    }}
                  >
                    ❌ Reject
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default ViewRequests;