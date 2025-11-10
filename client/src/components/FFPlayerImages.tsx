import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Image as ImageIcon, ExternalLink, AlertCircle } from "lucide-react";
import { outfitImageUrl, bannerImageUrl, sanitizeUid, sanitizeRegion } from "@/lib/ff-images";

interface FFPlayerImagesProps {
  uid: string;
  region: string;
}

export default function FFPlayerImages({ uid, region }: FFPlayerImagesProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [outfitError, setOutfitError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  const sanitizedUid = sanitizeUid(uid);
  const sanitizedRegion = sanitizeRegion(region);

  if (!sanitizedUid || !sanitizedRegion) {
    return null;
  }

  const outfitUrl = outfitImageUrl(region, uid, retryCount > 0);
  const bannerUrl = bannerImageUrl(region, uid, retryCount > 0);

  const handleRefresh = () => {
    setRetryCount(prev => prev + 1);
    setOutfitError(false);
    setBannerError(false);
  };

  return (
    <Card className="mt-6 overflow-hidden border-2 border-purple-500/30">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-500" />
            Player Images
          </CardTitle>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-500/10">Outfit Image</Badge>
            </h4>
            {outfitUrl && !outfitError && (
              <a
                href={outfitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Open
              </a>
            )}
          </div>
          {outfitError ? (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center animate-fadeIn">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-muted-foreground">
                Couldn't load outfit image. The image server might be temporarily unavailable.
              </p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 animate-glow-subtle">
              <img
                src={outfitUrl}
                alt={`Outfit for UID ${uid} (${region})`}
                className="w-full h-auto max-h-[600px] object-contain transition-transform hover:scale-105"
                onError={() => setOutfitError(true)}
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-500/10">Banner Image</Badge>
            </h4>
            {bannerUrl && !bannerError && (
              <a
                href={bannerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Open
              </a>
            )}
          </div>
          {bannerError ? (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center animate-fadeIn">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-muted-foreground">
                Couldn't load banner image. The image server might be temporarily unavailable.
              </p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-2 border-pink-500/30 animate-glow-subtle">
              <img
                src={bannerUrl}
                alt={`Banner for UID ${uid} (${region})`}
                className="w-full h-auto max-h-[400px] object-contain transition-transform hover:scale-105"
                onError={() => setBannerError(true)}
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <p>Images are fetched from official Free Fire servers. If images fail to load, try refreshing or check back later.</p>
        </div>
      </CardContent>
    </Card>
  );
}
