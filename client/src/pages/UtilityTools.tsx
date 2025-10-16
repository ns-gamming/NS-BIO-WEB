
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
import { ImageDown, Volume2, QrCode, ClipboardCopy, Download, Upload, Mic, MicOff, Settings, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const ImageCompressor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [targetSize, setTargetSize] = useState<number>(2); // in MB
  const [compressionMode, setCompressionMode] = useState<'quality' | 'size'>('quality');
  const [quality, setQuality] = useState<number>(85);
  const [imageFormat, setImageFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressionPresets = [
    { label: '100 KB', size: 0.1, quality: 70, format: 'jpeg' as const, desc: 'Ultra compressed for fast loading' },
    { label: '500 KB', size: 0.5, quality: 80, format: 'jpeg' as const, desc: 'Good balance for web use' },
    { label: '1 MB', size: 1, quality: 85, format: 'jpeg' as const, desc: 'Instagram & social media' },
    { label: '2 MB', size: 2, quality: 90, format: 'jpeg' as const, desc: 'YouTube thumbnails' },
    { label: '3 MB', size: 3, quality: 92, format: 'jpeg' as const, desc: 'High quality images' },
    { label: '5 MB', size: 5, quality: 95, format: 'jpeg' as const, desc: 'Maximum quality allowed' },
  ];

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

  const compressImage = (imageData: string, originalFileSize: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Start with original dimensions
      let width = img.width;
      let height = img.height;
      let currentQuality = quality / 100;

      if (compressionMode === 'size') {
        // Compress to target file size
        const targetBytes = targetSize * 1024 * 1024;
        
        // Estimate initial scale based on target size
        const estimatedScale = Math.sqrt(targetBytes / originalFileSize);
        width = Math.round(img.width * Math.min(estimatedScale, 1));
        height = Math.round(img.height * Math.min(estimatedScale, 1));
      } else {
        // Quality mode - maintain dimensions, adjust quality only
        const maxWidth = 1920;
        const maxHeight = 1080;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Get MIME type based on format
      const mimeType = imageFormat === 'png' ? 'image/png' : imageFormat === 'webp' ? 'image/webp' : 'image/jpeg';
      
      let compressed = canvas.toDataURL(mimeType, currentQuality);
      let estimatedSize = Math.round(compressed.length * 0.75);

      // If size mode, iteratively adjust quality to hit target
      if (compressionMode === 'size') {
        const targetBytes = targetSize * 1024 * 1024;
        let iterations = 0;
        const maxIterations = 10;

        while (Math.abs(estimatedSize - targetBytes) > targetBytes * 0.1 && iterations < maxIterations) {
          if (estimatedSize > targetBytes) {
            currentQuality *= 0.9;
          } else {
            currentQuality *= 1.05;
          }
          currentQuality = Math.max(0.1, Math.min(1, currentQuality));
          
          compressed = canvas.toDataURL(mimeType, currentQuality);
          estimatedSize = Math.round(compressed.length * 0.75);
          iterations++;
        }
      }

      setCompressedImage(compressed);
      setCompressedSize(estimatedSize);

      const reduction = ((originalFileSize - estimatedSize) / originalFileSize) * 100;
      toast({
        title: "✅ Compression Complete!",
        description: `Reduced by ${Math.round(reduction)}% | Size: ${formatFileSize(estimatedSize)}`
      });
    };
    img.src = imageData;
  };

  const applyPreset = (preset: typeof compressionPresets[0]) => {
    setTargetSize(preset.size);
    setQuality(preset.quality);
    setImageFormat(preset.format);
    if (originalImage) {
      compressImage(originalImage, originalSize);
    }
  };

  const downloadCompressed = () => {
    if (!compressedImage) return;
    const extension = imageFormat === 'png' ? 'png' : imageFormat === 'webp' ? 'webp' : 'jpg';
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed-image-${targetSize}mb.${extension}`;
    link.click();
    toast({ title: "Downloaded!", description: `Image saved as ${extension.toUpperCase()}` });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* Upload Area */}
      <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] animate-popIn" onClick={() => fileInputRef.current?.click()}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl"></div>
        <Upload className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-6 animate-bounce-slow group-hover:scale-125 transition-transform duration-500" />
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 animate-slideInFromBottom">Click to upload an image</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 animate-fadeInLeft" style={{ animationDelay: '0.2s' }}>JPG, PNG, WEBP • Max 10MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          data-testid="input-image-upload"
        />
      </div>

      {/* Compression Presets */}
      <div className="space-y-4 animate-slideInFromLeft">
        <Label className="text-lg font-bold dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-500 animate-spin-slow" />
          Quick Size Presets
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {compressionPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] text-center group relative overflow-hidden"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-500"></div>
              <p className="font-bold text-lg dark:text-white mb-1 group-hover:text-cyan-500 transition-colors relative z-10">{preset.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors relative z-10">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-cyan-500/5 border-2 border-gray-200 dark:border-gray-700 animate-fadeUp">
        <Label className="text-lg font-bold dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          Advanced Settings
        </Label>

        {/* Compression Mode */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-gray-300">Compression Mode</Label>
          <div className="flex gap-2">
            <button
              onClick={() => setCompressionMode('quality')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                compressionMode === 'quality'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              Quality First
            </button>
            <button
              onClick={() => setCompressionMode('size')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                compressionMode === 'size'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              Target Size
            </button>
          </div>
        </div>

        {/* Target Size Slider */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold dark:text-gray-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
              Target Size: <span className="text-cyan-600 dark:text-cyan-400 font-bold">{targetSize.toFixed(1)} MB</span>
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              {(targetSize * 1024).toFixed(0)} KB
            </span>
          </Label>
          <Slider
            value={[targetSize]}
            onValueChange={(value) => {
              setTargetSize(value[0]);
              if (originalImage) compressImage(originalImage, originalSize);
            }}
            min={0.1}
            max={5}
            step={0.1}
            className="dark:bg-gray-700 cursor-pointer"
          />
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="text-left">
              <span className="block font-semibold">Min</span>
              <span>100 KB</span>
            </div>
            <div className="text-center">
              <span className="block font-semibold">Recommended</span>
              <span>2 MB</span>
            </div>
            <div className="text-right">
              <span className="block font-semibold">Max</span>
              <span>5 MB</span>
            </div>
          </div>
        </div>

        {/* Quality Slider */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-gray-300">Quality: {quality}%</Label>
          <Slider
            value={[quality]}
            onValueChange={(value) => {
              setQuality(value[0]);
              if (originalImage) compressImage(originalImage, originalSize);
            }}
            min={10}
            max={100}
            step={5}
            className="dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Low (Small Size)</span>
            <span>High (Best Quality)</span>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-gray-300">Output Format</Label>
          <div className="grid grid-cols-3 gap-2">
            {(['jpeg', 'png', 'webp'] as const).map((format) => (
              <button
                key={format}
                onClick={() => {
                  setImageFormat(format);
                  if (originalImage) compressImage(originalImage, originalSize);
                }}
                className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  imageFormat === format
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Display */}
      {originalImage && compressedImage && (
        <div className="grid md:grid-cols-2 gap-6 animate-zoomIn">
          <div className="space-y-3 animate-slideInFromLeft group">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold dark:text-white">Original</p>
              <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">{formatFileSize(originalSize)}</span>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <img src={originalImage} alt="Original" className="rounded-2xl w-full transition-all duration-700 group-hover:scale-110 hover:shadow-[0_0_60px_rgba(6,182,212,0.5)]" data-testid="img-original" />
            </div>
          </div>
          <div className="space-y-3 animate-slideInFromRight group">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold dark:text-white">Compressed</p>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">{formatFileSize(compressedSize)}</span>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <img src={compressedImage} alt="Compressed" className="rounded-2xl w-full transition-all duration-700 group-hover:scale-110 hover:shadow-[0_0_60px_rgba(6,182,212,0.5)]" data-testid="img-compressed" />
            </div>
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                ✅ Saved {((originalSize - compressedSize) / originalSize * 100).toFixed(1)}% • {formatFileSize(originalSize - compressedSize)} smaller
              </p>
            </div>
            <Button onClick={downloadCompressed} className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 hover:from-cyan-600 hover:via-blue-600 hover:to-cyan-700 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-bounceIn text-base font-semibold py-6" data-testid="button-download-compressed">
              <Download className="mr-2 h-5 w-5 animate-bounce" />
              Download {imageFormat.toUpperCase()} ({formatFileSize(compressedSize)})
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1);
  const [voicePitch, setVoicePitch] = useState<number>(1);
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = async () => {
    if (!text.trim()) {
      toast({ title: "Error", description: "Please enter some text first" });
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
      } catch (error) {
        console.log("Recording not available, will use system audio");
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
      if (availableVoices.length > 0) {
        utterance.voice = availableVoices[selectedVoice] || availableVoices[0];
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        toast({ title: "✅ Complete!", description: "Audio is ready to download" });
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
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
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) {
      // Create audio using Web Audio API as fallback
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
      if (availableVoices.length > 0) {
        utterance.voice = availableVoices[selectedVoice] || availableVoices[0];
      }
      
      toast({ 
        title: "Generating Audio...", 
        description: "Please click 'Speak Text' first to generate audio" 
      });
      return;
    }

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `tts-audio-${Date.now()}.webm`;
    link.click();
    toast({ title: "Downloaded!", description: "Audio file saved successfully" });
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

      {/* Voice Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 border-2 border-purple-500/30 animate-slideInFromLeft">
        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-gray-300 flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-500" />
            Voice
          </Label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(Number(e.target.value))}
            className="w-full p-2 rounded-lg border-2 border-purple-500/30 dark:bg-gray-800 dark:text-white transition-all duration-300 hover:border-purple-500 focus:border-purple-500"
          >
            {availableVoices.map((voice, index) => (
              <option key={index} value={index}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-gray-300">Speed: {voiceSpeed.toFixed(1)}x</Label>
          <Slider
            value={[voiceSpeed]}
            onValueChange={(value) => setVoiceSpeed(value[0])}
            min={0.5}
            max={2}
            step={0.1}
            className="dark:bg-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-gray-300">Pitch: {voicePitch.toFixed(1)}</Label>
          <Slider
            value={[voicePitch]}
            onValueChange={(value) => setVoicePitch(value[0])}
            min={0.5}
            max={2}
            step={0.1}
            className="dark:bg-gray-700"
          />
        </div>
      </div>

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

      {audioUrl && (
        <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 border-2 border-green-500/30 animate-zoomIn">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-green-600 dark:text-green-400">✅ Audio Generated Successfully!</p>
          </div>
          <audio controls src={audioUrl} className="w-full rounded-lg animate-slideInFromBottom" />
          <Button onClick={downloadAudio} className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] text-base font-semibold py-6">
            <Download className="mr-2 h-5 w-5 animate-bounce" />
            Download Audio
          </Button>
        </div>
      )}
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
    document.title = 'Free Image Compressor - YouTube Thumbnail Optimizer, Reduce Image Size to MB/KB | NS Gamming';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional image compressor for YouTubers & creators. Compress images to 100KB-5MB for YouTube thumbnails, Instagram posts. Free online tool with quality presets - JPEG, PNG, WebP support. #ImageCompressor #YouTubeThumbnails');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'image compressor, compress image to 2mb, youtube thumbnail compressor, reduce image size to mb, compress image to 100kb, compress image online free, image size reducer, jpeg compressor, png compressor, webp converter, thumbnail optimizer, image compression tool, reduce photo size, compress image for youtube, instagram image compressor, image quality optimizer, online image resizer, free image compression, best image compressor 2025');
    }

    // Add structured data for better SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'NS Gamming Image Compressor',
      'applicationCategory': 'UtilityApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'description': 'Professional image compression tool for YouTube thumbnails and social media. Compress images to specific sizes (100KB to 5MB) with quality control.',
      'featureList': [
        'YouTube Thumbnail Optimization (2MB)',
        'Instagram Post Compression (1MB)',
        'Custom size targeting (100KB to 5MB)',
        'Multiple format support (JPEG, PNG, WebP)',
        'Quality control slider',
        'Real-time compression preview'
      ]
    };

    const existingScript = document.querySelector('script[type="application/ld+json"][data-image-compressor]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-image-compressor', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
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
                  Advanced Image Compressor
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-base sm:text-lg space-y-1">
                  <p>Compress images to 100KB-5MB for YouTube thumbnails & social media 📸</p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">#ImageCompressor #YouTubeThumbnails #CompressImage #ImageOptimizer</p>
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
