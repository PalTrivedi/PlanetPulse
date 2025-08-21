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
import { Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Helper function to get CSRF token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const API_BASE_URL = "http://localhost:8000/api"; // <-- Change this to your backend URL

const LetUsKnow = () => {
  const [activeTab, setActiveTab] = useState("dam-info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeedbackChange = (field, value) => {
    setFeedbackData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!feedbackData.name || !feedbackData.email || !feedbackData.message) {
        throw new Error("Please fill in all required fields");
      }

      const response = await fetch(`${API_BASE_URL}/feedback/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          name: feedbackData.name,
          email: feedbackData.email,
          feedback: feedbackData.message,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Something went wrong.");
      }

      toast({
        title: "Thank you for your feedback!",
        description:
          "We appreciate you taking the time to share your thoughts with us.",
      });

      setFeedbackData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback.",
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
      if (
        !formData.damName ||
        !formData.submitterName ||
        !formData.submitterEmail
      ) {
        throw new Error("Please fill in all required fields");
      }

      const response = await fetch(`${API_BASE_URL}/letusknow/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          name: formData.submitterName,
          email: formData.submitterEmail,
          organization: formData.damName,
          message: formData.additionalInfo || "No additional info provided.",
        }),
      });

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Something went wrong.");
      }

      toast({
        title: "Thank you!",
        description: "Your dam information has been submitted for review.",
      });

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
        description: error.message || "Failed to submit form.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Let Us Know
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Share your feedback or help us expand our dam database with new
            information
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dam-info">Report a Dam</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Feedback Form */}
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
                        onChange={(e) =>
                          handleFeedbackChange("name", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleFeedbackChange("email", e.target.value)
                        }
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
                      onChange={(e) =>
                        handleFeedbackChange("subject", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Share your thoughts with us..."
                      className="min-h-[150px]"
                      value={feedbackData.message}
                      onChange={(e) =>
                        handleFeedbackChange("message", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Feedback"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dam Info Form */}
          <TabsContent value="dam-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Submit Dam Information</CardTitle>
                <CardDescription>
                  Help us expand our database by submitting information about a
                  dam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Dam Name *</Label>
                      <Input
                        value={formData.damName}
                        onChange={(e) =>
                          handleInputChange("damName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Your Name *</Label>
                      <Input
                        value={formData.submitterName}
                        onChange={(e) =>
                          handleInputChange("submitterName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Your Email *</Label>
                      <Input
                        type="email"
                        value={formData.submitterEmail}
                        onChange={(e) =>
                          handleInputChange("submitterEmail", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Information</Label>
                    <Textarea
                      value={formData.additionalInfo}
                      onChange={(e) =>
                        handleInputChange("additionalInfo", e.target.value)
                      }
                      placeholder="Add any relevant details you may have..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Dam Info"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer/>
    </div>
  );
};

export default LetUsKnow;
