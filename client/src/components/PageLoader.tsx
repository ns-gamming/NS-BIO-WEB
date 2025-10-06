import { Loader2, Gamepad2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
      <div className="flex flex-col items-center gap-6 animate-fadeUp">
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <Gamepad2 className="w-20 h-20 text-primary" />
          </div>
          <Gamepad2 className="w-20 h-20 text-primary animate-pulse-neon" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground dark:text-foreground flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            Loading NS GAMMING
          </h2>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground animate-pulse">
            Get ready for an awesome experience! 🎮✨
          </p>
        </div>

        <div className="flex gap-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
}
