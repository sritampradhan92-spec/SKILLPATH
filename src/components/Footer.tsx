import { Link } from "react-router-dom";
import logo from "@/assets/skillpath-logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "Register", path: "/register" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
    { name: "Admin Login", path: "/admin/login" },
  ];

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SkillPath Logo" className="h-12 w-12 rounded-full object-cover" />
            <span className="text-2xl font-bold">SkillPath</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="text-white/80 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="text-center text-white/70">
            <p>© {currentYear} SkillPath — Your Journey to Local Gigs</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
