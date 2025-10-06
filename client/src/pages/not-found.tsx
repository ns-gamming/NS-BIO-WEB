import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
      <Card className="w-full max-w-lg mx-4 border-2 border-border bg-background dark:bg-background shadow-2xl animate-fadeUp">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="relative">
              <AlertCircle className="h-24 w-24 text-red-500 dark:text-red-400 animate-pulse-neon" />
              <div className="absolute inset-0 h-24 w-24 text-red-500 dark:text-red-400 animate-ping opacity-20">
                <AlertCircle className="h-24 w-24" />
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-foreground dark:text-foreground mb-2 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
                404 - Page Not Found
              </h1>
              <p className="text-lg text-muted-foreground dark:text-muted-foreground animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                Oops! This page went on an adventure! 🗺️
              </p>
            </div>

            <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-6 space-y-3 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
              <h2 className="font-semibold text-foreground dark:text-foreground text-base">
                💕 Why did this happen?
              </h2>
              <p className="text-sm text-foreground/80 dark:text-foreground/80 leading-relaxed">
                Don't worry, it's not your fault! 😊 Sometimes pages get moved, renamed, or the URL might have a small typo. 
                It's like trying to find a specific game level that doesn't exist yet! 🎮
              </p>
              <p className="text-sm text-foreground/80 dark:text-foreground/80 leading-relaxed">
                This is part of exploring the web - even the best developers see 404 pages sometimes! 
                The good news? You can easily get back to familiar territory. ✨
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full animate-fadeUp" style={{ animationDelay: '0.4s' }}>
              <Link href="/" className="flex-1">
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  data-testid="button-home"
                >
                  <Home className="w-5 h-5" />
                  Go to Home
                </button>
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground dark:text-foreground px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 border border-border"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>

            <p className="text-xs text-muted-foreground dark:text-muted-foreground animate-fadeUp" style={{ animationDelay: '0.5s' }}>
              Visit <span className="text-primary font-semibold">nsgamming.xyz</span> for NS GAMMING content! 🎮
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
