import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Flame, Star } from "lucide-react";

const Team = () => {
  const team = [
    {
      name: "Mr. Debasish Behera",
      role: "CEO",
      description: "Leads strategy, vision & platform direction.",
      icon: Crown,
      initials: "DB",
      color: "bg-primary",
      // Use local public asset if available. Please copy the CEO image to `public/assets/ceo.jpg`.
      photo: "/assets/ceo.jpg",
    },
    {
      name: "Mr. Raja Maharana",
      role: "Founder",
      description: "The original creator of SkillPath.",
      icon: Flame,
      initials: "RM",
      color: "bg-accent",
      photo: "/assets/raja.jpg",
    },
    {
      name: "Mr. Sritam Pradhan",
      role: "Co-Founder",
      description: "Manages operations & user workflow.",
      icon: Star,
      initials: "SP",
      color: "bg-secondary",
      photo: "/assets/sritam.jpg",
    },
  ];

  return (
    <section id="team" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Meet Our <span className="text-primary">Leadership</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              The passionate team behind SkillPath
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card 
                key={index}
                className="p-8 text-center hover:shadow-xl transition-all hover:scale-105 border-border hover:border-primary/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative inline-block mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    {member.photo ? (
                      <AvatarImage src={member.photo} alt={member.name} />
                    ) : (
                      <AvatarFallback className={`${member.color} text-white text-2xl font-bold`}>
                        {member.initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute -top-2 -right-2 bg-accent rounded-full p-2">
                    <member.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-accent font-semibold mb-3">{member.role}</p>
                <p className="text-muted-foreground">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
