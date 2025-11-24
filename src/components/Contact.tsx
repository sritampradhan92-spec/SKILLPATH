import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  Linkedin 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Contact = () => {
  const socialLinks = [
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://www.instagram.com/skillpath__india?igsh=YTVldW9odnE5OXRw",
      color: "hover:text-pink-500",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/qr/GOF4RBHPEDIUK1",
      color: "hover:text-green-500",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/skillpath-india-319690397?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      color: "hover:text-blue-500",
    },
    {
      icon: Facebook,
      label: "Facebook",
      href: "#",
      color: "hover:text-blue-600",
    },
  ];

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !email || !message) {
      toast({
        title: "Missing fields",
        description: "Please provide your name, email and a message.",
      });
      return;
    }

    // Simple email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address." });
      return;
    }

    setLoading(true);

    const record = {
      fullName: name,
      email,
      message,
      age: "",
      college: "",
      phone: "",
      city: "",
      date: new Date().toLocaleString(),
    };

    // try to send to central API if available, otherwise fallback to localStorage
    let savedToServer = false;
    try {
      const resp = await fetch(`${apiBase}/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (resp.ok) {
        savedToServer = true;
      } else {
        console.warn('Server responded with non-OK', resp.statusText);
      }
    } catch (err) {
      console.warn('Failed to reach API, falling back to localStorage', err);
    }

    try {
      const STORAGE_KEY = "skillpath_registrations";
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(existing)) {
        existing.unshift(record);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([record]));
      }

      if (savedToServer) {
        toast({ title: "Message sent", description: "Saved to central database and local cache." });
      } else {
        toast({ title: "Message saved locally", description: "Saved in your browser. Admin will see it when central sync is enabled." });
      }

      form.reset();
    } catch (err) {
      console.error("Failed to save message:", err);
      toast({ title: "Error", description: "Could not save your message. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Get In <span className="text-accent">Touch</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              We're here to help you on your journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <Card className="p-8 space-y-6">
              <h3 className="text-2xl font-bold text-foreground mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground font-medium">skillpathindia@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-foreground font-medium">8260941846</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">Connect With Us</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-background p-3 rounded-lg transition-all hover:scale-110 ${social.color}`}
                      aria-label={social.label}
                    >
                      <social.icon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>
            </Card>

            {/* Contact Form */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input 
                    name="name"
                    type="text" 
                    placeholder="Your Name" 
                    required 
                    className="border-border"
                  />
                </div>
                <div>
                  <Input 
                    name="email"
                    type="email" 
                    placeholder="Your Email" 
                    required 
                    className="border-border"
                  />
                </div>
                <div>
                  <Textarea 
                    name="message"
                    placeholder="Your Message" 
                    rows={5} 
                    required 
                    className="border-border"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
