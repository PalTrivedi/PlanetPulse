import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const NotFound = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="flex flex-col items-center justify-center text-center pt-32">
      <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90 transition-colors"
      >
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFound; 