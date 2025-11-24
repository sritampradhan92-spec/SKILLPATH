import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/skillpath-logo.jpg";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ADMIN_EMAIL = "debasish8384747@gmail.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Debug: log what was entered
    console.log("Email entered:", JSON.stringify(email));
    console.log("Expected email:", JSON.stringify(ADMIN_EMAIL));
    console.log("Password entered:", JSON.stringify(password));
    console.log("Expected password:", JSON.stringify("DEBS@8249"));
    console.log("Email match:", email === ADMIN_EMAIL);
    console.log("Password match:", password === "DEBS@8249");

    // Simulate authentication delay
    setTimeout(() => {
      if (email !== ADMIN_EMAIL) {
        toast({
          title: "Access Denied",
          description: "Unauthorized Admin.",
          variant: "destructive",
        });
      } else if (password !== "DEBS@8249") { // Demo password - NOT SECURE
        toast({
          title: "Authentication Failed",
          description: "Incorrect Password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome, Mr. Debasish Behera",
        });
        navigate("/admin/dashboard");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <Card className="w-full max-w-md p-8 animate-scale-in">
        <div className="text-center mb-8">
          <img 
            src={logo} 
            alt="SkillPath Logo" 
            className="h-20 w-20 rounded-full mx-auto mb-4 object-cover border-4 border-accent"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            SkillPath Admin Access
          </h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            Secure Login Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@skillpath.com"
              className="border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="border-border"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-white py-6 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Authenticating..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Only authorized administrators can access this portal
        </p>
      </Card>
    </div>
  );
};

export default AdminLogin;
