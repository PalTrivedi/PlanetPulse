import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Navbar from "@/components/Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would send the contact form to your backend
    toast({
      title: "Message Sent",
      description:
        "Thank you for contacting us! We'll get back to you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-20 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in">
            Get in touch with our geological analysis experts. We're here to
            help with your project needs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
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
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    placeholder="What can we help you with?"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    placeholder="Please describe your project or inquiry in detail..."
                    className="min-h-32"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-muted-foreground">
                      officialplanetpulse@gmail.com
                    </p>
                    {/* <p className="text-muted-foreground">
                      officialplanetpulse@gmail.com
                    </p> */}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-muted-foreground">+91 9876 543 210</p>
                    <p className="text-muted-foreground">
                      +91 9876 543 211 (Support)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Visit Us</h3>
                    <p className="text-muted-foreground">
                      PlanetPulse Technologies Pvt. Ltd.
                      <br />
                      123 Geological Sciences Complex
                      <br />
                      Ahmedabad, Gujarat 380015
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">
                  Need Immediate Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For urgent technical support or emergency geological
                  consultations, please call our 24/7 hotline:
                </p>
                <div className="bg-secondary/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    +91 9876 000 911
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Emergency Support Line
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Regional Offices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Mumbai Office</h4>
                  <p className="text-sm text-muted-foreground">
                    456 Business District, Mumbai 400001
                  </p>
                </div>
                {/* Add more offices as needed */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 