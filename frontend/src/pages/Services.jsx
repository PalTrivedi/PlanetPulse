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
import Navbar from "@/components/Navbar";

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
      <div className="bg-gradient-to-r from-primary to-secondary py-20 mt-16">
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
                {/* ...form fields as in the original file, but without TypeScript types... */}
              </form>
            </CardContent>
          </Card>
          {/* ...rest of the component remains unchanged, just remove TypeScript types... */}
        </div>
      </div>
    </div>
  );
};

export default Services; 