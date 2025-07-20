import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";

const GujaratMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [dams, setDams] = useState([]);

  // Fetch dam data from backend CSV endpoint
  useEffect(() => {
    fetch("http://localhost:8000/api/dams_csv/")
      .then(res => res.json())
      .then(data => setDams(data))
      .catch(() => setDams([]));
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([22.5, 71.5], 8);
    setTimeout(() => {
      map.current.invalidateSize();
    }, 0);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when dams data changes
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    map.current.eachLayer(layer => {
      if (layer instanceof L.Marker) map.current.removeLayer(layer);
    });

    // Custom dam icon
    const damIcon = L.divIcon({
      html: `<div style="background: #3983ff; border: 2px solid #1e4076; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">🏗️</div>`,
      className: "custom-dam-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    dams.forEach((dam) => {
      if (!dam.Latitude || !dam.Longitude) return;
      const marker = L.marker([dam.Latitude, dam.Longitude], { icon: damIcon }).addTo(map.current);

      // Show all CSV fields in popup
      const popupContent = `
        <div style="padding: 16px; min-width: 280px; max-height: 320px; overflow-y: auto;">
          <h3 style="color: #8B4513; margin: 0 0 12px 0; font-size: 18px; font-weight: bold;">${dam.Name || dam.name}</h3>
          <div style="font-size: 14px; line-height: 1.4;">
            ${Object.entries(dam).map(([key, value]) =>
              `<p style=\"margin: 4px 0;\"><strong>${key}:</strong> ${value}</p>`
            ).join('')}
          </div>
        </div>
      `;
      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: "custom-popup",
      });
    });
  }, [dams]);

  return (
    <div className="w-full h-[600px] rounded-lg border border-border overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default GujaratMap; 