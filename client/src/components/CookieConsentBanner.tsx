import { useState, useEffect } from "react";
import { X, Shield, Cookie, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  advertising: boolean;
}

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    advertising: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const saveConsent = async (prefs: CookiePreferences) => {
    localStorage.setItem("cookie_consent", JSON.stringify(prefs));
    localStorage.setItem("cookie_consent_date", new Date().toISOString());
    
    const sessionId = localStorage.getItem("analytics_session_id");
    
    try {
      await fetch("/api/privacy/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          consentType: "cookies",
          consentGiven: true,
          preferences: prefs,
        }),
      });
    } catch (error) {
      console.error("Error saving consent:", error);
    }
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      advertising: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      advertising: false,
    };
    setPreferences(necessaryOnly);
    saveConsent(necessaryOnly);
  };

  const saveCustomPreferences = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slideUp">
        <div className="max-w-7xl mx-auto glass rounded-2xl p-6 md:p-8 border-2 border-primary/30 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  We Value Your Privacy
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze traffic, and serve personalized ads. 
                  We work with Google AdSense and other partners who may collect data. 
                  You can customize your preferences or accept all cookies.
                </p>
                <a 
                  href="/privacy-policy" 
                  className="text-primary hover:underline text-sm mt-2 inline-block"
                  data-testid="link-privacy-policy"
                >
                  Read our Privacy Policy
                </a>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                onClick={() => setShowSettings(true)}
                variant="outline"
                className="w-full sm:w-auto border-primary/50 hover:bg-primary/10"
                data-testid="button-cookie-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button
                onClick={acceptNecessary}
                variant="outline"
                className="w-full sm:w-auto"
                data-testid="button-cookie-necessary"
              >
                Necessary Only
              </Button>
              <Button
                onClick={acceptAll}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid="button-cookie-accept-all"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-primary/5">
                <div className="flex-1">
                  <Label htmlFor="necessary" className="text-base font-semibold cursor-pointer">
                    Necessary Cookies (Required)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Essential for the website to function properly. These cannot be disabled.
                  </p>
                </div>
                <Switch
                  id="necessary"
                  checked={true}
                  disabled={true}
                  data-testid="switch-necessary-cookies"
                />
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="flex-1">
                  <Label htmlFor="functional" className="text-base font-semibold cursor-pointer">
                    Functional Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable enhanced functionality like chat history, preferences, and personalization.
                  </p>
                </div>
                <Switch
                  id="functional"
                  checked={preferences.functional}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, functional: checked })
                  }
                  data-testid="switch-functional-cookies"
                />
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="flex-1">
                  <Label htmlFor="analytics" className="text-base font-semibold cursor-pointer">
                    Analytics Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, analytics: checked })
                  }
                  data-testid="switch-analytics-cookies"
                />
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="flex-1">
                  <Label htmlFor="advertising" className="text-base font-semibold cursor-pointer">
                    Advertising Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Used by Google AdSense and other partners to deliver personalized advertisements based on your interests.
                  </p>
                </div>
                <Switch
                  id="advertising"
                  checked={preferences.advertising}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, advertising: checked })
                  }
                  data-testid="switch-advertising-cookies"
                />
              </div>
            </div>

            <div className="glass rounded-lg p-4 border border-primary/30">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                About Third-Party Cookies
              </h4>
              <p className="text-sm text-muted-foreground">
                We use Google AdSense which may place cookies on your device. Google and its partners use cookies to:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1 ml-2">
                <li>Serve ads based on your prior visits to this website or other websites</li>
                <li>Measure ad performance and provide reporting</li>
                <li>Provide personalized content and advertising</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                You can opt out of personalized advertising at{" "}
                <a 
                  href="https://www.google.com/settings/ads" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                >
                  Google Ads Settings
                </a>
                .
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                data-testid="button-cancel-settings"
              >
                Cancel
              </Button>
              <Button
                onClick={saveCustomPreferences}
                className="bg-primary hover:bg-primary/90"
                data-testid="button-save-preferences"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
