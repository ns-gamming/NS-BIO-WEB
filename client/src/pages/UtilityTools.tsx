import { useState, useRef } from 'react';
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
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors" onClick={() => fileInputRef.current?.click()}>
        <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload an image</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Supports JPG, PNG, WEBP</p>
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
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold dark:text-white">Original ({formatFileSize(originalSize)})</p>
            <img src={originalImage} alt="Original" className="rounded-lg w-full" data-testid="img-original" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold dark:text-white">Compressed ({formatFileSize(compressedSize)})</p>
            <img src={compressedImage} alt="Compressed" className="rounded-lg w-full" data-testid="img-compressed" />
            <Button onClick={downloadCompressed} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600" data-testid="button-download-compressed">
              <Download className="mr-2 h-4 w-4" />
              Download Compressed
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
    <div className="space-y-4">
      <Textarea
        placeholder="Enter text to convert to speech..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="dark:bg-gray-800 dark:text-white"
        data-testid="textarea-tts"
      />
      <div className="flex gap-2">
        {!isSpeaking ? (
          <Button onClick={speak} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" data-testid="button-speak">
            <Volume2 className="mr-2 h-4 w-4" />
            Speak
          </Button>
        ) : (
          <Button onClick={stopSpeaking} variant="destructive" className="flex-1" data-testid="button-stop-speak">
            <MicOff className="mr-2 h-4 w-4" />
            Stop
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label data-testid="label-qr-input">Enter Text or URL</Label>
        <Input
          placeholder="https://nsgamming.xyz"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="dark:bg-gray-800 dark:text-white"
          data-testid="input-qr-text"
        />
      </div>

      <Button onClick={generateQRCode} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" data-testid="button-generate-qr">
        <QrCode className="mr-2 h-4 w-4" />
        Generate QR Code
      </Button>

      {qrCodeUrl && (
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg">
            <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" data-testid="img-qrcode" />
          </div>
          <Button onClick={downloadQRCode} variant="outline" className="w-full dark:border-green-500 dark:text-green-400 dark:hover:bg-green-500/10" data-testid="button-download-qr">
            <Download className="mr-2 h-4 w-4" />
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label data-testid="label-note-input">Add New Note</Label>
        <Textarea
          placeholder="Type or paste text to save..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          rows={4}
          className="dark:bg-gray-800 dark:text-white"
          data-testid="textarea-clipboard"
        />
      </div>

      <Button onClick={saveNote} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" data-testid="button-save-note">
        <ClipboardCopy className="mr-2 h-4 w-4" />
        Save Note
      </Button>

      {notes.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm dark:text-white">Saved Notes ({notes.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notes.map((note, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 border border-orange-500/20 dark:border-orange-500/40"
                data-testid={`note-item-${index}`}
              >
                <p className="text-sm flex-1 break-words dark:text-white">{note}</p>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(note)}
                    data-testid={`button-copy-note-${index}`}
                    className="dark:hover:bg-gray-700"
                  >
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(index)}
                    data-testid={`button-delete-note-${index}`}
                    className="dark:hover:bg-gray-700 text-red-500"
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
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HeroSection
        title="Utility Tools"
        subtitle="Image compression, text-to-speech, QR codes, and productivity tools 🛠️"
      />

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 dark:bg-gray-800" data-testid="tabs-utility">
            <TabsTrigger value="image" data-testid="tab-image">Image Compressor</TabsTrigger>
            <TabsTrigger value="tts" data-testid="tab-tts">Text-to-Speech</TabsTrigger>
            <TabsTrigger value="qr" data-testid="tab-qr">QR Code</TabsTrigger>
            <TabsTrigger value="clipboard" data-testid="tab-clipboard">Clipboard Manager</TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-6">
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <ImageDown className="h-5 w-5 text-cyan-500" />
                  Image Compressor
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Reduce image file size while maintaining quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageCompressor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tts" className="mt-6">
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Volume2 className="h-5 w-5 text-purple-500" />
                  Text-to-Speech
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Convert any text to natural-sounding speech
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TextToSpeech />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="mt-6">
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <QrCode className="h-5 w-5 text-green-500" />
                  QR Code Generator
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Generate QR codes for any text or URL instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRCodeGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clipboard" className="mt-6">
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <ClipboardCopy className="h-5 w-5 text-orange-500" />
                  Clipboard Manager
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Save and manage text snippets for quick access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClipboardManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AdSense Ad */}
        <div className="mt-12">
          <AdSenseAd />
        </div>
      </div>
    </div>
  );
}
