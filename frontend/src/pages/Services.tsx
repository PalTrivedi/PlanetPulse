import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, CheckCircle } from "lucide-react";

const Services = () => {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    purpose: "",
    river: "",
    nearestCity: "",
    district: "",
    elevation: "",
    monsoonIntensity: "",
    type: "",
    length: "",
    maxHeight: "",
    slope: "",
    seismicZone: "",
    soilTypeMain: "",
    soilTypeSecondary: "",
    nearestRiver: "",
    riverDistance: "",
    riverFlowRate: "",
    rainfall2020: "",
    rainfall2021: "",
    rainfall2022: "",
    rainfall2023: "",
    rainfall2024: "",
    rainfall5yrAvg: "",
    monsoonIntensityAvg: "",
    avgNdvi: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    analysis: string;
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-20">
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
              <CardTitle className="text-2xl text-primary">
                Project Analysis Form
              </CardTitle>
              <CardDescription>
                Enter your project details to get a geological suitability score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) =>
                        handleInputChange("latitude", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) =>
                        handleInputChange("longitude", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("purpose", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="irrigation">Irrigation</SelectItem>
                        <SelectItem value="hydropower">Hydropower</SelectItem>
                        <SelectItem value="water-supply">
                          Water Supply
                        </SelectItem>
                        <SelectItem value="flood-control">
                          Flood Control
                        </SelectItem>
                        <SelectItem value="multipurpose">
                          Multipurpose
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="river">River</Label>
                    <Input
                      id="river"
                      value={formData.river}
                      onChange={(e) =>
                        handleInputChange("river", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nearestCity">Nearest City</Label>
                    <Input
                      id="nearestCity"
                      value={formData.nearestCity}
                      onChange={(e) =>
                        handleInputChange("nearestCity", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) =>
                        handleInputChange("district", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="elevation">Elevation (m)</Label>
                    <Input
                      id="elevation"
                      type="number"
                      value={formData.elevation}
                      onChange={(e) =>
                        handleInputChange("elevation", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Dam Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select dam type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concrete-gravity">
                          Concrete Gravity
                        </SelectItem>
                        <SelectItem value="earth-fill">Earth Fill</SelectItem>
                        <SelectItem value="rock-fill">Rock Fill</SelectItem>
                        <SelectItem value="composite">Composite</SelectItem>
                        <SelectItem value="masonry">Masonry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="length">Length (m)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={formData.length}
                      onChange={(e) =>
                        handleInputChange("length", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxHeight">
                      Max Height above Foundation (m)
                    </Label>
                    <Input
                      id="maxHeight"
                      type="number"
                      value={formData.maxHeight}
                      onChange={(e) =>
                        handleInputChange("maxHeight", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slope">Slope (%)</Label>
                    <Input
                      id="slope"
                      type="number"
                      step="0.1"
                      value={formData.slope}
                      onChange={(e) =>
                        handleInputChange("slope", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="seismicZone">Seismic Zone</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("seismicZone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select seismic zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zone-1">Zone I</SelectItem>
                        <SelectItem value="zone-2">Zone II</SelectItem>
                        <SelectItem value="zone-3">Zone III</SelectItem>
                        <SelectItem value="zone-4">Zone IV</SelectItem>
                        <SelectItem value="zone-5">Zone V</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="soilTypeMain">Main Soil Type</Label>
                    <Input
                      id="soilTypeMain"
                      value={formData.soilTypeMain}
                      onChange={(e) =>
                        handleInputChange("soilTypeMain", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="soilTypeSecondary">
                      Secondary Soil Type
                    </Label>
                    <Input
                      id="soilTypeSecondary"
                      value={formData.soilTypeSecondary}
                      onChange={(e) =>
                        handleInputChange("soilTypeSecondary", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="riverDistance">River Distance (km)</Label>
                    <Input
                      id="riverDistance"
                      type="number"
                      step="0.1"
                      value={formData.riverDistance}
                      onChange={(e) =>
                        handleInputChange("riverDistance", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="riverFlowRate">
                      River Flow Rate (m/day)
                    </Label>
                    <Input
                      id="riverFlowRate"
                      type="number"
                      step="0.1"
                      value={formData.riverFlowRate}
                      onChange={(e) =>
                        handleInputChange("riverFlowRate", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rainfall2020">Rainfall 2020 (mm)</Label>
                    <Input
                      id="rainfall2020"
                      type="number"
                      value={formData.rainfall2020}
                      onChange={(e) =>
                        handleInputChange("rainfall2020", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rainfall2021">Rainfall 2021 (mm)</Label>
                    <Input
                      id="rainfall2021"
                      type="number"
                      value={formData.rainfall2021}
                      onChange={(e) =>
                        handleInputChange("rainfall2021", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rainfall2022">Rainfall 2022 (mm)</Label>
                    <Input
                      id="rainfall2022"
                      type="number"
                      value={formData.rainfall2022}
                      onChange={(e) =>
                        handleInputChange("rainfall2022", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rainfall2023">Rainfall 2023 (mm)</Label>
                    <Input
                      id="rainfall2023"
                      type="number"
                      value={formData.rainfall2023}
                      onChange={(e) =>
                        handleInputChange("rainfall2023", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rainfall2024">Rainfall 2024 (mm)</Label>
                    <Input
                      id="rainfall2024"
                      type="number"
                      value={formData.rainfall2024}
                      onChange={(e) =>
                        handleInputChange("rainfall2024", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rainfall5yrAvg">
                      5-Year Rainfall Average (mm)
                    </Label>
                    <Input
                      id="rainfall5yrAvg"
                      type="number"
                      step="0.1"
                      value={formData.rainfall5yrAvg}
                      onChange={(e) =>
                        handleInputChange("rainfall5yrAvg", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="monsoonIntensityAvg">
                      Monsoon Intensity Avg (mm/wet_day)
                    </Label>
                    <Input
                      id="monsoonIntensityAvg"
                      type="number"
                      step="0.1"
                      value={formData.monsoonIntensityAvg}
                      onChange={(e) =>
                        handleInputChange("monsoonIntensityAvg", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="avgNdvi">Avg NDVI Last 5 Years</Label>
                    <Input
                      id="avgNdvi"
                      type="number"
                      step="0.001"
                      value={formData.avgNdvi}
                      onChange={(e) =>
                        handleInputChange("avgNdvi", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Geological Suitability"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <Card className="animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-6 w-6" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold text-primary mb-2">
                      {result.score}
                    </div>
                    <div className="text-lg text-muted-foreground">
                      Geological Suitability Score
                    </div>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-center">{result.analysis}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Data Collection</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter comprehensive geological and environmental data
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">ML Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced machine learning models process your data
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Suitability Score</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive a comprehensive geological suitability assessment
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
