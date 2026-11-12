import { useState } from "react";

function DonateFood() {
  const [formData, setFormData] = useState({
    foodName: "",
    quantity: "",
    description: "",
    location: "",
    donorName: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/food/donate",
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
          foodName: "",
          quantity: "",
          description: "",
          location: "",
          donorName: "",
          phone: ""
        });
      }

    } catch (error) {
      alert("Food donation failed");
    }
  };

  return (
    <div className="section">

      <h2>🍚 Donate Food</h2>

      <p>
        Share your surplus food with someone in need.
      </p>

      <div className="card">

        <form onSubmit={handleDonate}>

          <input
            type="text"
            name="foodName"
            placeholder="Food Name"
            value={formData.foodName}
            onChange={handleChange}
            required
          />

          <br /><br />

          <input
            type="text"
            name="quantity"
            placeholder="Quantity (e.g. 10 plates)"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <br /><br />

          <textarea
            name="description"
            placeholder="Food Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />

          <br /><br />

          <input
            type="text"
            name="location"
            placeholder="Food Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <br /><br />

          <input
            type="text"
            name="donorName"
            placeholder="Donor Name"
            value={formData.donorName}
            onChange={handleChange}
            required
          />

          <br /><br />

          <input
            type="text"
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
              padding: "12px 25px"
            }}
          >
            🍚 Donate Food
          </button>

        </form>

      </div>

    </div>
  );
}

export default DonateFood;