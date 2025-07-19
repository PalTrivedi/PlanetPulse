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
import { Loader2, CheckCircle, MapPin, Database, TrendingUp, AlertCircle, Zap, Code } from "lucide-react";
import Navbar from "@/components/Navbar";

const Services = () => {
  const [formData, setFormData] = useState({
    district: "",
    damType: "",
    maxHeight: "",
    seismicZone: "",
    elevation: "",
    length: "",
    slope: "",
    mainSoilType: "",
    secondarySoilType: "",
    rainfall2020: "",
    rainfall2021: "",
    rainfall2022: "",
    rainfall2023: "",
    rainfall2024: "",
    rainfall5YearAvg: "",
    monsoonIntensity: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  // Sample data for testing
  const sampleData = {
    district: "Ahmedabad",
    damType: "Gravity",
    maxHeight: "45.5",
    seismicZone: "3",
    elevation: "125.0",
    length: "180.0",
    slope: "12.5",
    mainSoilType: "Vertisols",
    secondarySoilType: "Cambisols",
    rainfall2020: "750.0",
    rainfall2021: "820.0",
    rainfall2022: "780.0",
    rainfall2023: "850.0",
    rainfall2024: "800.0",
    rainfall5YearAvg: "800.0",
    monsoonIntensity: "18.5",
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadSampleData = () => {
    setFormData(sampleData);
    toast({
      title: "Sample Data Loaded",
      description: "Test data has been loaded into the form.",
    });
  };

  const clearForm = () => {
    setFormData({
      district: "",
      damType: "",
      maxHeight: "",
      seismicZone: "",
      elevation: "",
      length: "",
      slope: "",
      mainSoilType: "",
      secondarySoilType: "",
      rainfall2020: "",
      rainfall2021: "",
      rainfall2022: "",
      rainfall2023: "",
      rainfall2024: "",
      rainfall5YearAvg: "",
      monsoonIntensity: "",
    });
    setPredictions(null);
    setApiResponse(null);
    toast({
      title: "Form Cleared",
      description: "All form fields have been reset.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPredictions(null);
    setApiResponse(null);

    try {
      const response = await fetch('http://localhost:8000/api/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setPredictions(data.predictions);
        setApiResponse(data);
        toast({
          title: "Prediction Successful!",
          description: `Analysis completed using ${data.prediction_method}.`,
        });
      } else {
        toast({
          title: "Prediction Failed",
          description: data.error || "An error occurred during prediction.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the prediction service.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    if (score >= 20) return "text-orange-600";
    return "text-red-600";
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Excellent': return "text-green-600 bg-green-50";
      case 'Good': return "text-blue-600 bg-blue-50";
      case 'Moderate': return "text-yellow-600 bg-yellow-50";
      case 'Poor': return "text-orange-600 bg-orange-50";
      case 'Very Poor': return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Geological Suitability Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze the geological and climatic suitability for dam construction 
            using advanced machine learning models trained on Gujarat's dam data.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Input Parameters
              </CardTitle>
              <CardDescription>
                Enter the geological and climatic parameters for analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Action Buttons */}
              <div className="flex gap-2 mb-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={loadSampleData}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Load Sample Data
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={clearForm}
                  className="flex items-center gap-2"
                >
                  Clear Form
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder="Enter district name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="damType">Dam Type</Label>
                      <Select 
                        value={formData.damType} 
                        onValueChange={(value) => handleInputChange('damType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select dam type">
                            {formData.damType || "Select dam type"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gravity">Gravity</SelectItem>
                          <SelectItem value="Arch">Arch</SelectItem>
                          <SelectItem value="Buttress">Buttress</SelectItem>
                          <SelectItem value="Embankment">Embankment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Dam Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dam Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="maxHeight">Max Height (m)</Label>
                      <Input
                        id="maxHeight"
                        type="number"
                        step="0.1"
                        value={formData.maxHeight}
                        onChange={(e) => handleInputChange('maxHeight', e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="length">Length (m)</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        value={formData.length}
                        onChange={(e) => handleInputChange('length', e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="elevation">Elevation (m)</Label>
                      <Input
                        id="elevation"
                        type="number"
                        step="0.1"
                        value={formData.elevation}
                        onChange={(e) => handleInputChange('elevation', e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Geological Parameters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Geological Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seismicZone">Seismic Zone</Label>
                      <Select 
                        value={formData.seismicZone} 
                        onValueChange={(value) => handleInputChange('seismicZone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select seismic zone">
                            {formData.seismicZone ? `Zone ${formData.seismicZone}` : "Select seismic zone"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Zone 1 (Low)</SelectItem>
                          <SelectItem value="2">Zone 2 (Low-Moderate)</SelectItem>
                          <SelectItem value="3">Zone 3 (Moderate)</SelectItem>
                          <SelectItem value="4">Zone 4 (High)</SelectItem>
                          <SelectItem value="5">Zone 5 (Very High)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="slope">Slope (degrees)</Label>
                      <Input
                        id="slope"
                        type="number"
                        step="0.1"
                        value={formData.slope}
                        onChange={(e) => handleInputChange('slope', e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="mainSoilType">Main Soil Type</Label>
                      <Select 
                        value={formData.mainSoilType} 
                        onValueChange={(value) => handleInputChange('mainSoilType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select main soil type">
                            {formData.mainSoilType || "Select main soil type"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vertisols">Vertisols</SelectItem>
                          <SelectItem value="Cambisols">Cambisols</SelectItem>
                          <SelectItem value="Luvisols">Luvisols</SelectItem>
                          <SelectItem value="Leptosols">Leptosols</SelectItem>
                          <SelectItem value="Regosols">Regosols</SelectItem>
                          <SelectItem value="Arenosols">Arenosols</SelectItem>
                          <SelectItem value="Fluvisols">Fluvisols</SelectItem>
                          <SelectItem value="Calcisols">Calcisols</SelectItem>
                          <SelectItem value="Solonchaks">Solonchaks</SelectItem>
                          <SelectItem value="Lixisols">Lixisols</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="secondarySoilType">Secondary Soil Type</Label>
                      <Select 
                        value={formData.secondarySoilType} 
                        onValueChange={(value) => handleInputChange('secondarySoilType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select secondary soil type">
                            {formData.secondarySoilType || "Select secondary soil type"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cambisols">Cambisols</SelectItem>
                          <SelectItem value="Vertisols">Vertisols</SelectItem>
                          <SelectItem value="Luvisols">Luvisols</SelectItem>
                          <SelectItem value="Leptosols">Leptosols</SelectItem>
                          <SelectItem value="Regosols">Regosols</SelectItem>
                          <SelectItem value="Arenosols">Arenosols</SelectItem>
                          <SelectItem value="Fluvisols">Fluvisols</SelectItem>
                          <SelectItem value="Calcisols">Calcisols</SelectItem>
                          <SelectItem value="Solonchaks">Solonchaks</SelectItem>
                          <SelectItem value="Lixisols">Lixisols</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Rainfall Data */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Rainfall Data (mm)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="rainfall2020">2020</Label>
                      <Input
                        id="rainfall2020"
                        type="number"
                        step="0.1"
                        value={formData.rainfall2020}
                        onChange={(e) => handleInputChange('rainfall2020', e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="rainfall2021">2021</Label>
                      <Input
                        id="rainfall2021"
                        type="number"
                        step="0.1"
                        value={formData.rainfall2021}
                        onChange={(e) => handleInputChange('rainfall2021', e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="rainfall2022">2022</Label>
                      <Input
                        id="rainfall2022"
                        type="number"
                        step="0.1"
                        value={formData.rainfall2022}
                        onChange={(e) => handleInputChange('rainfall2022', e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="rainfall2023">2023</Label>
                      <Input
                        id="rainfall2023"
                        type="number"
                        step="0.1"
                        value={formData.rainfall2023}
                        onChange={(e) => handleInputChange('rainfall2023', e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="rainfall2024">2024</Label>
                      <Input
                        id="rainfall2024"
                        type="number"
                        step="0.1"
                        value={formData.rainfall2024}
                        onChange={(e) => handleInputChange('rainfall2024', e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="rainfall5YearAvg">5-Year Avg</Label>
                      <Input
                        id="rainfall5YearAvg"
                        type="number"
                        step="0.1"
                        value={formData.rainfall5YearAvg}
                        onChange={(e) => handleInputChange('rainfall5YearAvg', e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Environmental Parameters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Environmental Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monsoonIntensity">Monsoon Intensity (mm/wet day)</Label>
                      <Input
                        id="monsoonIntensity"
                        type="number"
                        step="0.1"
                        value={formData.monsoonIntensity}
                        onChange={(e) => handleInputChange('monsoonIntensity', e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Analyze Suitability
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {predictions ? (
              <>
                {/* Prediction Method */}
                <Card className="shadow-lg border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Code className="h-5 w-5" />
                      Analysis Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 font-medium">
                      {apiResponse?.prediction_method || "Unknown Method"}
                    </p>
                  </CardContent>
                </Card>

                {/* Geological Suitability */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Geological Suitability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Score:</span>
                        <span className={`text-2xl font-bold ${getScoreColor(predictions.geological_suitability.score)}`}>
                          {predictions.geological_suitability.score}/100
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Level:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(predictions.geological_suitability.level)}`}>
                          {predictions.geological_suitability.level}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {predictions.geological_suitability.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Climatic Effects */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Climatic Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Score:</span>
                        <span className={`text-2xl font-bold ${getScoreColor(predictions.climatic_effects.score)}`}>
                          {predictions.climatic_effects.score}/100
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Level:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(predictions.climatic_effects.level)}`}>
                          {predictions.climatic_effects.level}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {predictions.climatic_effects.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* API Response */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Full API Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-64">
                      <pre className="text-xs">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Overall Assessment */}
                <Card className="shadow-lg border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      Analysis Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700">
                      Both geological and climatic analyses have been completed successfully. 
                      Review the scores and recommendations above for your dam construction project.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-lg border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Fill out the form and click "Analyze Suitability" to get predictions
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 