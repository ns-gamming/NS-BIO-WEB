import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
      <Card className="w-full max-w-lg mx-4 border-2 border-border bg-background dark:bg-background shadow-2xl animate-fadeUp">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-red-500/20 dark:bg-red-400/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-red-500/10 dark:bg-red-400/10 rounded-full blur-xl animate-pulse-neon"></div>
              <div className="relative w-full h-full bg-red-500 dark:bg-red-400 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                <AlertCircle className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-foreground dark:text-foreground mb-2 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
                404 - Rasta Galat Ho Gaya! 🚧
              </h1>
              <p className="text-lg text-muted-foreground dark:text-muted-foreground animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                Oops! Yeh page toh kho gaya! 🗺️ Lost and not found!
              </p>
            </div>

            <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-6 space-y-3 animate-fadeUp border-2 border-primary/20 dark:border-primary/30" style={{ animationDelay: '0.3s' }}>
              <h2 className="font-semibold text-foreground dark:text-foreground text-base">
                💕 Kya Hua Bhai? Why did this happen?
              </h2>
              <p className="text-sm text-foreground/80 dark:text-foreground/80 leading-relaxed">
                Tension mat lo, it's not your fault! 😊 Kabhi kabhi pages move ho jate hain, rename ho jate hain, ya phir URL mein choti si typo ho jati hai. 
                It's like trying to find a game level jo exist hi nahi karta! 🎮
              </p>
              <p className="text-sm text-foreground/80 dark:text-foreground/80 leading-relaxed">
                Web explore karte waqt aisa hota rehta hai - best developers ko bhi 404 pages mil jate hain kabhi kabhi! 
                Good news? Aap easily wapis ja sakte ho jaha se aaye the. Bas neeche ke buttons click karo! ✨
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full animate-fadeUp" style={{ animationDelay: '0.4s' }}>
              <Link href="/" className="flex-1">
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-primary/50 shadow-lg flex items-center justify-center gap-2 group"
                  data-testid="button-home"
                >
                  <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Home Chalte Hain! 🏠</span>
                </button>
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground dark:text-foreground px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg flex items-center justify-center gap-2 border-2 border-border group"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Peeche Jao! ⬅️</span>
              </button>
            </div>

            <p className="text-xs text-muted-foreground dark:text-muted-foreground animate-fadeUp animate-pulse" style={{ animationDelay: '0.5s' }}>
              Visit <span className="text-primary font-bold text-sm">nsgamming.xyz</span> for NS GAMMING content! 🎮✨
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
