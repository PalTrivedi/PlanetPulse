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
import { MessageSquare, MapPin, Send } from "lucide-react";

const LetUsKnow = () => {
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    feedbackType: "",
    subject: "",
    message: "",
    rating: "",
  });

  const [damForm, setDamForm] = useState({
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

  const handleFeedbackChange = (field: string, value: string) => {
    setFeedbackForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDamInfoChange = (field: string, value: string) => {
    setDamForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the feedback to your backend
    toast({
      title: "Feedback Submitted",
      description:
        "Thank you for your feedback! We'll review it and get back to you if needed.",
    });
    setFeedbackForm({
      name: "",
      email: "",
      feedbackType: "",
      subject: "",
      message: "",
      rating: "",
    });
  };

  const handleDamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the dam information to your backend for verification
    toast({
      title: "Dam Information Submitted",
      description:
        "Thank you for the dam information! Our team will verify and add it to our database.",
    });
    setDamForm({
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
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Let Us Know
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in">
            Share your feedback or help us expand our dam database with new
            information
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <Tabs defaultValue="feedback" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="dam-info" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Dam Information
            </TabsTrigger>
          </TabsList>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <MessageSquare className="h-6 w-6" />
                  Share Your Feedback
                </CardTitle>
                <CardDescription>
                  Help us improve PlanetPulse by sharing your experience,
                  suggestions, or reporting issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="feedback-name">Name</Label>
                      <Input
                        id="feedback-name"
                        value={feedbackForm.name}
                        onChange={(e) =>
                          handleFeedbackChange("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="feedback-email">Email</Label>
                      <Input
                        id="feedback-email"
                        type="email"
                        value={feedbackForm.email}
                        onChange={(e) =>
                          handleFeedbackChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="feedback-type">Feedback Type</Label>
                      <Select
                        onValueChange={(value) =>
                          handleFeedbackChange("feedbackType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="suggestion">Suggestion</SelectItem>
                          <SelectItem value="bug-report">Bug Report</SelectItem>
                          <SelectItem value="feature-request">
                            Feature Request
                          </SelectItem>
                          <SelectItem value="general">
                            General Feedback
                          </SelectItem>
                          <SelectItem value="compliment">Compliment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rating">Overall Rating</Label>
                      <Select
                        onValueChange={(value) =>
                          handleFeedbackChange("rating", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Rate your experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">
                            ⭐⭐⭐⭐⭐ Excellent
                          </SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                          <SelectItem value="2">⭐⭐ Poor</SelectItem>
                          <SelectItem value="1">⭐ Very Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={feedbackForm.subject}
                      onChange={(e) =>
                        handleFeedbackChange("subject", e.target.value)
                      }
                      placeholder="Brief description of your feedback"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={feedbackForm.message}
                      onChange={(e) =>
                        handleFeedbackChange("message", e.target.value)
                      }
                      placeholder="Please provide detailed feedback..."
                      className="min-h-32"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dam Information Tab */}
          <TabsContent value="dam-info">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <MapPin className="h-6 w-6" />
                  Submit Dam Information
                </CardTitle>
                <CardDescription>
                  Help us expand our database by providing information about
                  dams not yet in our system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDamSubmit} className="space-y-6">
                  <div className="bg-secondary/20 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-2">
                      Submission Guidelines
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>
                        • Provide accurate information to the best of your
                        knowledge
                      </li>
                      <li>
                        • All submissions will be verified by our team before
                        being added
                      </li>
                      <li>• Include reliable sources if possible</li>
                      <li>• We may contact you for additional information</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dam-name">Dam Name</Label>
                      <Input
                        id="dam-name"
                        value={damForm.damName}
                        onChange={(e) =>
                          handleDamInfoChange("damName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={damForm.location}
                        onChange={(e) =>
                          handleDamInfoChange("location", e.target.value)
                        }
                        placeholder="City, District, State"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dam-submitter-name">Your Name</Label>
                      <Input
                        id="dam-submitter-name"
                        value={damForm.submitterName}
                        onChange={(e) =>
                          handleDamInfoChange("submitterName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dam-submitter-email">Your Email</Label>
                      <Input
                        id="dam-submitter-email"
                        type="email"
                        value={damForm.submitterEmail}
                        onChange={(e) =>
                          handleDamInfoChange("submitterEmail", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dam-latitude">Latitude</Label>
                      <Input
                        id="dam-latitude"
                        type="number"
                        step="any"
                        value={damForm.latitude}
                        onChange={(e) =>
                          handleDamInfoChange("latitude", e.target.value)
                        }
                        placeholder="e.g., 22.5726"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dam-longitude">Longitude</Label>
                      <Input
                        id="dam-longitude"
                        type="number"
                        step="any"
                        value={damForm.longitude}
                        onChange={(e) =>
                          handleDamInfoChange("longitude", e.target.value)
                        }
                        placeholder="e.g., 71.5940"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dam-river">River</Label>
                      <Input
                        id="dam-river"
                        value={damForm.river}
                        onChange={(e) =>
                          handleDamInfoChange("river", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dam-capacity">Capacity</Label>
                      <Input
                        id="dam-capacity"
                        value={damForm.capacity}
                        onChange={(e) =>
                          handleDamInfoChange("capacity", e.target.value)
                        }
                        placeholder="e.g., 2.5 BCM"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dam-type">Dam Type</Label>
                      <Select
                        onValueChange={(value) =>
                          handleDamInfoChange("type", value)
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
                          <SelectItem value="arch">Arch</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="year-built">Year Built/Completed</Label>
                      <Input
                        id="year-built"
                        type="number"
                        value={damForm.yearBuilt}
                        onChange={(e) =>
                          handleDamInfoChange("yearBuilt", e.target.value)
                        }
                        placeholder="e.g., 1985"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dam-purpose">Purpose</Label>
                      <Input
                        id="dam-purpose"
                        value={damForm.purpose}
                        onChange={(e) =>
                          handleDamInfoChange("purpose", e.target.value)
                        }
                        placeholder="e.g., Irrigation, Hydropower"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dam-height">Height</Label>
                      <Input
                        id="dam-height"
                        value={damForm.height}
                        onChange={(e) =>
                          handleDamInfoChange("height", e.target.value)
                        }
                        placeholder="e.g., 65 meters"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="additional-info">
                      Additional Information
                    </Label>
                    <Textarea
                      id="additional-info"
                      value={damForm.additionalInfo}
                      onChange={(e) =>
                        handleDamInfoChange("additionalInfo", e.target.value)
                      }
                      placeholder="Any additional details, sources, or notes about this dam..."
                      className="min-h-24"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Dam Information
                  </Button>
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
