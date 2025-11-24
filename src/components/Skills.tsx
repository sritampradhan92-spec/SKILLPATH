import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  MessageSquare, 
  DollarSign, 
  User, 
  ClipboardCheck,
  Clock,
  Laptop,
  Workflow,
  PiggyBank,
  Users
} from "lucide-react";

const Skills = () => {
  const skills = [
    { icon: Lightbulb, text: "Self-Confidence Improvement" },
    { icon: MessageSquare, text: "Communication Skills (Basic to Practical)" },
    { icon: DollarSign, text: "Local Gig Awareness & Earning Knowledge" },
    { icon: User, text: "Professional Behavior & Discipline" },
    { icon: ClipboardCheck, text: "Task Management Skills" },
    { icon: Clock, text: "Time Management" },
    { icon: Laptop, text: "Basic Digital Skills" },
    { icon: Workflow, text: "Understanding Real-World Work Flow" },
    { icon: PiggyBank, text: "Financial Awareness (Basic Earnings Guide)" },
    { icon: Users, text: "Interaction Skills with Customers / Clients" },
  ];

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-accent text-white px-4 py-2 text-sm">
              Skills Development
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Skills Users Gain Through <span className="text-primary">SkillPath</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              These skills prepare users to perform better in local gigs and real-life situations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all hover:scale-105 border-border hover:border-accent/50 flex items-center gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="bg-accent/10 p-3 rounded-lg">
                  <skill.icon className="h-6 w-6 text-accent" />
                </div>
                <p className="text-foreground font-medium">{skill.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
