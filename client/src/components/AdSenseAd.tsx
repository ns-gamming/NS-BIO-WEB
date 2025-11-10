
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseAdProps {
  slot?: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  className?: string;
}

export default function AdSenseAd({ 
  slot = "9325686363", 
  format = "auto",
  className = "" 
}: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`ad-container my-6 mx-auto px-4 max-w-6xl ${className}`} data-testid="adsense-ad">
      <div className="text-center text-xs text-muted-foreground mb-2 uppercase tracking-wide">
        Advertisement
      </div>
      <div className="bg-muted/20 dark:bg-muted/10 rounded-lg p-4 border border-border/50">
        <ins
          className="adsbygoogle"
          style={{ 
            display: "block", 
            minHeight: "250px",
            textAlign: "center"
          }}
          data-ad-client="ca-pub-4779140243670658"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
          ref={adRef}
        />
      </div>
    </div>
  );
}
