
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Image as ImageIcon, ExternalLink, AlertCircle, Loader2, CheckCircle2, X, ZoomIn } from "lucide-react";
import { outfitImageUrl, bannerImageUrl, sanitizeUid, sanitizeRegion } from "@/lib/ff-images";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [modalImage, setModalImage] = useState<{ url: string; title: string } | null>(null);

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

  const handleOutfitLoad = () => {
    setOutfitLoaded(true);
    setOutfitLoading(false);
    // Auto-open outfit image in modal
    setModalImage({ url: outfitUrl, title: `Outfit - ${uid}` });
  };

  const handleBannerLoad = () => {
    setBannerLoaded(true);
    setBannerLoading(false);
  };

  return (
    <>
      <Card className="mt-6 overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 backdrop-blur-sm shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Player Images
              </span>
            </CardTitle>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="gap-2 border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-500 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Outfit Image Section */}
          {!outfitError && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-3 text-lg">
                  <Badge variant="outline" className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border-blue-500/60 text-blue-600 dark:text-blue-400 px-4 py-2 text-base">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Character Outfit
                  </Badge>
                  {outfitLoaded && (
                    <div className="flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-5 h-5 text-green-500 animate-pulse" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Loaded Successfully</span>
                    </div>
                  )}
                </h4>
              </div>
              
              {outfitLoading && (
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/40 p-16 flex flex-col items-center justify-center min-h-[350px] shadow-lg">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500/30 rounded-full animate-ping" />
                  </div>
                  <p className="text-base text-muted-foreground mt-6 font-medium">Loading outfit image...</p>
                  <p className="text-sm text-muted-foreground/70 mt-2">Please wait while we fetch the data</p>
                </div>
              )}
              
              {outfitLoaded && (
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-2 border-purple-500/50 shadow-2xl transition-all duration-500 animate-fadeIn hover:shadow-purple-500/50 group">
                  <div className="relative">
                    <img
                      src={outfitUrl}
                      alt={`Outfit for UID ${uid}`}
                      className="w-full h-auto max-h-[700px] object-contain transition-all duration-500 group-hover:scale-105 cursor-pointer"
                      onError={() => {
                        setOutfitError(true);
                        setOutfitLoading(false);
                      }}
                      onLoad={handleOutfitLoad}
                      loading="lazy"
                      onClick={() => setModalImage({ url: outfitUrl, title: `Outfit - ${uid}` })}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button 
                        variant="secondary" 
                        size="lg"
                        className="bg-purple-600/90 hover:bg-purple-600 text-white backdrop-blur-sm shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalImage({ url: outfitUrl, title: `Outfit - ${uid}` });
                        }}
                      >
                        <ZoomIn className="w-5 h-5 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Banner Image Section */}
          {!bannerError && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-3 text-lg">
                  <Badge variant="outline" className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-500/60 text-purple-600 dark:text-purple-400 px-4 py-2 text-base">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Profile Banner
                  </Badge>
                  {bannerLoaded && (
                    <div className="flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-5 h-5 text-green-500 animate-pulse" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Loaded Successfully</span>
                    </div>
                  )}
                </h4>
              </div>
              
              {bannerLoading && (
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-2 border-pink-500/40 p-16 flex flex-col items-center justify-center min-h-[250px] shadow-lg">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 rounded-full animate-ping" />
                  </div>
                  <p className="text-base text-muted-foreground mt-6 font-medium">Loading banner image...</p>
                  <p className="text-sm text-muted-foreground/70 mt-2">Please wait while we fetch the data</p>
                </div>
              )}
              
              {bannerLoaded && (
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-fuchsia-500/10 border-2 border-pink-500/50 shadow-2xl transition-all duration-500 animate-fadeIn hover:shadow-pink-500/50 group">
                  <div className="relative">
                    <img
                      src={bannerUrl}
                      alt={`Banner for UID ${uid}`}
                      className="w-full h-auto max-h-[450px] object-contain transition-all duration-500 group-hover:scale-105 cursor-pointer"
                      onError={() => {
                        setBannerError(true);
                        setBannerLoading(false);
                      }}
                      onLoad={handleBannerLoad}
                      loading="lazy"
                      onClick={() => setModalImage({ url: bannerUrl, title: `Banner - ${uid}` })}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-600/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button 
                        variant="secondary" 
                        size="lg"
                        className="bg-pink-600/90 hover:bg-pink-600 text-white backdrop-blur-sm shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalImage({ url: bannerUrl, title: `Banner - ${uid}` });
                        }}
                      >
                        <ZoomIn className="w-5 h-5 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-muted-foreground text-center pt-6 border-t border-purple-500/30">
            <p className="flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-500" />
              <span>Images are fetched from official Free Fire servers. Click on any image to view in full screen.</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      <Dialog open={!!modalImage} onOpenChange={() => setModalImage(null)}>
        <DialogContent className="max-w-7xl w-full p-0 overflow-hidden bg-black/95 border-2 border-purple-500/50">
          <DialogHeader className="p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/30">
            <DialogTitle className="text-2xl text-white flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-purple-400" />
              {modalImage?.title}
            </DialogTitle>
          </DialogHeader>
          {modalImage && (
            <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
              <img
                src={modalImage.url}
                alt={modalImage.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setModalImage(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
