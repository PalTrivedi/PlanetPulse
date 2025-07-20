import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Award, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-20 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            About PlanetPulse
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in">
            Leading the future of geological analysis with cutting-edge technology and expertise
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Our Motto Section */}
        <section className="mb-16 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Motto</h2>
            <div className="bg-secondary/20 rounded-lg p-8 max-w-4xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-semibold text-foreground italic mb-4">
                "Empowering sustainable infrastructure through intelligent geological insights"
              </blockquote>
              <p className="text-lg text-muted-foreground">
                We believe that every great structure begins with understanding the earth beneath it. 
                Our mission is to provide comprehensive, accurate, and actionable geological analysis 
                that enables engineers and planners to build with confidence and sustainability.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="mb-16 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  PlanetPulse was born from a vision to revolutionize how we understand and interact 
                  with our planet's geological systems. Founded in 2020 by a team of geologists, 
                  data scientists, and engineers, we recognized the critical need for advanced 
                  analytical tools in infrastructure development.
                </p>
                <p>
                  After witnessing numerous construction delays and failures due to inadequate 
                  geological assessment, our founders set out to create a comprehensive platform 
                  that combines traditional geological expertise with modern machine learning 
                  capabilities.
                </p>
                <p>
                  Today, PlanetPulse serves as a trusted partner for construction companies, 
                  government agencies, and environmental consultants across India, providing 
                  them with the insights needed to make informed decisions about their projects.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Projects Analyzed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Expert Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-scale">
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Precision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  We deliver highly accurate geological assessments using state-of-the-art technology 
                  and rigorous validation processes.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  We work closely with our clients, understanding their unique needs and providing 
                  tailored solutions that exceed expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  We maintain the highest standards in all our work, continuously improving our 
                  methods and staying at the forefront of geological science.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  We promote environmentally responsible development by providing insights that 
                  minimize ecological impact while maximizing project success.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">Our Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Geological Engineering</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our team includes certified geological engineers with decades of experience 
                  in soil mechanics, rock engineering, and foundation design.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Data Science & AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We leverage advanced machine learning algorithms and big data analytics 
                  to provide predictive insights and comprehensive risk assessments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Environmental Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our environmental specialists ensure that all assessments consider ecological 
                  factors, helping clients build responsibly and sustainably.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technology Section */}
        <section className="animate-fade-in">
          <div className="bg-secondary/20 rounded-lg p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-8">Our Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Advanced ML Models</h3>
                <p className="text-muted-foreground mb-4">
                  Our proprietary machine learning models are trained on thousands of geological 
                  samples and historical data points, enabling us to predict geological suitability 
                  with unprecedented accuracy.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Real-time Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Get instant results with our cloud-based analysis platform that processes 
                  complex geological data in real-time, helping you make faster decisions.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Comprehensive Database</h3>
                <p className="text-muted-foreground mb-4">
                  Access to extensive geological databases including soil types, seismic data, 
                  rainfall patterns, and environmental factors across multiple regions.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Interactive Visualization</h3>
                <p className="text-muted-foreground mb-4">
                  Explore geological data through interactive maps and visualizations that 
                  make complex information easy to understand and act upon.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 