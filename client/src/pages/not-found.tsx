
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
              <div className="absolute inset-0 bg-red-600/40 dark:bg-red-500/40 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-red-600/30 dark:bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-full h-full bg-red-600 dark:bg-red-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow" style={{ boxShadow: '0 0 40px rgba(220, 38, 38, 0.8), 0 0 80px rgba(220, 38, 38, 0.4)' }}>
                <AlertCircle className="h-16 w-16 text-white animate-heartbeat" />
              </div>
            </div>
            
            <div className="animate-slideRight">
              <h1 className="text-4xl font-bold text-foreground dark:text-foreground mb-2 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
                404 - Page Not Found! 🚧
              </h1>
              <p className="text-lg text-muted-foreground dark:text-muted-foreground animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                Oops! This page seems to have vanished! Yeh page toh gayab ho gaya! 🗺️
              </p>
            </div>

            <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-6 space-y-3 animate-zoomIn border-2 border-primary/20 dark:border-primary/30 hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.3s' }}>
              <h2 className="font-semibold text-foreground dark:text-foreground text-base animate-slideLeft">
                💕 What Happened? Kya hua bhai?
              </h2>
              <p className="text-sm text-foreground/80 dark:text-foreground/80 leading-relaxed animate-fadeInLeft" style={{ animationDelay: '0.4s' }}>
                Don't worry, it's not your fault! Sometimes pages get moved, renamed, or there might be a tiny typo in the URL. 
                It's like searching for a game level that doesn't exist! 🎮
              </p>
              <p className="text-sm text-foreground/80 dark:text-foreground/80 leading-relaxed animate-fadeInRight" style={{ animationDelay: '0.5s' }}>
                This happens to everyone while browsing - even the best developers encounter 404 pages kabhi kabhi! 
                Good news? You can easily go back to where you came from. Just click the buttons below! ✨
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full animate-bounceIn" style={{ animationDelay: '0.6s' }}>
              <Link href="/" className="flex-1">
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-primary/50 shadow-lg flex items-center justify-center gap-2 group animate-float"
                  data-testid="button-home"
                >
                  <Home className="w-5 h-5 group-hover:rotate-12 transition-transform animate-wiggle" />
                  <span>Go Home! 🏠</span>
                </button>
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground dark:text-foreground px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-lg flex items-center justify-center gap-2 border-2 border-border group animate-float"
                data-testid="button-back"
                style={{ animationDelay: '0.2s' }}
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Go Back! ⬅️</span>
              </button>
            </div>

            <p className="text-xs text-muted-foreground dark:text-muted-foreground animate-slideUpFade animate-pulse" style={{ animationDelay: '0.7s' }}>
              Visit <span className="text-primary font-bold text-sm hover:scale-110 inline-block transition-transform cursor-pointer">nsgamming.xyz</span> for amazing NS GAMMING content! 🎮✨
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
