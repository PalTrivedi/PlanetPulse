import GujaratMap from "./GujaratMap";
import { Card } from "@/components/ui/card";
import { MapPin, Droplets, Info } from "lucide-react";

const MapSection = () => {
  return (
    <section id="home" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gujarat Water Infrastructure
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore the comprehensive network of dams across Gujarat state.
            Click on any marker to discover detailed information about each
            dam's specifications, capacity, and geological significance.
          </p>
        </div>

        {/* Map Container */}
        <div className="mb-12 scale-in">
          <Card className="p-6 bg-card/50 backdrop-blur-sm min-h-[650px]">
            <GujaratMap />
          </Card>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 slide-up">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-water-blue rounded-lg flex items-center justify-center mr-3">
                <Droplets className="w-5 h-5 text-water-blue-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Water Resources</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Gujarat hosts some of India's largest dams, including the iconic
              Sardar Sarovar Dam. These water bodies are crucial for irrigation,
              hydropower generation, and urban water supply.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-geological-green rounded-lg flex items-center justify-center mr-3">
                <MapPin className="w-5 h-5 text-geological-green-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Geological Analysis</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Each dam location has been selected based on comprehensive
              geological surveys, ensuring optimal water retention and
              structural stability in diverse terrain conditions.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                <Info className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Interactive Data</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Click on any dam marker to access detailed information including
              capacity, construction type, completion year, and the rivers they
              control across Gujarat.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MapSection; 