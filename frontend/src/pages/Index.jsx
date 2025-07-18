import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MapSection from "@/components/MapSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Map Section */}
      <MapSection />

      {/* Placeholder sections for navigation */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground">
            Comprehensive geological analysis and suitability assessment
            services.
          </p>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-muted-foreground">
            Leading experts in geological analysis and terrain assessment
            technology.
          </p>
        </div>
      </section>

      <section id="feedback" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Let Us Know</h2>
          <p className="text-muted-foreground">
            Share your feedback and help us improve our services.
          </p>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            Get in touch with our geological analysis experts.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index; 