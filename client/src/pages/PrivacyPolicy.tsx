
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Shield, Lock, Eye, Database, Bell, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you contact us via email or WhatsApp. This may include your name, email address, and any other information you choose to provide.",
      testId: "privacy-info-collect"
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: "We use the information we collect to respond to your inquiries, improve our website, and communicate with you about updates and opportunities. We never sell your personal information to third parties.",
      testId: "privacy-info-use"
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.",
      testId: "privacy-security"
    },
    {
      icon: Bell,
      title: "Cookies and Tracking",
      content: "We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookies through your browser settings. We also use Google Analytics to understand how visitors use our site.",
      testId: "privacy-cookies"
    },
    {
      icon: Shield,
      title: "Google AdSense",
      content: "This website uses Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google's Ads Settings.",
      testId: "privacy-adsense"
    },
    {
      icon: Mail,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. If you have any questions or requests regarding your data, please contact us at nishant.ns.business@gmail.com",
      testId: "privacy-rights"
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection 
        title="🔒 Privacy Policy"
        subtitle="Your privacy matters to us. Here's how we protect your data."
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="glass rounded-2xl p-6 mb-8 text-center animate-fadeUp">
            <p className="text-muted-foreground">
              <strong className="text-primary">Last Updated:</strong> January 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="glass rounded-2xl p-8 mb-8 animate-fadeUp" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
              <Shield className="w-7 h-7" />
              Welcome to NS GAMMING Privacy Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At NS GAMMING, we respect your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website. 
              By using this website, you agree to the terms outlined in this policy.
            </p>
          </div>

          {/* Privacy Sections */}
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div 
                key={section.title}
                className="glass rounded-2xl p-8 mb-6 hover:scale-[1.02] transition-all duration-300 animate-fadeUp" 
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                data-testid={section.testId}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-neon">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-3">{section.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Third-Party Links */}
          <div className="glass rounded-2xl p-8 mb-8 animate-fadeUp" style={{ animationDelay: "0.9s" }}>
            <h3 className="text-xl font-bold text-primary mb-4">Third-Party Links</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our website may contain links to external sites (YouTube, Instagram, Telegram, etc.). 
              We are not responsible for the privacy practices of these third-party websites. 
              We encourage you to read their privacy policies before providing any personal information.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="glass rounded-2xl p-8 mb-8 animate-fadeUp" style={{ animationDelay: "1s" }}>
            <h3 className="text-xl font-bold text-primary mb-4">Children's Privacy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our website is intended for general audiences and is not directed to children under 13. 
              We do not knowingly collect personal information from children under 13. 
              If you believe we have collected such information, please contact us immediately.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="glass rounded-2xl p-8 mb-8 animate-fadeUp" style={{ animationDelay: "1.1s" }}>
            <h3 className="text-xl font-bold text-primary mb-4">Changes to This Policy</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page 
              with an updated "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </div>

          {/* Contact Section */}
          <div className="glass rounded-2xl p-8 text-center animate-bounceIn" style={{ animationDelay: "1.2s" }}>
            <h3 className="text-2xl font-bold text-primary mb-4">Got Questions?</h3>
            <p className="text-muted-foreground mb-6">
              If you have any questions or concerns about this Privacy Policy, feel free to reach out!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:nishant.ns.business@gmail.com"
                className="neon-btn"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Us
              </a>
              <a 
                href="https://wa.me/918900653250"
                target="_blank"
                rel="noopener noreferrer"
                className="neon-btn"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
