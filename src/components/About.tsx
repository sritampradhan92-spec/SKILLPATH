import { Card } from "@/components/ui/card";
import { Target, Users, TrendingUp } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Target,
      title: "Clear Purpose",
      description: "Helping individuals discover their potential",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built for students and beginners",
    },
    {
      icon: TrendingUp,
      title: "Growth Focus",
      description: "Build skills for a strong future",
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            About <span className="text-primary">SkillPath</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            SkillPath is a modern platform designed to help individuals discover their potential, 
            build confidence, and access local earning opportunities. We provide guidance, support, 
            and a clear roadmap for users to grow through practical skills.
          </p>

          <p className="text-lg md:text-xl text-muted-foreground">
            SkillPath is made for <span className="text-accent font-semibold">students</span>, 
            <span className="text-accent font-semibold"> beginners</span>, and anyone who wants to 
            build a strong future.
          </p>

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {highlights.map((item, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all hover:scale-105 border-primary/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
