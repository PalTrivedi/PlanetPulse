import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import L from "leaflet";

// Fix Leaflet marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function HomePage() {
  const [dams, setDams] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    Latitude: "",
    Longitude: "",
    Purpose: "",
  });

  // Load CSV data on mount
  useEffect(() => {
    Papa.parse("/Dams_Gujarat.csv", {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: function (results) {
        const parsed = results.data
          .map((row, index) => {
            const lat = parseFloat(row.Latitude);
            const lng = parseFloat(row.Longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            return {
              id: index,
              ...row,
              Latitude: lat,
              Longitude: lng,
            };
          })
          .filter((item) => item !== null);
        setDams(parsed);
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
      },
    });
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new dam
  const handleAdd = (e) => {
    e.preventDefault();
    const lat = parseFloat(formData.Latitude);
    const lng = parseFloat(formData.Longitude);
    if (isNaN(lat) || isNaN(lng)) {
      alert("Invalid latitude or longitude");
      return;
    }

    const newDam = {
      id: Date.now(),
      ...formData,
      Latitude: lat,
      Longitude: lng,
    };
    setDams([...dams, newDam]);
    setFormData({ Name: "", Latitude: "", Longitude: "", Purpose: "" });
  };

  return (
    <div
      style={{ padding: "10px", maxWidth: "100vw", boxSizing: "border-box" }}
    >
      <h2>Gujarat Dams Map</h2>

      <MapContainer
        center={[22.2587, 71.1924]}
        zoom={7}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {dams.map((dam) => (
          <Marker key={dam.id} position={[dam.Latitude, dam.Longitude]}>
            <Popup>
              <div>
                <strong>{dam.Name}</strong>
                <br />
                <em>{dam.District}</em> | {dam.NearestCity}
                <br />
                <strong>River:</strong> {dam.River || "N/A"}
                <br />
                <strong>Purpose:</strong> {dam.Purpose || "N/A"}
                <br />
                <strong>Elevation:</strong> {dam.Elevation || "N/A"} m
                <br />
                <strong>Type:</strong> {dam.Type || "N/A"}
                <br />
                <strong>Rainfall (5yr avg):</strong>{" "}
                {dam.Rainfall_5yr_Avg || "N/A"} mm
                <br />
                <strong>Monsoon Intensity:</strong>{" "}
                {dam.MonsoonIntensityAvg || "N/A"} mm/wet day
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <h3>Add New Dam (Basic)</h3>
      <form onSubmit={handleAdd} style={{ maxWidth: "400px" }}>
        <div>
          <label>Name:</label>
          <input
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label>Latitude:</label>
          <input
            name="Latitude"
            type="number"
            step="any"
            value={formData.Latitude}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label>Longitude:</label>
          <input
            name="Longitude"
            type="number"
            step="any"
            value={formData.Longitude}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label>Purpose:</label>
          <input
            name="Purpose"
            value={formData.Purpose}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <button type="submit">Add Dam</button>
      </form>
    </div>
  );
}
