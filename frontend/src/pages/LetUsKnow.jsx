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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Send } from "lucide-react";
import Navbar from "@/components/Navbar";

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const LetUsKnow = () => {
  const [activeTab, setActiveTab] = useState("dam-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [formData, setFormData] = useState({
    damName: "",
    submitterName: "",
    submitterEmail: "",
    location: "",
    latitude: "",
    longitude: "",
    river: "",
    capacity: "",
    type: "",
    yearBuilt: "",
    purpose: "",
    height: "",
    additionalInfo: "",
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeedbackChange = (field, value) => {
    setFeedbackData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!feedbackData.name || !feedbackData.email || !feedbackData.message) {
        throw new Error("Please fill in all required fields");
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate you taking the time to share your thoughts with us.",
      });
      
      // Reset form
      setFeedbackData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData.damName || !formData.submitterName || !formData.submitterEmail) {
        throw new Error("Please fill in all required fields");
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Thank you!",
        description: "Your dam information has been submitted for review.",
      });
      
      // Reset form
      setFormData({
        damName: "",
        submitterName: "",
        submitterEmail: "",
        location: "",
        latitude: "",
        longitude: "",
        river: "",
        capacity: "",
        type: "",
        yearBuilt: "",
        purpose: "",
        height: "",
        additionalInfo: "",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Let Us Know
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Share your feedback or help us expand our dam database with new information
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dam-info">Report a Dam</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Share Your Feedback</CardTitle>
                <CardDescription>
                  We'd love to hear your thoughts, suggestions, or concerns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={feedbackData.name}
                        onChange={(e) => handleFeedbackChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={feedbackData.email}
                        onChange={(e) => handleFeedbackChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      value={feedbackData.subject}
                      onChange={(e) => handleFeedbackChange("subject", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Share your thoughts with us..."
                      className="min-h-[150px]"
                      value={feedbackData.message}
                      onChange={(e) => handleFeedbackChange("message", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          Send Feedback
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dam-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Submit Dam Information</CardTitle>
                <CardDescription>
                  Help us expand our database by submitting information about a dam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Row 1 */}
                    <div className="space-y-2">
                      <Label htmlFor="damName">Dam Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="damName"
                        placeholder="Enter dam name"
                        value={formData.damName}
                        onChange={(e) => handleInputChange('damName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submitterName">Your Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="submitterName"
                        placeholder="Enter your name"
                        value={formData.submitterName}
                        onChange={(e) => handleInputChange('submitterName', e.target.value)}
                        required
                      />
                    </div>

                    {/* Row 2 */}
                    <div className="space-y-2">
                      <Label htmlFor="submitterEmail">Your Email <span className="text-red-500">*</span></Label>
                      <Input
                        id="submitterEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.submitterEmail}
                        onChange={(e) => handleInputChange('submitterEmail', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Enter location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    </div>

                    {/* Row 3 */}
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        placeholder="Enter latitude"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        placeholder="Enter longitude"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                      />
                    </div>

                    {/* Row 4 */}
                    <div className="space-y-2">
                      <Label htmlFor="river">River</Label>
                      <Input
                        id="river"
                        placeholder="Enter river name"
                        value={formData.river}
                        onChange={(e) => handleInputChange('river', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity (MCM)</Label>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="Enter capacity"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange('capacity', e.target.value)}
                      />
                    </div>

                    {/* Row 5 */}
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleInputChange('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gravity">Gravity</SelectItem>
                          <SelectItem value="arch">Arch</SelectItem>
                          <SelectItem value="embankment">Embankment</SelectItem>
                          <SelectItem value="buttress">Buttress</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearBuilt">Year Built</Label>
                      <Input
                        id="yearBuilt"
                        type="number"
                        placeholder="Enter year built"
                        value={formData.yearBuilt}
                        onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                      />
                    </div>

                    {/* Row 6 */}
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose</Label>
                      <Select
                        value={formData.purpose}
                        onValueChange={(value) => handleInputChange('purpose', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="irrigation">Irrigation</SelectItem>
                          <SelectItem value="hydroelectric">Hydroelectric</SelectItem>
                          <SelectItem value="water-supply">Water Supply</SelectItem>
                          <SelectItem value="flood-control">Flood Control</SelectItem>
                          <SelectItem value="recreation">Recreation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">Height (meters)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="Enter height"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Any additional details about the dam"
                      className="min-h-[100px]"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Information
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LetUsKnow;