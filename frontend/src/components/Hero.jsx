import { ArrowRight, MapPin, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Hero = () => {
  const features = [
    {
      icon: MapPin,
      title: "Geological Mapping",
      description: "Advanced terrain analysis and geological surveys",
    },
    {
      icon: BarChart3,
      title: "Suitability Analysis",
      description: "Data-driven land suitability assessments",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Comprehensive geological risk evaluation",
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-7xl mx-auto text-center">
        {/* Hero Content */}
        <div className="fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-geological-green bg-clip-text text-transparent">
            PlanetPulse
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Geological Suitability Analyzer
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Advanced geological analysis and terrain assessment for informed
            decision-making. Explore Gujarat's water infrastructure and
            geological features with our interactive mapping system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="group">
              Explore Gujarat Dams
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 slide-up">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow duration-300 bg-card/50 backdrop-blur-sm border-border/50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 scale-in">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              25+
            </div>
            <div className="text-sm text-muted-foreground">Major Dams</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
              500+
            </div>
            <div className="text-sm text-muted-foreground">
              Surveys Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-geological-green mb-2">
              98%
            </div>
            <div className="text-sm text-muted-foreground">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-water-blue mb-2">
              24/7
            </div>
            <div className="text-sm text-muted-foreground">Monitoring</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 