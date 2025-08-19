import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// StepBadge: for numbered steps in How It Works
function StepBadge({ number }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#a85c2c] to-[#8B4513] text-white font-bold text-lg shadow-md mr-3">
      {number}
    </span>
  );
}

const SAMPLE_DATA_1 = {
  projectName: "Narmada Barrage",
  latitude: 21.7645,
  longitude: 73.1856,
  purpose: "hydropower",
  river: "Narmada",
  nearestCity: "Bharuch",
  district: "Narmada",
  damType: "gravity",
  seismicZone: "4",
  elevation: 180,
  slope: 8,
  mainSoilType: "Cambisols",
  secondarySoilType: "Vertisols",
  length: 2500,
  maxHeight: 45,
  rainfall2020: 1450,
  rainfall2021: 1380,
  rainfall2022: 1520,
  rainfall2023: 1600,
  rainfall2024: 1490,
  rainfall5YearAvg: 1488,
  monsoonIntensity: 21.2,
  notes: "Located in a high rainfall zone, moderate seismic risk, suitable for hydropower and irrigation."
};

const SAMPLE_DATA_2 = {
  projectName: "Dholi Dhaja Dam Expansion",
  latitude: 23.0258,
  longitude: 73.1059,
  purpose: "water_supply",
  river: "Sukhi",
  nearestCity: "Dakor",
  district: "Kheda",
  damType: "earthen",
  seismicZone: "3",
  elevation: 95,
  slope: 4.5,
  mainSoilType: "Black Cotton",
  secondarySoilType: "Alluvial",
  length: 1850,
  maxHeight: 25,
  rainfall2020: 820,
  rainfall2021: 910,
  rainfall2022: 785,
  rainfall2023: 870,
  rainfall2024: 830,
  rainfall5YearAvg: 843,
  monsoonIntensity: 15.7,
  notes: "Expansion project to increase water storage capacity for agricultural and municipal use. Located in a medium rainfall zone with clay-rich soil. Project includes modernization of irrigation channels and flood control measures. Low to moderate seismic risk area."
};

export default function ServicesPage() {
  const [form, setForm] = useState({
    projectName: "",
    latitude: "",
    longitude: "",
    purpose: "",
    river: "",
    nearestCity: "",
    district: "",
    damType: "",
    seismicZone: "",
    elevation: "",
    slope: "",
    mainSoilType: "",
    secondarySoilType: "",
    length: "",
    maxHeight: "",
    rainfall2020: "",
    rainfall2021: "",
    rainfall2022: "",
    rainfall2023: "",
    rainfall2024: "",
    rainfall5YearAvg: "",
    monsoonIntensity: "",
    notes: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoadSample1 = () => {
    setForm(SAMPLE_DATA_1);
  };

  const handleLoadSample2 = () => {
    setForm(SAMPLE_DATA_2);
  };

  const handleClear = () => {
    setForm({
      projectName: "",
      latitude: "",
      longitude: "",
      purpose: "",
      river: "",
      nearestCity: "",
      district: "",
      damType: "",
      seismicZone: "",
      elevation: "",
      slope: "",
      mainSoilType: "",
      secondarySoilType: "",
      length: "",
      maxHeight: "",
      rainfall2020: "",
      rainfall2021: "",
      rainfall2022: "",
      rainfall2023: "",
      rainfall2024: "",
      rainfall5YearAvg: "",
      monsoonIntensity: "",
      notes: ""
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      // Prepare the data in the format expected by the backend
      const predictionData = {
        projectName: form.projectName,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        purpose: form.purpose,
        river: form.river,
        nearestCity: form.nearestCity,
        district: form.district,
        damType: form.damType,
        seismicZone: form.seismicZone,
        elevation: parseFloat(form.elevation || 0),
        slope: parseFloat(form.slope || 0),
        mainSoilType: form.mainSoilType,
        secondarySoilType: form.secondarySoilType,
        length: parseFloat(form.length || 0),
        maxHeight: parseFloat(form.maxHeight || 0),
        rainfall2020: parseFloat(form.rainfall2020 || 0),
        rainfall2021: parseFloat(form.rainfall2021 || 0),
        rainfall2022: parseFloat(form.rainfall2022 || 0),
        rainfall2023: parseFloat(form.rainfall2023 || 0),
        rainfall2024: parseFloat(form.rainfall2024 || 0),
        rainfall5YearAvg: parseFloat(form.rainfall5YearAvg || 0),
        monsoonIntensity: parseFloat(form.monsoonIntensity || 0),
        notes: form.notes
      };

      const response = await fetch("http://localhost:8000/api/predict/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken()
        },
        body: JSON.stringify(predictionData),
        credentials: 'include' // Important for session/csrf
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Prediction failed");
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get CSRF token from cookies
  const getCsrfToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-20 mt-24 text-center text-white shadow-lg">
        <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight">
          Geological Analysis Services
        </h1>
        <p className="text-xl max-w-2xl mx-auto font-medium opacity-90">
          Get comprehensive geological suitability analysis for your dam
          construction projects
          <br />
          using advanced ML models
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Project Form */}
          <Card className="bg-gradient-to-br from-[#fffdf8] to-[#f5eee6] border border-[#e0d7cc] rounded-3xl shadow-[0_8px_30px_rgba(139,69,19,0.10)] p-8 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-[#5a3217] mb-2">
            Project Analysis Form
          </h2>
          <p className="text-base text-[#5a3217] mb-6 opacity-80">
            Enter your project details to get a geological suitability score
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-[#c49a6c] text-[#8B4513] font-semibold hover:bg-[#f5eee6] flex-1"
                onClick={handleLoadSample1}
              >
                ⚡ Sample 1: Narmada
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-[#9c7b4f] text-[#8B4513] font-semibold hover:bg-[#f5eee6] flex-1"
                onClick={handleLoadSample2}
              >
                ⚡ Sample 2: Sardar Sarovar
              </Button>
            </div>
            <Button
              variant="ghost"
              className="rounded-xl text-[#8B4513] border border-[#e0d7cc] font-semibold hover:bg-[#f5eee6]"
              onClick={handleClear}
            >
              Clear Form
            </Button>
          </div>

          {/* Expanded detailed form */}
          <div className="space-y-8">
            {/* General Project Metadata */}
            <div>
              <h3 className="text-lg font-semibold text-[#5a3217] mb-2">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Project Name</label>
                  <Input value={form.projectName} onChange={e => handleChange("projectName", e.target.value)} placeholder="Enter project name" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Latitude</label>
                  <Input type="number" value={form.latitude} onChange={e => handleChange("latitude", e.target.value)} placeholder="e.g. 23.0205" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Longitude</label>
                  <Input type="number" value={form.longitude} onChange={e => handleChange("longitude", e.target.value)} placeholder="e.g. 72.5797" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Purpose</label>
                  <Select value={form.purpose} onValueChange={val => handleChange("purpose", val)}>
                    <SelectTrigger className="mt-1 bg-white border border-[#d8c6b0] rounded-xl shadow-sm">
                      <SelectValue placeholder="Select purpose">
                        {form.purpose ? form.purpose.charAt(0).toUpperCase() + form.purpose.slice(1).replace('_', ' ') : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="irrigation">Irrigation</SelectItem>
                      <SelectItem value="hydropower">Hydropower</SelectItem>
                      <SelectItem value="flood">Flood Control</SelectItem>
                      <SelectItem value="water_supply">Water Supply</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">River</label>
                  <Input value={form.river} onChange={e => handleChange("river", e.target.value)} placeholder="Enter river name" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Nearest City</label>
                  <Input value={form.nearestCity} onChange={e => handleChange("nearestCity", e.target.value)} placeholder="Enter nearest city" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">District</label>
                  <Input value={form.district} onChange={e => handleChange("district", e.target.value)} placeholder="Enter district name" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Dam Type</label>
                  <Select value={form.damType} onValueChange={val => handleChange("damType", val)}>
                    <SelectTrigger className="mt-1 bg-white border border-[#d8c6b0] rounded-xl shadow-sm">
                      <SelectValue placeholder="Select dam type">
                        {form.damType ? form.damType.charAt(0).toUpperCase() + form.damType.slice(1).replace('_', ' ') : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earthen">Earthen</SelectItem>
                      <SelectItem value="gravity">Gravity</SelectItem>
                      <SelectItem value="masonry">Masonry</SelectItem>
                      <SelectItem value="arch">Arch</SelectItem>
                      <SelectItem value="buttress">Buttress</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Geological Model Inputs */}
            <div>
              <h3 className="text-lg font-semibold text-[#5a3217] mb-2">Geological Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Seismic Zone</label>
                  <Input value={form.seismicZone} onChange={e => handleChange("seismicZone", e.target.value)} placeholder="e.g. 3" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Elevation (m)</label>
                  <Input type="number" value={form.elevation} onChange={e => handleChange("elevation", e.target.value)} placeholder="e.g. 120" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Slope (%)</label>
                  <Input type="number" value={form.slope} onChange={e => handleChange("slope", e.target.value)} placeholder="e.g. 5" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Soil Type (Main)</label>
                  <Input value={form.mainSoilType} onChange={e => handleChange("mainSoilType", e.target.value)} placeholder="e.g. Vertisols" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Soil Type (Secondary)</label>
                  <Input value={form.secondarySoilType} onChange={e => handleChange("secondarySoilType", e.target.value)} placeholder="e.g. Cambisols" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Length (m)</label>
                  <Input type="number" value={form.length} onChange={e => handleChange("length", e.target.value)} placeholder="e.g. 1000" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Max Height above Foundation (m)</label>
                  <Input type="number" value={form.maxHeight} onChange={e => handleChange("maxHeight", e.target.value)} placeholder="e.g. 20" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
              </div>
            </div>

            {/* Climatic Effect Model Inputs */}
            <div>
              <h3 className="text-lg font-semibold text-[#5a3217] mb-2">Climatic Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Rainfall 2020 (mm)</label>
                  <Input type="number" value={form.rainfall2020} onChange={e => handleChange("rainfall2020", e.target.value)} placeholder="e.g. 1200" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Rainfall 2021 (mm)</label>
                  <Input type="number" value={form.rainfall2021} onChange={e => handleChange("rainfall2021", e.target.value)} placeholder="e.g. 1300" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Rainfall 2022 (mm)</label>
                  <Input type="number" value={form.rainfall2022} onChange={e => handleChange("rainfall2022", e.target.value)} placeholder="e.g. 1100" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Rainfall 2023 (mm)</label>
                  <Input type="number" value={form.rainfall2023} onChange={e => handleChange("rainfall2023", e.target.value)} placeholder="e.g. 1400" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Rainfall 2024 (mm)</label>
                  <Input type="number" value={form.rainfall2024} onChange={e => handleChange("rainfall2024", e.target.value)} placeholder="e.g. 1500" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Rainfall 5yr Avg (mm)</label>
                  <Input type="number" value={form.rainfall5YearAvg} onChange={e => handleChange("rainfall5YearAvg", e.target.value)} placeholder="e.g. 1300" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
                <div>
                  <label className="text-base font-medium text-[#5a3217] mb-1 block">Monsoon Intensity Avg (mm/wet day)</label>
                  <Input type="number" value={form.monsoonIntensity} onChange={e => handleChange("monsoonIntensity", e.target.value)} placeholder="e.g. 18.5" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="text-base font-medium text-[#5a3217] mb-1 block">Additional Notes</label>
              <Textarea value={form.notes} onChange={e => handleChange("notes", e.target.value)} placeholder="Any special geological or climatic notes" className="mt-1 rounded-xl border border-[#d8c6b0] bg-white shadow-sm" />
            </div>
          </div>

          <div className="mt-8">
            <Button
              className="bg-gradient-to-r from-[#a85c2c] to-[#8B4513] hover:from-[#8B4513] hover:to-[#5a3217] text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition duration-300 w-full text-lg"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict"}
            </Button>
            {error && (
              <div className="mt-4 text-red-600 text-center">{error}</div>
            )}
          </div>
        </Card>

        {/* Right Column: How It Works, Prediction Result, and API Response */}
        <div className="flex flex-col gap-6">
          {/* How It Works */}
          <Card className="bg-gradient-to-br from-[#fffdf8] to-[#f5eee6] border border-[#e0d7cc] rounded-3xl shadow-[0_8px_30px_rgba(139,69,19,0.10)] p-6 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-[#5a3217] mb-6">
              How It Works
            </h2>
            <ul className="space-y-8 text-[#5a3217]">
              <li className="flex items-start">
                <StepBadge number={1} />
                <div>
                  <span className="font-semibold text-lg">Data Collection</span>
                  <p>Enter your project details and geological parameters.</p>
                </div>
              </li>
              <li className="flex items-start">
                <StepBadge number={2} />
                <div>
                  <span className="font-semibold text-lg">Analysis</span>
                  <p>Our ML models process the data in real-time.</p>
                </div>
              </li>
              <li className="flex items-start">
                <StepBadge number={3} />
                <div>
                  <span className="font-semibold text-lg">Get Results</span>
                  <p>Receive detailed analysis and recommendations.</p>
                </div>
              </li>
            </ul>
          </Card>

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-[#fffdf8] to-[#f5eee6] border border-[#e0d7cc] rounded-3xl shadow-[0_8px_30px_rgba(139,69,19,0.10)] p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-[#5a3217] mb-4">Analysis Results</h2>
                
                {result.predictions?.geological_suitability && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#5a3217] mb-2">Geological Suitability</h3>
                    <div className="bg-white p-4 rounded-lg border border-[#e0d7cc]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Score:</span>
                        <span className="font-bold">{result.predictions.geological_suitability.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{
                            width: `${result.predictions.geological_suitability.score}%`,
                            background: `linear-gradient(90deg, #a85c2c, #8B4513)`
                          }}
                        />
                      </div>
                      <p className="text-sm text-[#5a3217] mt-2">
                        {result.predictions.geological_suitability.level}
                      </p>
                    </div>
                  </div>
                )}

                {result.predictions?.climate_impact && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#5a3217] mb-2">Climate Impact</h3>
                    <div className="bg-white p-4 rounded-lg border border-[#e0d7cc]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Score:</span>
                        <span className="font-bold">{result.predictions.climate_impact.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{
                            width: `${result.predictions.climate_impact.score}%`,
                            background: `linear-gradient(90deg, #1e88e5, #0d47a1)`
                          }}
                        />
                      </div>
                      <p className="text-sm text-[#5a3217] mt-2">
                        {result.predictions.climate_impact.level}
                      </p>
                    </div>
                  </div>
                )}

                {result.predictions?.overall_suitability && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#5a3217] mb-2">Overall Suitability</h3>
                    <div className="bg-white p-4 rounded-lg border border-[#e0d7cc]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Score:</span>
                        <span className="font-bold">{result.predictions.overall_suitability.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{
                            width: `${result.predictions.overall_suitability.score}%`,
                            background: `linear-gradient(90deg, #4caf50, #2e7d32)`
                          }}
                        />
                      </div>
                      <p className="text-sm text-[#5a3217] mt-2">
                        {result.predictions.overall_suitability.level}
                      </p>
                    </div>
                  </div>
                )}

                {result.predictions?.climatic_effects && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#5a3217] mb-2">Climate Impact</h3>
                    <div className="bg-white p-4 rounded-lg border border-[#e0d7cc]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Score:</span>
                        <span className="font-bold">{result.predictions.climatic_effects.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{
                            width: `${result.predictions.climatic_effects.score}%`,
                            background: `linear-gradient(90deg, #a85c2c, #8B4513)`
                          }}
                        />
                      </div>
                      <p className="text-sm text-[#5a3217] mt-2">
                        {result.predictions.climatic_effects.level}
                      </p>
                      <p className="text-sm text-[#5a3217] mt-2">
                        {result.predictions.climatic_effects.description}
                      </p>
                    </div>
                  </div>
                )}

                {result.recommendations?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#5a3217] mb-2">Recommendations</h3>
                    <ul className="space-y-2 text-[#5a3217]">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#a85c2c] mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>

              {/* Full API Response (scrollable box) */}
              <div className="bg-white border border-[#e0d7cc] rounded-xl shadow p-4 max-h-48 overflow-auto text-xs text-[#5a3217]">
                <div className="font-semibold mb-2">Full API Response</div>
                <pre className="whitespace-pre-wrap break-all">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
