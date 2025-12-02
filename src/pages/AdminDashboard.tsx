import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/skillpath-logo.jpg";
import { 
  LogOut, 
  Search, 
  Instagram, 
  MessageCircle, 
  Linkedin, 
  Facebook 
} from "lucide-react";

// LocalStorage key for registrations
const STORAGE_KEY = "skillpath_registrations";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; usingMongo: boolean } | null>(null);

  // Load registrations from localStorage on mount
  useEffect(() => {
    const load = async () => {
      // prefer central API if configured
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      try {
        const resp = await fetch(`${apiBase}/api/registrations`);
        if (resp.ok) {
          const data = await resp.json();
          // normalize id field
          const normalized = data.map((d: any) => ({
            id: d.id || d._id || d._id?.toString(),
            fullName: d.fullName || d.full_name || d.fullName,
            age: d.age || d.age,
            college: d.college || d.college,
            email: d.email,
            phone: d.phone,
            city: d.city,
            date: d.date || (d.createdAt ? new Date(d.createdAt).toLocaleString() : ""),
            message: d.message,
          }));
          setUsers(normalized);
          return;
        }
      } catch (err) {
        // fallback to localStorage
        console.warn('Could not fetch from central API, falling back to localStorage', err);
      }

      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        setUsers(stored);
      } catch (err) {
        console.error("Failed to load registrations:", err);
        setUsers([]);
      }
    };

    load();
    // fetch health status
    (async () => {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      try {
        const r = await fetch(`${apiBase}/api/health`);
        if (r.ok) {
          const j = await r.json();
          setDbStatus({ connected: !!j.dbConnected, usingMongo: !!j.usingMongo });
        } else {
          setDbStatus({ connected: false, usingMongo: false });
        }
      } catch (err) {
        setDbStatus({ connected: false, usingMongo: false });
      }
    })();

    // Auto-refresh registrations every 5 seconds
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    navigate("/admin/login");
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleContactClick = (platform: string, user: any) => {
    // Handle contact actions
    console.log(`Contacting ${user.fullName} via ${platform}`);
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this registration?");
    if (!confirmed) return;

    const doDelete = async () => {
      // attempt central delete
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      let deletedFromApi = false;
      try {
        console.log(`Attempting to delete ID: ${id} from ${apiBase}/api/registrations/${id}`);
        const resp = await fetch(`${apiBase}/api/registrations/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const respText = await resp.text();
        console.log(`Delete response status: ${resp.status}`, respText);
        
        if (resp.ok) {
          deletedFromApi = true;
          console.log('Successfully deleted from API');
        } else {
          try {
            const errorData = JSON.parse(respText);
            console.error('API delete error:', errorData);
            alert(`Failed to delete: ${errorData.error || 'Unknown error'}`);
          } catch {
            alert(`Failed to delete: Server error (${resp.status})`);
          }
          return;
        }
      } catch (err) {
        console.error('Central delete failed', err);
        alert(`Error connecting to server: ${err}`);
        return;
      }

      // Only remove from UI if API delete was successful
      if (deletedFromApi) {
        const updated = users.filter((u) => u.id !== id);
        setUsers(updated);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (err) {
          console.error("Failed to update storage after delete:", err);
        }
      }
    };

    doDelete();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="SkillPath Logo" className="h-12 w-12 rounded-full object-cover" />
              <div className="flex items-center gap-3">
                {/* CEO avatar (circle) — prefers local public asset at /assets/ceo.jpg */}
                <img
                  src="/assets/ceo.jpg"
                  alt="Debasish Behera"
                  className="h-12 w-12 rounded-full object-cover border-2 border-white/30"
                />
                <div>
                  <h1 className="text-2xl font-bold">SkillPath Admin</h1>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-white/80">Welcome, Mr. Debasish Behera</p>
                    {dbStatus && (
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className={`h-3 w-3 rounded-full ${dbStatus.connected ? 'bg-green-400' : 'bg-red-400'}`}
                          aria-hidden
                        />
                        <span className="text-white/80">MongoDB: {dbStatus.connected ? 'Connected' : 'Disconnected'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Registered Users</h2>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.age}</TableCell>
                    <TableCell>{user.college}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>{user.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-pink-50 hover:text-pink-500"
                          onClick={() => window.open("https://www.instagram.com/skillpath__india?igsh=YTVldW9odnE5OXRw", "_blank", "noopener,noreferrer")}
                        >
                          <Instagram className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-green-50 hover:text-green-500"
                          onClick={() => window.open("https://wa.me/qr/GOF4RBHPEDIUK1", "_blank", "noopener,noreferrer")}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-50 hover:text-blue-500"
                          onClick={() => window.open("https://www.linkedin.com/in/skillpath-india-319690397?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", "_blank", "noopener,noreferrer")}
                        >
                          <Linkedin className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => handleContactClick("Facebook", user)}
                        >
                          <Facebook className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 hover:text-red-500"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching your search.
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
