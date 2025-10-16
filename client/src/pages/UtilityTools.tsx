
import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Wrench } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import AdSenseAd from '@/components/AdSenseAd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ImageDown, Volume2, QrCode, ClipboardCopy, Download, Upload, Mic, MicOff } from 'lucide-react';
import QRCode from 'qrcode';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ImageCompressor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      compressImage(event.target?.result as string, file.size);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (imageData: string, originalSize: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const maxWidth = 1920;
      const maxHeight = 1080;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', 0.7);
      setCompressedImage(compressed);
      setCompressedSize(Math.round(compressed.length * 0.75));

      toast({
        title: "Compressed!",
        description: `Reduced by ${Math.round(((originalSize - compressed.length * 0.75) / originalSize) * 100)}%`
      });
    };
    img.src = imageData;
  };

  const downloadCompressed = () => {
    if (!compressedImage) return;
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = 'compressed-image.jpg';
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] animate-popIn" onClick={() => fileInputRef.current?.click()}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl"></div>
        <Upload className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-6 animate-bounce-slow group-hover:scale-125 transition-transform duration-500" />
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 animate-slideInFromBottom">Click to upload an image</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 animate-fadeInLeft" style={{ animationDelay: '0.2s' }}>Supports JPG, PNG, WEBP</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          data-testid="input-image-upload"
        />
      </div>

      {originalImage && compressedImage && (
        <div className="grid md:grid-cols-2 gap-6 animate-zoomIn">
          <div className="space-y-3 animate-slideInFromLeft group">
            <p className="text-base font-bold dark:text-white animate-textShine bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Original ({formatFileSize(originalSize)})</p>
            <div className="relative overflow-hidden rounded-2xl">
              <img src={originalImage} alt="Original" className="rounded-2xl w-full transition-all duration-700 group-hover:scale-110 hover:shadow-[0_0_60px_rgba(6,182,212,0.5)]" data-testid="img-original" />
            </div>
          </div>
          <div className="space-y-3 animate-slideInFromRight group">
            <p className="text-base font-bold dark:text-white animate-textShine bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Compressed ({formatFileSize(compressedSize)})</p>
            <div className="relative overflow-hidden rounded-2xl">
              <img src={compressedImage} alt="Compressed" className="rounded-2xl w-full transition-all duration-700 group-hover:scale-110 hover:shadow-[0_0_60px_rgba(6,182,212,0.5)]" data-testid="img-compressed" />
            </div>
            <Button onClick={downloadCompressed} className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 hover:from-cyan-600 hover:via-blue-600 hover:to-cyan-700 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-bounceIn text-base font-semibold py-6" data-testid="button-download-compressed">
              <Download className="mr-2 h-5 w-5 animate-bounce" />
              Download Compressed Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const speak = () => {
    if (!text.trim()) {
      toast({ title: "Error", description: "Please enter some text first" });
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({ title: "Error", description: "Speech synthesis failed", variant: "destructive" });
      };
      window.speechSynthesis.speak(utterance);
    } else {
      toast({ title: "Not Supported", description: "Text-to-speech not supported in this browser", variant: "destructive" });
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      <Textarea
        placeholder="Enter text to convert to speech..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        className="dark:bg-gray-800 dark:text-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] focus:shadow-[0_0_50px_rgba(168,85,247,0.6)] animate-slideInFromBottom border-2 hover:border-purple-500/50 focus:border-purple-500 rounded-2xl text-base"
        data-testid="textarea-tts"
      />
      <div className="flex gap-3">
        {!isSpeaking ? (
          <Button onClick={speak} className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] animate-popIn text-base font-semibold py-6" data-testid="button-speak">
            <Volume2 className="mr-2 h-5 w-5 animate-pulse" />
            Speak Text
          </Button>
        ) : (
          <Button onClick={stopSpeaking} variant="destructive" className="flex-1 animate-heartBeat transition-all duration-500 hover:scale-105 text-base font-semibold py-6" data-testid="button-stop-speak">
            <MicOff className="mr-2 h-5 w-5 animate-wiggle" />
            Stop Speaking
          </Button>
        )}
      </div>
    </div>
  );
};

const QRCodeGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateQRCode = async () => {
    if (!inputText.trim()) {
      toast({ title: "Error", description: "Please enter text or URL" });
      return;
    }

    try {
      const url = await QRCode.toDataURL(inputText, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(url);
      toast({ title: "Generated!", description: "QR code created successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate QR code", variant: "destructive" });
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="space-y-3 animate-slideInFromLeft">
        <Label data-testid="label-qr-input" className="animate-textShine text-base font-semibold">Enter Text or URL</Label>
        <Input
          placeholder="https://nsgamming.xyz"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="dark:bg-gray-800 dark:text-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] focus:shadow-[0_0_50px_rgba(34,197,94,0.6)] border-2 hover:border-green-500/50 focus:border-green-500 rounded-xl text-base py-6"
          data-testid="input-qr-text"
        />
      </div>

      <Button onClick={generateQRCode} className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] animate-bounceIn text-base font-semibold py-6" data-testid="button-generate-qr">
        <QrCode className="mr-2 h-5 w-5 animate-spin-slow" />
        Generate QR Code
      </Button>

      {qrCodeUrl && (
        <div className="flex flex-col items-center space-y-6 animate-zoomIn">
          <div className="p-6 bg-white rounded-2xl shadow-2xl hover:shadow-[0_0_60px_rgba(34,197,94,0.5)] transition-all duration-700 hover:scale-110 animate-rotateGlow">
            <img src={qrCodeUrl} alt="QR Code" className="w-72 h-72" data-testid="img-qrcode" />
          </div>
          <Button onClick={downloadQRCode} variant="outline" className="w-full dark:border-green-500 dark:text-green-400 dark:hover:bg-green-500/10 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-slideInFromBottom text-base font-semibold py-6 border-2" data-testid="button-download-qr">
            <Download className="mr-2 h-5 w-5 animate-bounce" />
            Download QR Code
          </Button>
        </div>
      )}
    </div>
  );
};

const ClipboardManager = () => {
  const [notes, setNotes] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const { toast } = useToast();

  const saveNote = () => {
    if (!currentNote.trim()) {
      toast({ title: "Error", description: "Please enter some text" });
      return;
    }
    setNotes([currentNote, ...notes]);
    setCurrentNote('');
    toast({ title: "Saved!", description: "Note saved to clipboard manager" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Text copied to clipboard" });
  };

  const deleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
    toast({ title: "Deleted!", description: "Note removed" });
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="space-y-3 animate-slideInFromLeft">
        <Label data-testid="label-note-input" className="animate-textShine text-base font-semibold">Add New Note</Label>
        <Textarea
          placeholder="Type or paste text to save..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          rows={6}
          className="dark:bg-gray-800 dark:text-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] focus:shadow-[0_0_50px_rgba(249,115,22,0.6)] border-2 hover:border-orange-500/50 focus:border-orange-500 rounded-2xl text-base"
          data-testid="textarea-clipboard"
        />
      </div>

      <Button onClick={saveNote} className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] animate-bounceIn text-base font-semibold py-6" data-testid="button-save-note">
        <ClipboardCopy className="mr-2 h-5 w-5 animate-pulse" />
        Save Note
      </Button>

      {notes.length > 0 && (
        <div className="space-y-3 animate-slideInFromBottom">
          <h3 className="font-bold text-lg dark:text-white animate-textShine">Saved Notes ({notes.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {notes.map((note, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 dark:from-orange-500/20 dark:via-red-500/20 dark:to-orange-500/20 border-2 border-orange-500/30 dark:border-orange-500/50 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] animate-popIn group"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`note-item-${index}`}
              >
                <p className="text-base flex-1 break-words dark:text-white">{note}</p>
                <div className="flex gap-2 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(note)}
                    data-testid={`button-copy-note-${index}`}
                    className="dark:hover:bg-gray-700 transition-all duration-500 hover:scale-125 hover:rotate-12"
                  >
                    <ClipboardCopy className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(index)}
                    data-testid={`button-delete-note-${index}`}
                    className="dark:hover:bg-gray-700 text-red-500 transition-all duration-500 hover:scale-125 hover:rotate-12"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function UtilityTools() {
  useEffect(() => {
    // SEO Meta Tags
    document.title = 'Free Utility Tools - Image Compressor, QR Generator, Text to Speech | NS Gamming';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free online utility tools: Image compressor, QR code generator, text-to-speech converter, and clipboard manager. Fast, secure, and easy to use productivity tools.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'image compressor, QR code generator, text to speech, clipboard manager, online tools, free utilities, productivity tools, image optimization, TTS converter');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      {/* Enhanced Animated Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/30 dark:to-blue-500/30 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute top-40 right-20 w-[30rem] h-[30rem] bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-orange-500/20 to-red-500/20 dark:from-orange-500/30 dark:to-red-500/30 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Back Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        <div className="flex flex-wrap gap-4 mb-8 animate-slideInFromLeft">
          <Link href="/tools">
            <Button variant="outline" className="group transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] dark:border-cyan-500/50 dark:hover:bg-cyan-500/10 font-semibold text-base px-6 py-6">
              <Wrench className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              FF Tools
            </Button>
          </Link>
          <Button onClick={() => window.history.back()} variant="outline" className="group transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] dark:border-cyan-500/50 dark:hover:bg-cyan-500/10 font-semibold text-base px-6 py-6">
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-2 transition-transform" />
            Go Back
          </Button>
        </div>
      </div>

      <HeroSection
        title="Utility Tools"
        subtitle="Image compression, text-to-speech, QR codes, and productivity tools 🛠️"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-3 p-2 dark:bg-gray-800/50 backdrop-blur-xl mb-10 animate-slideInFromBottom shadow-2xl hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] transition-all duration-500 rounded-2xl border-2 border-gray-200 dark:border-gray-700" data-testid="tabs-utility">
            <TabsTrigger value="image" data-testid="tab-image" className="text-sm sm:text-base font-semibold transition-all duration-500 hover:scale-110 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-blue-500/30 data-[state=active]:shadow-[0_0_25px_rgba(6,182,212,0.5)] rounded-xl py-4 px-4">
              <ImageDown className="mr-2 h-5 w-5 sm:h-5 sm:w-5" />
              Image Compressor
            </TabsTrigger>
            <TabsTrigger value="tts" data-testid="tab-tts" className="text-sm sm:text-base font-semibold transition-all duration-500 hover:scale-110 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/30 data-[state=active]:to-pink-500/30 data-[state=active]:shadow-[0_0_25px_rgba(168,85,247,0.5)] rounded-xl py-4 px-4">
              <Volume2 className="mr-2 h-5 w-5 sm:h-5 sm:w-5" />
              Text-to-Speech
            </TabsTrigger>
            <TabsTrigger value="qr" data-testid="tab-qr" className="text-sm sm:text-base font-semibold transition-all duration-500 hover:scale-110 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/30 data-[state=active]:to-emerald-500/30 data-[state=active]:shadow-[0_0_25px_rgba(34,197,94,0.5)] rounded-xl py-4 px-4">
              <QrCode className="mr-2 h-5 w-5 sm:h-5 sm:w-5" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="clipboard" data-testid="tab-clipboard" className="text-sm sm:text-base font-semibold transition-all duration-500 hover:scale-110 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/30 data-[state=active]:to-red-500/30 data-[state=active]:shadow-[0_0_25px_rgba(249,115,22,0.5)] rounded-xl py-4 px-4">
              <ClipboardCopy className="mr-2 h-5 w-5 sm:h-5 sm:w-5" />
              Clipboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-8">
            <Card className="dark:bg-gray-900/50 dark:border-gray-800 backdrop-blur-xl transition-all duration-700 hover:shadow-[0_0_60px_rgba(6,182,212,0.4)] hover:scale-[1.02] animate-swingIn border-2 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-cyan-500/5 opacity-50"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 dark:text-white animate-textBounceIn text-2xl sm:text-3xl">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-500 hover:scale-110 hover:rotate-12">
                    <ImageDown className="h-7 w-7 text-white animate-bounce-slow" />
                  </div>
                  Image Compressor
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-base sm:text-lg">
                  Reduce image file size while maintaining quality 📸
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ImageCompressor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tts" className="mt-8">
            <Card className="dark:bg-gray-900/50 dark:border-gray-800 backdrop-blur-xl transition-all duration-700 hover:shadow-[0_0_60px_rgba(168,85,247,0.4)] hover:scale-[1.02] animate-swingIn border-2 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-50"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 dark:text-white animate-textBounceIn text-2xl sm:text-3xl">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-500 hover:scale-110 hover:rotate-12">
                    <Volume2 className="h-7 w-7 text-white animate-pulse" />
                  </div>
                  Text-to-Speech
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-base sm:text-lg">
                  Convert any text to natural-sounding speech 🔊
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <TextToSpeech />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="mt-8">
            <Card className="dark:bg-gray-900/50 dark:border-gray-800 backdrop-blur-xl transition-all duration-700 hover:shadow-[0_0_60px_rgba(34,197,94,0.4)] hover:scale-[1.02] animate-swingIn border-2 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-green-500/5 opacity-50"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 dark:text-white animate-textBounceIn text-2xl sm:text-3xl">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-500 hover:scale-110 hover:rotate-12">
                    <QrCode className="h-7 w-7 text-white animate-spin-slow" />
                  </div>
                  QR Code Generator
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-base sm:text-lg">
                  Generate QR codes for any text or URL instantly 📱
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <QRCodeGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clipboard" className="mt-8">
            <Card className="dark:bg-gray-900/50 dark:border-gray-800 backdrop-blur-xl transition-all duration-700 hover:shadow-[0_0_60px_rgba(249,115,22,0.4)] hover:scale-[1.02] animate-swingIn border-2 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-orange-500/5 opacity-50"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 dark:text-white animate-textBounceIn text-2xl sm:text-3xl">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-500 hover:scale-110 hover:rotate-12">
                    <ClipboardCopy className="h-7 w-7 text-white animate-wiggle" />
                  </div>
                  Clipboard Manager
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-base sm:text-lg">
                  Save and manage text snippets for quick access 📋
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ClipboardManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AdSense Ad */}
        <div className="mt-16 animate-fadeUp">
          <AdSenseAd />
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #f97316, #dc2626);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ea580c, #b91c1c);
        }
      `}</style>
    </div>
  );
}
