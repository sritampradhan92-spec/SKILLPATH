import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/skillpath-logo.jpg";
import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 pt-16">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="flex justify-center mb-8">
            <img 
              src={logo} 
              alt="SkillPath Logo" 
              className="h-40 w-40 rounded-full shadow-2xl object-cover border-4 border-primary/20 animate-scale-in"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Your Journey to <span className="text-primary">Local Gigs</span> Starts Here
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Discover your skills, build your confidence, and unlock real earning opportunities near you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Register Now
              </Button>
            </Link>
            <a href="#about">
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg rounded-full transition-all hover:scale-105"
              >
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
