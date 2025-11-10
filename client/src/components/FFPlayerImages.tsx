import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Image as ImageIcon, ExternalLink, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { outfitImageUrl, bannerImageUrl, sanitizeUid, sanitizeRegion } from "@/lib/ff-images";

interface FFPlayerImagesProps {
  uid: string;
  region: string;
}

export default function FFPlayerImages({ uid, region }: FFPlayerImagesProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [outfitError, setOutfitError] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [outfitLoading, setOutfitLoading] = useState(true);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [outfitLoaded, setOutfitLoaded] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);

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
    setOutfitLoading(true);
    setBannerLoading(true);
    setOutfitLoaded(false);
    setBannerLoaded(false);
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
              <Badge variant="outline" className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400">
                <ImageIcon className="w-3 h-3 mr-1" />
                Outfit Image
              </Badge>
              {outfitLoaded && !outfitError && (
                <CheckCircle2 className="w-4 h-4 text-green-500 animate-pulse" />
              )}
            </h4>
            {outfitUrl && !outfitError && outfitLoaded && (
              <a
                href={outfitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Open Full Size
              </a>
            )}
          </div>
          
          {outfitLoading && !outfitError && (
            <div className="rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 p-12 flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Loading outfit image...</p>
            </div>
          )}
          
          {outfitError && (
            <div className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-2 border-destructive/30 rounded-xl p-8 text-center animate-fadeIn shadow-lg">
              <div className="bg-destructive/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive animate-pulse" />
              </div>
              <h5 className="font-semibold text-destructive mb-2">Image Unavailable</h5>
              <p className="text-sm text-muted-foreground mb-4">
                The outfit image server is temporarily unavailable. This happens sometimes with Free Fire servers.
              </p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-destructive/50 hover:bg-destructive/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
          
          {!outfitError && (
            <div className={`rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-2 border-purple-500/40 shadow-xl transition-all duration-500 ${outfitLoaded ? 'animate-fadeIn' : 'hidden'}`}>
              <div className="relative group">
                <img
                  src={outfitUrl}
                  alt={`Outfit for UID ${uid} (${region})`}
                  className="w-full h-auto max-h-[600px] object-contain transition-all duration-500 group-hover:scale-105"
                  onError={() => {
                    setOutfitError(true);
                    setOutfitLoading(false);
                  }}
                  onLoad={() => {
                    setOutfitLoaded(true);
                    setOutfitLoading(false);
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2">
              <Badge variant="outline" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50 text-purple-600 dark:text-purple-400">
                <ImageIcon className="w-3 h-3 mr-1" />
                Banner Image
              </Badge>
              {bannerLoaded && !bannerError && (
                <CheckCircle2 className="w-4 h-4 text-green-500 animate-pulse" />
              )}
            </h4>
            {bannerUrl && !bannerError && bannerLoaded && (
              <a
                href={bannerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Open Full Size
              </a>
            )}
          </div>
          
          {bannerLoading && !bannerError && (
            <div className="rounded-lg overflow-hidden bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-2 border-pink-500/30 p-12 flex flex-col items-center justify-center min-h-[200px]">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Loading banner image...</p>
            </div>
          )}
          
          {bannerError && (
            <div className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-2 border-destructive/30 rounded-xl p-8 text-center animate-fadeIn shadow-lg">
              <div className="bg-destructive/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive animate-pulse" />
              </div>
              <h5 className="font-semibold text-destructive mb-2">Image Unavailable</h5>
              <p className="text-sm text-muted-foreground mb-4">
                The banner image server is temporarily unavailable. This happens sometimes with Free Fire servers.
              </p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-destructive/50 hover:bg-destructive/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
          
          {!bannerError && (
            <div className={`rounded-xl overflow-hidden bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-fuchsia-500/10 border-2 border-pink-500/40 shadow-xl transition-all duration-500 ${bannerLoaded ? 'animate-fadeIn' : 'hidden'}`}>
              <div className="relative group">
                <img
                  src={bannerUrl}
                  alt={`Banner for UID ${uid} (${region})`}
                  className="w-full h-auto max-h-[400px] object-contain transition-all duration-500 group-hover:scale-105"
                  onError={() => {
                    setBannerError(true);
                    setBannerLoading(false);
                  }}
                  onLoad={() => {
                    setBannerLoaded(true);
                    setBannerLoading(false);
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-4 border-t border-purple-500/20">
          <p className="flex items-center justify-center gap-2">
            <ImageIcon className="w-3 h-3" />
            Images are fetched from official Free Fire servers. Refresh if they don't load immediately.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
