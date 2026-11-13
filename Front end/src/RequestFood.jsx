import { useState } from "react";

function RequestFood({ food }) {
  const [formData, setFormData] = useState({
    requesterName: "",
    phone: "",
    quantityRequested: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRequest = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5001/api/requests/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            foodId: food._id,
            requesterName: formData.requesterName,
            phone: formData.phone,
            quantityRequested: formData.quantityRequested
          })
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        setFormData({
          requesterName: "",
          phone: "",
          quantityRequested: ""
        });
      }

    } catch (error) {
      console.error(error);
      alert("Food request failed");
    }
  };

  return (
    <div className="section">

      <h2>🙋 Request Food</h2>

      <p>Submit a request for the selected food donation.</p>

      <div className="card">

        <div style={{ fontSize: "50px" }}>
          🍱
        </div>

        <h3>{food.foodName}</h3>

        <p>
          📦 <strong>Available:</strong> {food.quantity}
        </p>

        <p>
          📍 <strong>Location:</strong> {food.location}
        </p>

        <p>
          👤 <strong>Donor:</strong> {food.donorName}
        </p>

        <hr style={{ margin: "25px 0" }} />

        <h3>Your Details</h3>

        <form onSubmit={handleRequest}>

          <input
            type="text"
            name="requesterName"
            placeholder="Your Name"
            value={formData.requesterName}
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

          <input
            type="text"
            name="quantityRequested"
            placeholder="Quantity Required"
            value={formData.quantityRequested}
            onChange={handleChange}
            required
          />

          <br /><br />

          <button
            type="submit"
            style={{
              padding: "12px 25px"
            }}
          >
            📩 Submit Request
          </button>

        </form>

      </div>

    </div>
  );
}

export default RequestFood;