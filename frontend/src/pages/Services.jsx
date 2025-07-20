import React, { useState, useEffect } from "react";
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
  });

  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);

  // Sample data for testing
  const sampleData = {
    district: "Ahmedabad",
    damType: "Gravity",
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
    });
    setPredictions(null);
    toast({
      title: "Form Cleared",
      description: "All form fields have been reset.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPredictions(null);

    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock predictions
      const mockPredictions = {
        geological_suitability: {
          score: 75.5,
          level: "Good",
          description: "Good geological conditions with manageable risks for dam construction."
        },
        climatic_effects: {
          score: 68.2,
          level: "Moderate",
          description: "Moderate climatic conditions with some seasonal variations."
        }
      };
      
      setPredictions(mockPredictions);
      toast({
        title: "Analysis Complete!",
        description: "Geological suitability analysis has been completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during the analysis.",
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
    <div className="min-h-screen bg-[#f5f5dc]">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-[#8B4513] py-16 mt-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Geological Analysis Services
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Get comprehensive geological suitability analysis for your dam construction projects using advanced ML models
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <Card className="shadow-lg bg-white border-0">
            <CardHeader className="bg-[#8B4513] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <Database className="h-5 w-5" />
                Project Analysis Form
              </CardTitle>
              <CardDescription className="text-white/90">
                Enter your project details to get a geological suitability score
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
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
                  <h3 className="text-lg font-semibold text-[#8B4513] border-b border-[#8B4513]/20 pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold bg-[#8B4513] hover:bg-[#8B4513]/90 text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Analyze Suitability
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* How It Works Section */}
          <Card className="shadow-lg bg-white border-0">
            <CardHeader className="bg-[#8B4513] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertCircle className="h-5 w-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#8B4513] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#8B4513] mb-1">Data Collection</h3>
                    <p className="text-gray-600 text-sm">Enter comprehensive geological and environmental data</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#8B4513] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#8B4513] mb-1">ML Analysis</h3>
                    <p className="text-gray-600 text-sm">Advanced machine learning models process your data</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#8B4513] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#8B4513] mb-1">Suitability Score</h3>
                    <p className="text-gray-600 text-sm">Receive a comprehensive geological suitability assessment</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section - Only show when predictions are available */}
        {predictions && (
          <div className="mt-8 max-w-4xl mx-auto">
            <Card className="shadow-lg bg-white border-0">
              <CardHeader className="bg-[#8B4513] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Geological Suitability</h3>
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
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {predictions.geological_suitability.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Climatic Effects</h3>
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
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {predictions.climatic_effects.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services; 