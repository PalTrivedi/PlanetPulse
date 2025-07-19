import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, MapPin, Database, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";

const Services = () => {
  const [formData, setFormData] = useState({
    district: "",
    damType: "",
    maxHeight: "",
    seismicZone: "",
    secondarySoilType: "",
    riverFlowRate: "",
    rainfall2021: "",
    rainfall2023: "",
    rainfall5yrAvg: "",
    elevation: "",
    length: "",
    slope: "",
    mainSoilType: "",
    riverDistance: "",
    rainfall2020: "",
    rainfall2022: "",
    rainfall2024: "",
    monsoonIntensityAvg: "",
    avgNdvi: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would make the actual API call to your Django backend
      // const response = await fetch('your-django-backend-url/analyze', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();

      // Simulating API call for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock result
      const mockScore = Math.floor(Math.random() * 40) + 60; // Score between 60-100
      setResult({
        score: mockScore,
        analysis: `Based on the geological analysis, this location shows ${
          mockScore >= 80 ? "excellent" : mockScore >= 70 ? "good" : "moderate"
        } suitability for dam construction.`,
      });

      toast({
        title: "Analysis Complete",
        description:
          "Geological suitability analysis has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to analyze geological suitability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Geological Analysis Services
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in">
            Get comprehensive geological suitability analysis for your dam
            construction projects using advanced ML models
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-800">
                Project Analysis Form
              </CardTitle>
              <CardDescription>
                Enter your project details to get a geological suitability score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => handleInputChange("district", e.target.value)}
                        placeholder="Enter district"
                      />
                    </div>

                    <div>
                      <Label htmlFor="damType">Dam Type</Label>
                      <Select value={formData.damType} onValueChange={(value) => handleInputChange("damType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dam type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gravity">Gravity Dam</SelectItem>
                          <SelectItem value="arch">Arch Dam</SelectItem>
                          <SelectItem value="embankment">Embankment Dam</SelectItem>
                          <SelectItem value="buttress">Buttress Dam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="maxHeight">Max Height above Foundation (m)</Label>
                      <Input
                        id="maxHeight"
                        type="number"
                        value={formData.maxHeight}
                        onChange={(e) => handleInputChange("maxHeight", e.target.value)}
                        placeholder="Enter height"
                      />
                    </div>

                    <div>
                      <Label htmlFor="seismicZone">Seismic Zone</Label>
                      <Select value={formData.seismicZone} onValueChange={(value) => handleInputChange("seismicZone", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select seismic zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zone1">Zone I</SelectItem>
                          <SelectItem value="zone2">Zone II</SelectItem>
                          <SelectItem value="zone3">Zone III</SelectItem>
                          <SelectItem value="zone4">Zone IV</SelectItem>
                          <SelectItem value="zone5">Zone V</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="secondarySoilType">Secondary Soil Type</Label>
                      <Input
                        id="secondarySoilType"
                        value={formData.secondarySoilType}
                        onChange={(e) => handleInputChange("secondarySoilType", e.target.value)}
                        placeholder="Enter soil type"
                      />
                    </div>

                    <div>
                      <Label htmlFor="riverFlowRate">River Flow Rate (m/day)</Label>
                      <Input
                        id="riverFlowRate"
                        type="number"
                        value={formData.riverFlowRate}
                        onChange={(e) => handleInputChange("riverFlowRate", e.target.value)}
                        placeholder="Enter flow rate"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rainfall2021">Rainfall 2021 (mm)</Label>
                      <Input
                        id="rainfall2021"
                        type="number"
                        value={formData.rainfall2021}
                        onChange={(e) => handleInputChange("rainfall2021", e.target.value)}
                        placeholder="Enter rainfall"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rainfall2023">Rainfall 2023 (mm)</Label>
                      <Input
                        id="rainfall2023"
                        type="number"
                        value={formData.rainfall2023}
                        onChange={(e) => handleInputChange("rainfall2023", e.target.value)}
                        placeholder="Enter rainfall"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rainfall5yrAvg">5-Year Rainfall Average (mm)</Label>
                      <Input
                        id="rainfall5yrAvg"
                        type="number"
                        value={formData.rainfall5yrAvg}
                        onChange={(e) => handleInputChange("rainfall5yrAvg", e.target.value)}
                        placeholder="Enter average"
                      />
                    </div>

                    <div>
                      <Label htmlFor="avgNdvi">Avg NDVI Last 5 Years</Label>
                      <Input
                        id="avgNdvi"
                        type="number"
                        step="0.01"
                        value={formData.avgNdvi}
                        onChange={(e) => handleInputChange("avgNdvi", e.target.value)}
                        placeholder="Enter NDVI value"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="elevation">Elevation (m)</Label>
                      <Input
                        id="elevation"
                        type="number"
                        value={formData.elevation}
                        onChange={(e) => handleInputChange("elevation", e.target.value)}
                        placeholder="Enter elevation"
                      />
                    </div>

                    <div>
                      <Label htmlFor="length">Length (m)</Label>
                      <Input
                        id="length"
                        type="number"
                        value={formData.length}
                        onChange={(e) => handleInputChange("length", e.target.value)}
                        placeholder="Enter length"
                      />
                    </div>

                    <div>
                      <Label htmlFor="slope">Slope (%)</Label>
                      <Input
                        id="slope"
                        type="number"
                        step="0.1"
                        value={formData.slope}
                        onChange={(e) => handleInputChange("slope", e.target.value)}
                        placeholder="Enter slope"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mainSoilType">Main Soil Type</Label>
                      <Input
                        id="mainSoilType"
                        value={formData.mainSoilType}
                        onChange={(e) => handleInputChange("mainSoilType", e.target.value)}
                        placeholder="Enter soil type"
                      />
                    </div>

                    <div>
                      <Label htmlFor="riverDistance">River Distance (km)</Label>
                      <Input
                        id="riverDistance"
                        type="number"
                        step="0.1"
                        value={formData.riverDistance}
                        onChange={(e) => handleInputChange("riverDistance", e.target.value)}
                        placeholder="Enter distance"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rainfall2020">Rainfall 2020 (mm)</Label>
                      <Input
                        id="rainfall2020"
                        type="number"
                        value={formData.rainfall2020}
                        onChange={(e) => handleInputChange("rainfall2020", e.target.value)}
                        placeholder="Enter rainfall"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rainfall2022">Rainfall 2022 (mm)</Label>
                      <Input
                        id="rainfall2022"
                        type="number"
                        value={formData.rainfall2022}
                        onChange={(e) => handleInputChange("rainfall2022", e.target.value)}
                        placeholder="Enter rainfall"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rainfall2024">Rainfall 2024 (mm)</Label>
                      <Input
                        id="rainfall2024"
                        type="number"
                        value={formData.rainfall2024}
                        onChange={(e) => handleInputChange("rainfall2024", e.target.value)}
                        placeholder="Enter rainfall"
                      />
                    </div>

                    <div>
                      <Label htmlFor="monsoonIntensityAvg">Monsoon Intensity Avg (mm/wet_day)</Label>
                      <Input
                        id="monsoonIntensityAvg"
                        type="number"
                        step="0.1"
                        value={formData.monsoonIntensityAvg}
                        onChange={(e) => handleInputChange("monsoonIntensityAvg", e.target.value)}
                        placeholder="Enter intensity"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Geological Suitability"
                    )}
                  </Button>
                </div>
              </form>

              {result && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-green-800">
                      Analysis Complete
                    </h3>
                  </div>
                  <p className="text-green-700 mb-2">
                    <strong>Suitability Score: {result.score}/100</strong>
                  </p>
                  <p className="text-green-700">{result.analysis}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* How It Works Section */}
          <div className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-800">
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      1. Data Collection
                    </h3>
                    <p className="text-gray-600">
                      Enter comprehensive geological and environmental data
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      2. ML Analysis
                    </h3>
                    <p className="text-gray-600">
                      Advanced machine learning models process your data
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      3. Suitability Score
                    </h3>
                    <p className="text-gray-600">
                      Receive a comprehensive geological suitability assessment
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl text-amber-800">
                  What We Analyze
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Geological composition and soil types</li>
                  <li>• Seismic activity and fault lines</li>
                  <li>• Hydrological patterns and river flow</li>
                  <li>• Climate data and rainfall patterns</li>
                  <li>• Topographical features and elevation</li>
                  <li>• Environmental impact factors</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 