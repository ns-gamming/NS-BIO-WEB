
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [totpToken, setTotpToken] = useState("");
  const [requiresTOTP, setRequiresTOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          totpToken: totpToken || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresTOTP) {
          setRequiresTOTP(true);
          toast({
            title: "2FA Required",
            description: "Please enter your TOTP token",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: data.error || "Invalid credentials",
          });
        }
        return;
      }

      // Store session token
      localStorage.setItem("adminSession", data.sessionToken);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });

      setLocation("/admin/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/10 p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-orbitron">Admin Portal</CardTitle>
          <CardDescription>
            Secure access to the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className="border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-primary/20 focus:border-primary"
              />
            </div>

            {requiresTOTP && (
              <div className="space-y-2">
                <Label htmlFor="totp" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  2FA Token
                </Label>
                <Input
                  id="totp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value)}
                  maxLength={6}
                  disabled={isLoading}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
