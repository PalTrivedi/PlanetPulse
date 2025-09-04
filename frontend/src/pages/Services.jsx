import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
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
  projectName: "Aamli Chharchhoda Dam",
  latitude: 21.3924,
  longitude: 73.3858,
  purpose: "irrigation",
  river: "Kotar",
  nearestCity: "Dahod",
  district: "Dahod",
  damType: "earthen",
  seismicZone: "3",
  elevation: 106.0,
  slope: 9.009,
  mainSoilType: "Unknown",
  secondarySoilType: "Unknown",
  length: 600.0,
  maxHeight: 11.0,
  riverDistance: 34.1641,
  riverFlowRate: 0.002,
  rainfall2020: 1295.4,
  rainfall2021: 1979.8,
  rainfall2022: 1387.9,
  rainfall2023: 1125.6,
  rainfall2024: 2121.1,
  rainfall5YearAvg: 1581.96,
  rainfallStdDev5yr: 440.73,
  maxAnnualRainfall: 2121.1,
  minAnnualRainfall: 1125.6,
  monsoonIntensity: 16.25,
  extremeRainfallDays: 0,
  floodRiskIndex: 0.5,
  cycloneExposure: 0.0,
  avgTemperature5yr: 27.27,
  maxTemperatureLast5yr: 38.01,
  temperatureStdDev5yr: 4.01,
  heatwaveDaysPerYear: 0,
  ensoImpactIndex: 0.28,
  climateVulnerabilityIndex: 177.5,
  ndvi2025: 0.80,
  notes: "Aamli Chharchhoda Dam is an earthen dam on the Kotar river near Dahod, Dahod district. It has a length of 600 meters and a maximum height of 11 meters. The area experiences high rainfall with an average of 1582mm annually. The dam is primarily used for irrigation purposes and has fair geological suitability. The region has a tropical climate with temperatures ranging up to 38°C and experiences significant rainfall variability. The dam is located in seismic zone 3 with unknown soil types."
};

const SAMPLE_DATA_2 = {
  projectName: "Anandpar Dam",
  latitude: 22.1019,
  longitude: 70.8611,
  purpose: "irrigation",
  river: "T/Aji",
  nearestCity: "Rajkot",
  district: "Rajkot",
  damType: "earthen",
  seismicZone: "3",
  elevation: 184.0,
  slope: 0.0,
  mainSoilType: "Vertisols",
  secondarySoilType: "Cambisols",
  length: 231.0,
  maxHeight: 15.0,
  riverDistance: 0.0,
  riverFlowRate: 0.0,
  rainfall2020: 1098.7,
  rainfall2021: 911.9,
  rainfall2022: 766.1,
  rainfall2023: 725.8,
  rainfall2024: 1511.9,
  rainfall5YearAvg: 1002.88,
  rainfallStdDev5yr: 319.92,
  maxAnnualRainfall: 1511.9,
  minAnnualRainfall: 725.8,
  monsoonIntensity: 17.3,
  extremeRainfallDays: 0,
  floodRiskIndex: 0.0,
  cycloneExposure: 0.0,
  avgTemperature5yr: 26.33,
  maxTemperatureLast5yr: 36.25,
  temperatureStdDev5yr: 4.5,
  heatwaveDaysPerYear: 0,
  ensoImpactIndex: 0.32,
  climateVulnerabilityIndex: 0.32,
  ndvi2025: 0.69,
  notes: "Anandpar Dam is an earthen dam located on the Aji river near Rajkot. With a length of 231 meters and maximum height of 15 meters, it serves irrigation purposes. The area has a semi-arid climate with an average annual rainfall of 1003mm. The dam is situated in seismic zone 3 with Vertisols and Cambisols soil types. The region experiences high temperatures during summer months with an average of 26.33°C and maximum reaching up to 36.25°C. The dam has shown good NDVI values, indicating healthy vegetation cover in the area."
};

export default function ServicesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    // Project Details
    projectName: "",
    latitude: "",
    longitude: "",
    purpose: "",
    river: "",
    nearestCity: "",
    district: "",
    
    // Geo Features
    damType: "",
    seismicZone: "",
    elevation: "",
    slope: "",
    mainSoilType: "",
    secondarySoilType: "",
    length: "",
    maxHeight: "",
    riverDistance: "",
    riverFlowRate: "",
    
    // Climatic Features
    rainfall2020: "",
    rainfall2021: "",
    rainfall2022: "",
    rainfall2023: "",
    rainfall2024: "",
    rainfall5YearAvg: "",
    rainfallStdDev5yr: "",
    maxAnnualRainfall: "",
    minAnnualRainfall: "",
    monsoonIntensity: "",
    extremeRainfallDays: "",
    floodRiskIndex: "",
    cycloneExposure: "",
    avgTemperature5yr: "",
    maxTemperatureLast5yr: "",
    temperatureStdDev5yr: "",
    heatwaveDaysPerYear: "",
    ensoImpactIndex: "",
    climateVulnerabilityIndex: "",
    ndvi2025: "",
    
    notes: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
      riverDistance: "",
      riverFlowRate: "",
      rainfall2020: "",
      rainfall2021: "",
      rainfall2022: "",
      rainfall2023: "",
      rainfall2024: "",
      rainfall5YearAvg: "",
      rainfallStdDev5yr: "",
      maxAnnualRainfall: "",
      minAnnualRainfall: "",
      monsoonIntensity: "",
      extremeRainfallDays: "",
      floodRiskIndex: "",
      cycloneExposure: "",
      avgTemperature5yr: "",
      maxTemperatureLast5yr: "",
      temperatureStdDev5yr: "",
      heatwaveDaysPerYear: "",
      ensoImpactIndex: "",
      climateVulnerabilityIndex: "",
      ndvi2025: "",
      notes: ""
    });
  };

  // Check if form is empty or contains only default values
  const isFormEmpty = () => {
    const defaultForm = {
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
      riverDistance: "",
      riverFlowRate: "",
      rainfall2020: "",
      rainfall2021: "",
      rainfall2022: "",
      rainfall2023: "",
      rainfall2024: "",
      rainfall5YearAvg: "",
      rainfallStdDev5yr: "",
      maxAnnualRainfall: "",
      minAnnualRainfall: "",
      monsoonIntensity: "",
      extremeRainfallDays: "",
      floodRiskIndex: "",
      cycloneExposure: "",
      avgTemperature5yr: "",
      maxTemperatureLast5yr: "",
      temperatureStdDev5yr: "",
      heatwaveDaysPerYear: "",
      ensoImpactIndex: "",
      climateVulnerabilityIndex: "",
      ndvi2025: "",
      notes: ""
    };

    return Object.keys(defaultForm).every(key => {
      const value = form[key];
      const defaultValue = defaultForm[key];
      // Check if value is empty or equal to default
      return value === "" || value === null || value === undefined || value === defaultValue;
    });
  };

  const isFormValid = !isFormEmpty();

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const csrfToken = getCsrfToken();
      const response = await fetch("http://localhost:8000/api/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      
      // Scroll to results after successful prediction
      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
    } catch (err) {
      setError(err.message || "An error occurred while making the prediction.");
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

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
              currentStep >= step 
                ? 'bg-gradient-to-br from-[#a85c2c] to-[#8B4513]' 
                : 'bg-gray-300'
            }`}
          >
            {step}
          </div>
          <span className="text-sm mt-2 text-gray-600">
            {step === 1 ? 'Project' : 
             step === 2 ? 'Geography' : 
             step === 3 ? 'Climate' : 'Review'}
          </span>
        </div>
      ))}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 -z-10">
        <div 
          className="h-full bg-gradient-to-r from-[#a85c2c] to-[#8B4513] transition-all duration-300"
          style={{ width: `${(currentStep - 1) * 33.33}%` }}
        />
      </div>
    </div>
  );

  // Form steps components
  const ProjectDetailsStep = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-[#5a3217] mb-4">Project Information</h3>
      <Input 
        placeholder="Project Name" 
        value={form.projectName}
        onChange={(e) => handleChange('projectName', e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          type="number" 
          placeholder="Latitude" 
          value={form.latitude}
          onChange={(e) => handleChange('latitude', e.target.value)}
        />
        <Input 
          type="number" 
          placeholder="Longitude" 
          value={form.longitude}
          onChange={(e) => handleChange('longitude', e.target.value)}
        />
      </div>
      <Input 
        placeholder="Purpose" 
        value={form.purpose}
        onChange={(e) => handleChange('purpose', e.target.value)}
        className="mb-4"
      />
      <Input 
        placeholder="River" 
        value={form.river}
        onChange={(e) => handleChange('river', e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          placeholder="Nearest City" 
          value={form.nearestCity}
          onChange={(e) => handleChange('nearestCity', e.target.value)}
        />
        <Input 
          placeholder="District" 
          value={form.district}
          onChange={(e) => handleChange('district', e.target.value)}
        />
      </div>
    </div>
  );

  const GeographyStep = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-[#5a3217] mb-4">Geographical Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dam Type</label>
          <Select value={form.damType} onValueChange={(value) => handleChange('damType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select dam type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="earthen">Earthen</SelectItem>
              <SelectItem value="concrete">Concrete</SelectItem>
              <SelectItem value="arch">Arch</SelectItem>
              <SelectItem value="buttress">Buttress</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input 
          type="number"
          placeholder="Seismic Zone" 
          value={form.seismicZone}
          onChange={(e) => handleChange('seismicZone', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          type="number"
          placeholder="Elevation (m)" 
          value={form.elevation}
          onChange={(e) => handleChange('elevation', e.target.value)}
        />
        <Input 
          type="number"
          placeholder="Slope (degrees)" 
          value={form.slope}
          onChange={(e) => handleChange('slope', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          placeholder="Main Soil Type" 
          value={form.mainSoilType}
          onChange={(e) => handleChange('mainSoilType', e.target.value)}
        />
        <Input 
          placeholder="Secondary Soil Type" 
          value={form.secondarySoilType}
          onChange={(e) => handleChange('secondarySoilType', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input 
          type="number"
          placeholder="Length (m)" 
          value={form.length}
          onChange={(e) => handleChange('length', e.target.value)}
        />
        <Input 
          type="number"
          placeholder="Max Height (m)" 
          value={form.maxHeight}
          onChange={(e) => handleChange('maxHeight', e.target.value)}
        />
        <Input 
          type="number"
          step="0.0001"
          placeholder="River Flow Rate (m³/s)" 
          value={form.riverFlowRate}
          onChange={(e) => handleChange('riverFlowRate', e.target.value)}
        />
      </div>
    </div>
  );

  const ClimateStep = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-[#5a3217] mb-4">Climatic Data</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[2020, 2021, 2022, 2023, 2024].map(year => (
          <Input
            key={year}
            type="number"
            placeholder={`Rainfall ${year} (mm)`}
            value={form[`rainfall${year}`]}
            onChange={(e) => handleChange(`rainfall${year}`, e.target.value)}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          type="number"
          step="0.01"
          placeholder="5-Year Avg Rainfall (mm)" 
          value={form.rainfall5YearAvg}
          onChange={(e) => handleChange('rainfall5YearAvg', e.target.value)}
        />
        <Input 
          type="number"
          step="0.01"
          placeholder="Rainfall Std Dev" 
          value={form.rainfallStdDev5yr}
          onChange={(e) => handleChange('rainfallStdDev5yr', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          type="number"
          step="0.1"
          placeholder="Avg Temperature (5yr)" 
          value={form.avgTemperature5yr}
          onChange={(e) => handleChange('avgTemperature5yr', e.target.value)}
        />
        <Input 
          type="number"
          step="0.1"
          placeholder="Max Temperature (5yr)" 
          value={form.maxTemperatureLast5yr}
          onChange={(e) => handleChange('maxTemperatureLast5yr', e.target.value)}
        />
      </div>
      <Textarea
        placeholder="Additional Notes"
        className="min-h-[100px]"
        value={form.notes}
        onChange={(e) => handleChange('notes', e.target.value)}
      />
    </div>
  );

  const ReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-[#5a3217] mb-4">Review Your Information</h3>
      
      <div className="space-y-4">
        <h4 className="font-medium text-[#8B4513]">Project Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Project Name</p>
            <p className="font-medium">{form.projectName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">
              {[form.latitude, form.longitude].filter(Boolean).length ? 
                `${form.latitude}, ${form.longitude}` : 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Purpose</p>
            <p className="font-medium">{form.purpose || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">River</p>
            <p className="font-medium">{form.river || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-[#8B4513] mt-6">Geographical Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Dam Type</p>
            <p className="font-medium">{form.damType || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Seismic Zone</p>
            <p className="font-medium">{form.seismicZone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Elevation</p>
            <p className="font-medium">{form.elevation ? `${form.elevation} m` : 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Slope</p>
            <p className="font-medium">{form.slope ? `${form.slope}°` : 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-[#8B4513] mt-6">Climate Data</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-2">Rainfall (2020-2024)</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[2020, 2021, 2022, 2023, 2024].map(year => (
              <div key={year} className="text-center">
                <p className="text-xs text-gray-500">{year}</p>
                <p className="font-medium">{form[`rainfall${year}`] || '-'} mm</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">5-Year Average</p>
              <p className="font-medium">{form.rainfall5YearAvg || '0'} mm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Temperature (5yr avg)</p>
              <p className="font-medium">{form.avgTemperature5yr || '0'}°C</p>
            </div>
          </div>
        </div>
      </div>

      {form.notes && (
        <div className="mt-6">
          <h4 className="font-medium text-[#8B4513] mb-2">Additional Notes</h4>
          <p className="bg-gray-50 p-4 rounded-lg">{form.notes}</p>
        </div>
      )}
    </div>
  );

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProjectDetailsStep />;
      case 2:
        return <GeographyStep />;
      case 3:
        return <ClimateStep />;
      case 4:
        return <ReviewStep />;
      default:
        return <ProjectDetailsStep />;
    }
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
          <Card className="bg-gradient-to-br from-[#fffdf8] to-[#f5eee6] border border-[#e0d7cc] rounded-3xl shadow-[0_8px_30px_rgba(139,69,19,0.10)] p-8 backdrop-blur-sm relative">
            <h2 className="text-3xl font-bold text-[#5a3217] mb-2">
              Project Analysis Form
            </h2>
            <p className="text-base text-[#5a3217] mb-6 opacity-80">
              Step {currentStep} of 4: {currentStep === 1 ? 'Project Details' : 
                                    currentStep === 2 ? 'Geographical Features' :
                                    currentStep === 3 ? 'Climate Data' : 'Review & Submit'}
            </p>

            <div className="relative mb-8">
              <StepIndicator />
            </div>

            <div className="space-y-6">
              {renderStep()}
              
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`${currentStep === 1 ? 'invisible' : ''}`}
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-[#a85c2c] to-[#8B4513] hover:from-[#8B4513] hover:to-[#6b3610] text-white"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handlePredict}
                    disabled={loading || !isFormValid}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    {loading ? 'Processing...' : 'Submit for Analysis'}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Sample Buttons and Result Display */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-[#c49a6c] text-[#8B4513] font-semibold hover:bg-[#f5eee6] flex-1"
                onClick={handleLoadSample1}
              >
                ⚡ Load Sample 1
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-[#9c7b4f] text-[#8B4513] font-semibold hover:bg-[#f5eee6] flex-1"
                onClick={handleLoadSample2}
              >
                ⚡ Load Sample 2
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-red-200 text-red-600 font-semibold hover:bg-red-50"
                onClick={handleClear}
              >
                Clear Form
              </Button>
            </div>

            {result && (
              <div id="results-section" className="space-y-6">
                {/* Individual Score Cards */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Overall Suitability - Full Width */}
                  {result.predictions?.overall_suitability && (
                    <Card className="p-6 border-l-4 border-green-500">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <h4 className="text-xl font-semibold text-[#5a3217]">Overall Suitability</h4>
                          <div className="text-4xl font-bold text-green-600 mt-1">
                            {result.predictions.overall_suitability.score}/100
                          </div>
                          <p className="text-lg text-gray-600 mt-2">
                            {result.predictions.overall_suitability.level}
                          </p>
                        </div>
                        <div className="w-full md:w-1/2">
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden w-full">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-600"
                              style={{ width: `${result.predictions.overall_suitability.score}%` }}
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-2 text-right">
                            {getSuitabilityDescription(result.predictions.overall_suitability.score)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Other Score Cards in 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Geological Suitability */}
                  {result.predictions?.geological_suitability && (
                    <Card className="p-4 border-l-4 border-[#8B4513]">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-[#5a3217]">Geological Suitability</h4>
                          <div className="text-2xl font-bold text-[#8B4513] mt-1">
                            {result.predictions.geological_suitability.score}/100
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {result.predictions.geological_suitability.level}
                          </p>
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#a85c2c] to-[#8B4513]"
                            style={{ width: `${result.predictions.geological_suitability.score}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Climatic Impact */}
                  {result.predictions?.climate_impact && (
                    <Card className="p-4 border-l-4 border-blue-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-[#5a3217]">Climatic Impact</h4>
                          <div className="text-2xl font-bold text-blue-600 mt-1">
                            {result.predictions.climate_impact.score}/100
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {result.predictions.climate_impact.level}
                          </p>
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                            style={{ width: `${result.predictions.climate_impact.score}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Recommendations */}
                {result.recommendations?.length > 0 && (
                  <Card className="p-4 border border-yellow-200 bg-yellow-50">
                    <h4 className="font-semibold text-[#8B4513] mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-600 mr-2">•</span>
                          <span className="text-sm text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* API Response */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-[#5a3217]">API Response</h4>
                    <button 
                      onClick={() => {
                        const textArea = document.createElement('textarea');
                        textArea.value = JSON.stringify(result, null, 2);
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        // You might want to add a toast notification here
                        alert('API response copied to clipboard!');
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                  <div className="bg-gray-800 text-green-400 p-4 rounded-lg text-xs font-mono overflow-auto max-h-60">
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Add this helper function outside your component
function getSuitabilityDescription(score) {
  if (score >= 80) return 'Excellent location for dam construction';
  if (score >= 60) return 'Good location with minor considerations';
  if (score >= 40) return 'Moderate suitability, requires careful planning';
  if (score >= 20) return 'Challenging location, significant considerations needed';
  return 'Not recommended for dam construction';
}
