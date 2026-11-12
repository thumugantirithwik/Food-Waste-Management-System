import { useEffect, useState } from "react";
import RequestFood from "./RequestFood";

function AvailableFood() {
  const [donations, setDonations] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/food/available")
      .then((response) => response.json())
      .then((data) => setDonations(data))
      .catch(() => alert("Failed to load food donations"));
  }, []);

  if (selectedFood) {
    return (
      <div className="section">
        <RequestFood food={selectedFood} />

        <button
          onClick={() => setSelectedFood(null)}
          style={{
            padding: "12px 25px",
            marginTop: "10px"
          }}
        >
          ← Back to Available Food
        </button>
      </div>
    );
  }

  return (
    <div className="section">

      <h2>🍱 Available Food</h2>

      <p>
        Find surplus food available for donation.
      </p>

      {donations.length === 0 ? (
        <div className="card">
          <h3>😔 No Food Available</h3>
          <p>
            There are currently no food donations available.
          </p>
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

          {donations.map((food) => (

            <div
              key={food._id}
              className="card"
              style={{
                width: "320px",
                margin: "10px"
              }}
            >

              <div
                style={{
                  fontSize: "50px",
                  marginBottom: "10px"
                }}
              >
                🍱
              </div>

              <h3>{food.foodName}</h3>

              <p>
                📦 <strong>Quantity:</strong> {food.quantity}
              </p>

              <p>
                📝 <strong>Description:</strong>{" "}
                {food.description || "No description"}
              </p>

              <p>
                📍 <strong>Location:</strong> {food.location}
              </p>

              <p>
                👤 <strong>Donor:</strong> {food.donorName}
              </p>

              <p>
                📞 <strong>Phone:</strong> {food.phone}
              </p>

              <p>
                🟢 <strong>Status:</strong> {food.status}
              </p>

              <button
                onClick={() => setSelectedFood(food)}
                style={{
                  padding: "12px 20px",
                  marginTop: "10px"
                }}
              >
                🙋 Request Food
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AvailableFood;