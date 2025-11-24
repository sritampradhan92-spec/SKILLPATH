import { Card } from "@/components/ui/card";
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  Award, 
  MessageCircle, 
  BarChart3, 
  Shield 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Search,
      title: "Discover Your Real Skills",
      description: "Understand what you're good at and how to improve.",
      color: "text-blue-500",
    },
    {
      icon: MapPin,
      title: "Unlock Local Gigs",
      description: "Find real earning opportunities in your city.",
      color: "text-green-500",
    },
    {
      icon: GraduationCap,
      title: "Learn Through Guided Programs",
      description: "Step-by-step introduction to the platform.",
      color: "text-purple-500",
    },
    {
      icon: Award,
      title: "Free Orientation + Certificates",
      description: "All registered users receive a free learning session and certificate.",
      color: "text-yellow-500",
    },
    {
      icon: MessageCircle,
      title: "24/7 Team Support",
      description: "Connect instantly through WhatsApp, Instagram, LinkedIn & Facebook.",
      color: "text-pink-500",
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "View tasks, growth, and progress over time.",
      color: "text-indigo-500",
    },
    {
      icon: Shield,
      title: "Secure & Encrypted",
      description: "Only the CEO can access registered user data.",
      color: "text-red-500",
    },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              What <span className="text-accent">SkillPath</span> Can Do
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to start your journey to success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-xl transition-all hover:scale-105 border-border hover:border-primary/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
