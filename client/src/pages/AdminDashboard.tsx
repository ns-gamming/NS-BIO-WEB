
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, LogOut, Users, Activity, Settings } from "lucide-react";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifySession();
  }, []);

  const verifySession = async () => {
    const sessionToken = localStorage.getItem("adminSession");
    
    if (!sessionToken) {
      setLocation("/admin");
      return;
    }

    try {
      const response = await fetch("/api/admin/verify-session", {
        headers: {
          "X-Admin-Session": sessionToken,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("adminSession");
        setLocation("/admin");
        return;
      }

      const data = await response.json();
      setAdminUser(data.user);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify session",
      });
      setLocation("/admin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const sessionToken = localStorage.getItem("adminSession");
    
    if (sessionToken) {
      try {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            "X-Admin-Session": sessionToken,
          },
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    localStorage.removeItem("adminSession");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    setLocation("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10">
      <nav className="border-b border-primary/20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-orbitron font-bold">Admin Dashboard</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {adminUser?.username}
          </h2>
          <p className="text-muted-foreground">
            Role: {adminUser?.role} | Email: {adminUser?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage system users and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Analytics
              </CardTitle>
              <CardDescription>
                View system analytics and logs
              </CardDescription>
            </CardContent>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Settings
              </CardTitle>
              <CardDescription>
                Configure system settings
              </CardDescription>
            </CardContent>
            <CardContent>
              <Button className="w-full" variant="outline">
                Configure
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-primary/20">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No recent activity to display
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
