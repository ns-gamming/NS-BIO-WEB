import { Link } from "wouter";
import { TrendingUp, ArrowLeft, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import AdSenseAd from "@/components/AdSenseAd";

export default function FFSpamBot() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-background to-purple-500/10 dark:from-background dark:via-background dark:to-purple-500/20">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/ff-bots"
          className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-primary transition-colors group"
          data-testid="link-back"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to FF Bots Hub
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12 animate-fadeUp">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 mb-6 shadow-lg animate-pulse-neon">
            <TrendingUp className="w-12 h-12 text-white dark:text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-glow" data-testid="text-title">
            Free Fire Spam Bot 📈
          </h1>
          
          <p className="text-xl text-muted-foreground dark:text-muted-foreground mb-6">
            Profile visibility badao aur famous bano! Automated engagement se popularity skyrocket karo! 🚀
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/30 dark:to-orange-500/30 rounded-full border-2 border-yellow-500/50 dark:border-yellow-500/70 animate-pulse">
            <Rocket className="w-6 h-6 text-yellow-500 dark:text-yellow-400 animate-bounce" />
            <span className="font-bold text-yellow-600 dark:text-yellow-400 text-lg">Coming Soon!</span>
            <Rocket className="w-6 h-6 text-yellow-500 dark:text-yellow-400 animate-bounce" />
          </div>
        </div>

        {/* Ad Placement */}
        <div className="mb-12 animate-fadeUp">
          <AdSenseAd />
        </div>

        {/* Features Preview */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border-2 border-purple-500/30 dark:border-purple-500/50 animate-scaleIn">
          <h2 className="text-2xl font-bold mb-6 text-foreground dark:text-foreground">What's Coming? 🚀</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-background/50 dark:bg-background/70 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 dark:bg-purple-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-500 dark:text-purple-400">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground dark:text-foreground mb-1">Auto Engagement</h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Profile pe automatic engagement badao instantly!</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-background/50 dark:bg-background/70 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-pink-500/20 dark:bg-pink-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-pink-500 dark:text-pink-400">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground dark:text-foreground mb-1">Visibility Boost</h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Apna profile top pe dikho - trending mein aao!</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-background/50 dark:bg-background/70 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 dark:bg-purple-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-500 dark:text-purple-400">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground dark:text-foreground mb-1">Safe & Secure</h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">100% safe - no ban risk, completely secure process!</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-background/50 dark:bg-background/70 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-pink-500/20 dark:bg-pink-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-pink-500 dark:text-pink-400">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground dark:text-foreground mb-1">Instant Results</h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Results turant milega - no waiting, instant action!</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 dark:from-primary/20 dark:via-accent/20 dark:to-primary/10 border-2 border-primary/30 dark:border-primary/50 text-center animate-bounceIn">
          <h3 className="text-2xl font-bold mb-4 text-foreground dark:text-foreground">
            Taiyyar Ho Jao Boss! 🎯
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground mb-6 max-w-2xl mx-auto">
            Ye powerful tool jaldi launch hoga! Tab tak dusre tools use karo aur dominate karte raho! 💪
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/ff-bots"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 text-white dark:text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all duration-300 hover:scale-105"
              data-testid="button-explore-tools"
            >
              Explore Other Tools
            </Link>
            <a 
              href="https://wa.me/918900653250" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 text-white dark:text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] dark:hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] transition-all duration-300 hover:scale-105"
              data-testid="button-contact"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              Contact Karo!
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
