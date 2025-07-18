import React, { useEffect, useRef } from "react";
import L from "leaflet";

// Dam data for Gujarat
const dams = [
  {
    id: 1,
    name: "Sardar Sarovar Dam",
    position: [21.8333, 73.75],
    capacity: "9.5 BCM",
    river: "Narmada River",
    type: "Concrete Gravity Dam",
    height: "163 meters",
    yearCompleted: "2017",
    purpose: "Irrigation, Hydropower, Water Supply",
    description:
      "One of the largest dams in India, providing water and power to multiple states.",
  },
  {
    id: 2,
    name: "Ukai Dam",
    position: [21.2333, 73.5833],
    capacity: "8.51 BCM",
    river: "Tapi River",
    type: "Masonry Dam",
    height: "80.8 meters",
    yearCompleted: "1972",
    purpose: "Irrigation, Hydropower, Flood Control",
    description:
      "Second largest reservoir in Gujarat, crucial for Surat's water supply.",
  },
  {
    id: 3,
    name: "Kadana Dam",
    position: [22.8333, 73.8667],
    capacity: "1.55 BCM",
    river: "Mahi River",
    type: "Composite Dam",
    height: "70 meters",
    yearCompleted: "1979",
    purpose: "Irrigation, Hydropower",
    description: "Important source of irrigation for North Gujarat region.",
  },
  {
    id: 4,
    name: "Dharoi Dam",
    position: [23.9167, 72.2833],
    capacity: "0.86 BCM",
    river: "Sabarmati River",
    type: "Earth & Rock Fill Dam",
    height: "58 meters",
    yearCompleted: "1976",
    purpose: "Irrigation, Water Supply",
    description: "Primary water source for Ahmedabad and surrounding areas.",
  },
  {
    id: 5,
    name: "Machhu Dam II",
    position: [22.4833, 70.7833],
    capacity: "0.095 BCM",
    river: "Machhu River",
    type: "Earth & Rock Fill Dam",
    height: "26 meters",
    yearCompleted: "1978",
    purpose: "Irrigation, Water Supply",
    description: "Rebuilt after the 1979 dam failure, serves the Morbi region.",
  },
  {
    id: 6,
    name: "Sipu Dam",
    position: [21.95, 73.1667],
    capacity: "0.32 BCM",
    river: "Sipu River",
    type: "Earth Dam",
    height: "42 meters",
    yearCompleted: "1983",
    purpose: "Irrigation",
    description:
      "Provides irrigation facilities to tribal areas of Central Gujarat.",
  },
];

// Gujarat boundary coordinates
const gujaratBoundary = [
  [24.7, 68.1],
  [24.8, 69.8],
  [24.5, 71.0],
  [23.9, 72.5],
  [23.0, 72.6],
  [22.5, 72.2],
  [21.9, 72.8],
  [21.1, 72.1],
  [20.4, 72.8],
  [20.1, 70.4],
  [21.0, 69.7],
  [22.5, 68.4],
  [23.5, 68.2],
  [24.7, 68.1],
];

const GujaratMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map focused on Gujarat with bounds
    map.current = L.map(mapContainer.current).setView([22.5, 71.5], 8);

    // Set max bounds to restrict view to Gujarat region
    const gujaratBounds = L.latLngBounds(
      [20.0, 68.0], // Southwest corner
      [25.0, 75.0] // Northeast corner
    );
    map.current.setMaxBounds(gujaratBounds);
    map.current.setMinZoom(6);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    // Add Gujarat boundary
    const gujaratPolygon = L.polygon(gujaratBoundary, {
      color: "#8B4513",
      weight: 3,
      opacity: 0.8,
      fillColor: "#8B4513",
      fillOpacity: 0.1,
    }).addTo(map.current);

    // Custom dam icon
    const damIcon = L.divIcon({
      html: `
        <div style="
          background: #3983ff;
          border: 2px solid #1e4076;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">🏗️</div>
      `,
      className: "custom-dam-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Add dam markers
    dams.forEach((dam) => {
      const marker = L.marker(dam.position, { icon: damIcon }).addTo(
        map.current
      );

      const popupContent = `
        <div style="padding: 16px; min-width: 280px;">
          <h3 style="color: #8B4513; margin: 0 0 12px 0; font-size: 18px; font-weight: bold;">${dam.name}</h3>
          <div style="font-size: 14px; line-height: 1.4;">
            <p style="margin: 4px 0;"><strong>River:</strong> ${dam.river}</p>
            <p style="margin: 4px 0;"><strong>Capacity:</strong> ${dam.capacity}</p>
            <p style="margin: 4px 0;"><strong>Type:</strong> ${dam.type}</p>
            <p style="margin: 4px 0;"><strong>Height:</strong> ${dam.height}</p>
            <p style="margin: 4px 0;"><strong>Completed:</strong> ${dam.yearCompleted}</p>
            <p style="margin: 4px 0;"><strong>Purpose:</strong> ${dam.purpose}</p>
            <p style="margin: 12px 0 0 0; font-style: italic; color: #666;">${dam.description}</p>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: "custom-popup",
      });
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-[600px] rounded-lg border border-border overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default GujaratMap; 