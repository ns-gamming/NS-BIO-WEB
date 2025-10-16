import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import HeroSection from '@/components/HeroSection';
import AdSenseAd from '@/components/AdSenseAd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, Sparkles, Shield, Gamepad2, Wand2, QrCode, Download, Upload,
  ImageDown, Volume2, ClipboardCopy, Mic, MicOff, Wrench, Zap, Star
} from 'lucide-react';
import QRCode from 'qrcode';

// Free Fire Tools Components
const FFNameGenerator = () => {
  const [baseName, setBaseName] = useState('');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const { toast } = useToast();

  const fancyStyles = {
    bold: '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳0123456789',
    italic: '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻0123456789',
    fancy: '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡',
  };

  const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const symbols = ['✨', '★', '⚡', '🔥', '👑', '💎', '🎮', '🎯', '⭐', '✪'];

  const convertText = (text: string, style: string) => {
    let result = '';
    for (const char of text) {
      const index = normal.indexOf(char);
      if (index !== -1) {
        result += fancyStyles[style as keyof typeof fancyStyles][index];
      } else {
        result += char;
      }
    }
    return result;
  };

  const generateNames = () => {
    if (!baseName.trim()) {
      toast({ title: "Oops!", description: "Please enter a name first!" });
      return;
    }

    const names = [
      `${symbols[0]} ${convertText(baseName, 'bold')} ${symbols[0]}`,
      `${symbols[1]}${convertText(baseName, 'italic')}${symbols[1]}`,
      `${symbols[2]} ${convertText(baseName, 'fancy')} ${symbols[3]}`,
      `${symbols[4]}「${convertText(baseName, 'bold')}」${symbols[5]}`,
      `${symbols[6]} ${baseName} ${symbols[7]}`,
      `༺${convertText(baseName, 'italic')}༻`,
      `꧁${convertText(baseName, 'fancy')}꧂`,
      `【${symbols[8]}${convertText(baseName, 'bold')}${symbols[8]}】`,
    ];

    setGeneratedNames(names);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Name copied to clipboard" });
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="flex gap-2 animate-slideInFromLeft" style={{ animationDelay: '0.1s' }}>
        <Input
          placeholder="Enter your name..."
          value={baseName}
          onChange={(e) => setBaseName(e.target.value)}
          data-testid="input-ffname"
          className="flex-1 dark:bg-gray-800 dark:text-white transition-all duration-300 focus:scale-[1.02] focus:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        />
        <Button onClick={generateNames} data-testid="button-generate-ffname" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:scale-110 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
          <Wand2 className="mr-2 h-4 w-4 animate-spin-slow" />
          Generate
        </Button>
      </div>

      {generatedNames.length > 0 && (
        <div className="grid gap-3">
          {generatedNames.map((name, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-500/20 dark:border-cyan-500/40 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 animate-bounceIn"
              data-testid={`text-ffname-${index}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="text-lg font-semibold dark:text-white animate-textShine">{name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(name)}
                data-testid={`button-copy-ffname-${index}`}
                className="dark:hover:bg-gray-700 hover:scale-125 transition-all duration-300"
              >
                <Copy className="h-4 w-4 hover:animate-wiggle" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const UIDGenerator = () => {
  const [uidCount, setUidCount] = useState(1);
  const [generatedUIDs, setGeneratedUIDs] = useState<string[]>([]);
  const { toast } = useToast();

  const generateUIDs = () => {
    const uids: string[] = [];
    for (let i = 0; i < uidCount; i++) {
      const uid = Math.floor(Math.random() * (9999999999 - 100000000) + 100000000).toString();
      uids.push(uid);
    }
    setGeneratedUIDs(uids);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "UID copied to clipboard" });
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="space-y-2 animate-slideInFromRight" style={{ animationDelay: '0.1s' }}>
        <Label data-testid="label-uid-count" className="text-lg font-semibold animate-textFadeSlide">Number of UIDs: {uidCount}</Label>
        <Slider
          value={[uidCount]}
          onValueChange={(value) => setUidCount(value[0])}
          max={10}
          min={1}
          step={1}
          className="dark:bg-gray-700 transition-all duration-300 hover:scale-[1.02]"
          data-testid="slider-uid-count"
        />
      </div>

      <Button onClick={generateUIDs} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 animate-popIn" data-testid="button-generate-uid" style={{ animationDelay: '0.2s' }}>
        <Gamepad2 className="mr-2 h-4 w-4 animate-bounce" />
        Generate UIDs
      </Button>

      {generatedUIDs.length > 0 && (
        <div className="grid gap-2">
          {generatedUIDs.map((uid, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-500/20 dark:border-purple-500/40 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 animate-slideInFromBottom"
              data-testid={`text-uid-${index}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="font-mono text-lg dark:text-white animate-countUp">{uid}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(uid)}
                data-testid={`button-copy-uid-${index}`}
                className="dark:hover:bg-gray-700 hover:scale-125 transition-all duration-300"
              >
                <Copy className="h-4 w-4 hover:animate-wiggle" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SensitivityGenerator = () => {
  const [gameMode, setGameMode] = useState('assault');
  const [sensitivity, setSensitivity] = useState<any>(null);
  const { toast } = useToast();

  const sensitivityPresets = {
    assault: { general: 70, red_dot: 60, scope_2x: 55, scope_4x: 50, awm: 45 },
    sniper: { general: 50, red_dot: 45, scope_2x: 40, scope_4x: 35, awm: 30 },
    rusher: { general: 90, red_dot: 85, scope_2x: 80, scope_4x: 70, awm: 60 },
    balanced: { general: 65, red_dot: 60, scope_2x: 55, scope_4x: 50, awm: 45 },
  };

  const generateSensitivity = () => {
    setSensitivity(sensitivityPresets[gameMode as keyof typeof sensitivityPresets]);
    toast({ title: "Generated!", description: "Sensitivity settings ready to use" });
  };

  const downloadSettings = () => {
    if (!sensitivity) return;
    const data = JSON.stringify(sensitivity, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${gameMode}-sensitivity.json`;
    link.click();
    toast({ title: "Downloaded!", description: "Settings saved to file" });
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="space-y-2 animate-zoomIn" style={{ animationDelay: '0.1s' }}>
        <Label data-testid="label-gamemode" className="text-lg font-semibold animate-textFadeSlide">Select Game Mode</Label>
        <Select value={gameMode} onValueChange={setGameMode}>
          <SelectTrigger className="dark:bg-gray-800 dark:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]" data-testid="select-gamemode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:text-white">
            <SelectItem value="assault">Assault Rifle Main</SelectItem>
            <SelectItem value="sniper">Sniper Main</SelectItem>
            <SelectItem value="rusher">Rusher / Shotgun</SelectItem>
            <SelectItem value="balanced">Balanced All-Rounder</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={generateSensitivity} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 animate-swingIn" data-testid="button-generate-sensitivity" style={{ animationDelay: '0.2s' }}>
        <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
        Generate Settings
      </Button>

      {sensitivity && (
        <div className="space-y-3 animate-popIn" style={{ animationDelay: '0.3s' }}>
          <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-500/20 dark:border-green-500/40 space-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] transition-all duration-300">
            <div className="flex justify-between animate-slideInFromLeft" data-testid="text-general-sensitivity" style={{ animationDelay: '0.1s' }}>
              <span className="dark:text-gray-300">General:</span>
              <span className="font-bold dark:text-white animate-countUp">{sensitivity.general}</span>
            </div>
            <div className="flex justify-between animate-slideInFromRight" data-testid="text-reddot-sensitivity" style={{ animationDelay: '0.15s' }}>
              <span className="dark:text-gray-300">Red Dot:</span>
              <span className="font-bold dark:text-white animate-countUp">{sensitivity.red_dot}</span>
            </div>
            <div className="flex justify-between animate-slideInFromLeft" data-testid="text-2x-sensitivity" style={{ animationDelay: '0.2s' }}>
              <span className="dark:text-gray-300">2x Scope:</span>
              <span className="font-bold dark:text-white animate-countUp">{sensitivity.scope_2x}</span>
            </div>
            <div className="flex justify-between animate-slideInFromRight" data-testid="text-4x-sensitivity" style={{ animationDelay: '0.25s' }}>
              <span className="dark:text-gray-300">4x Scope:</span>
              <span className="font-bold dark:text-white animate-countUp">{sensitivity.scope_4x}</span>
            </div>
            <div className="flex justify-between animate-slideInFromLeft" data-testid="text-awm-sensitivity" style={{ animationDelay: '0.3s' }}>
              <span className="dark:text-gray-300">AWM:</span>
              <span className="font-bold dark:text-white animate-countUp">{sensitivity.awm}</span>
            </div>
          </div>

          <Button onClick={downloadSettings} variant="outline" className="w-full dark:border-green-500 dark:text-green-400 dark:hover:bg-green-500/10 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300 animate-bounceIn" data-testid="button-download-sensitivity">
            <Download className="mr-2 h-4 w-4 animate-bounce" />
            Download Settings
          </Button>
        </div>
      )}
    </div>
  );
};

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const generatePassword = () => {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({ title: "Copied!", description: "Password copied to clipboard" });
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="space-y-2 animate-slideInFromLeft" style={{ animationDelay: '0.1s' }}>
        <Label data-testid="label-password-length" className="text-lg font-semibold animate-textFadeSlide">Length: {length}</Label>
        <Slider
          value={[length]}
          onValueChange={(value) => setLength(value[0])}
          max={32}
          min={8}
          step={1}
          className="dark:bg-gray-700 transition-all duration-300 hover:scale-[1.02]"
          data-testid="slider-password-length"
        />
      </div>

      <div className="space-y-2 animate-slideInFromRight" style={{ animationDelay: '0.2s' }}>
        <label className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-4 h-4 text-cyan-500 rounded transition-all duration-300"
            data-testid="checkbox-include-numbers"
          />
          <span className="dark:text-gray-300">Include Numbers</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-4 h-4 text-cyan-500 rounded transition-all duration-300"
            data-testid="checkbox-include-symbols"
          />
          <span className="dark:text-gray-300">Include Symbols</span>
        </label>
      </div>

      <Button onClick={generatePassword} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-300 animate-popIn" data-testid="button-generate-password" style={{ animationDelay: '0.3s' }}>
        <Shield className="mr-2 h-4 w-4 animate-pulse" />
        Generate Password
      </Button>

      {password && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 border border-orange-500/20 dark:border-orange-500/40 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-all duration-300 animate-bounceIn">
          <span className="font-mono text-lg break-all dark:text-white animate-textShine" data-testid="text-generated-password">{password}</span>
          <Button variant="ghost" size="sm" onClick={copyToClipboard} data-testid="button-copy-password" className="dark:hover:bg-gray-700 hover:scale-125 transition-all duration-300">
            <Copy className="h-4 w-4 hover:animate-wiggle" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Utility Tools Components
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
    <div className="space-y-4 animate-fadeUp">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-popIn" onClick={() => fileInputRef.current?.click()}>
        <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4 animate-bounce-slow" />
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-slideInFromBottom">Click to upload image</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 animate-fadeInLeft" style={{ animationDelay: '0.2s' }}>JPG, PNG, WEBP</p>
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
        <div className="grid md:grid-cols-2 gap-4 animate-zoomIn">
          <div className="space-y-2 animate-slideInFromLeft">
            <p className="text-sm font-semibold dark:text-white animate-textShine">Original ({formatFileSize(originalSize)})</p>
            <img src={originalImage} alt="Original" className="rounded-lg w-full transition-all duration-500 hover:scale-105 hover:shadow-2xl" data-testid="img-original" />
          </div>
          <div className="space-y-2 animate-slideInFromRight">
            <p className="text-sm font-semibold dark:text-white animate-textShine">Compressed ({formatFileSize(compressedSize)})</p>
            <img src={compressedImage} alt="Compressed" className="rounded-lg w-full transition-all duration-500 hover:scale-105 hover:shadow-2xl" data-testid="img-compressed" />
            <Button onClick={downloadCompressed} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-bounceIn" data-testid="button-download-compressed">
              <Download className="mr-2 h-4 w-4 animate-bounce" />
              Download
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
      toast({ title: "Not Supported", description: "Text-to-speech not supported", variant: "destructive" });
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <Textarea
        placeholder="Enter text to convert to speech..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="dark:bg-gray-800 dark:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] focus:shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-slideInFromBottom"
        data-testid="textarea-tts"
      />
      <div className="flex gap-2">
        {!isSpeaking ? (
          <Button onClick={speak} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-popIn" data-testid="button-speak">
            <Volume2 className="mr-2 h-4 w-4 animate-pulse" />
            Speak
          </Button>
        ) : (
          <Button onClick={stopSpeaking} variant="destructive" className="flex-1 animate-heartBeat transition-all duration-300 hover:scale-105" data-testid="button-stop-speak">
            <MicOff className="mr-2 h-4 w-4 animate-wiggle" />
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
    <div className="space-y-4 animate-fadeUp">
      <div className="space-y-2 animate-slideInFromLeft">
        <Label data-testid="label-qr-input" className="animate-textShine">Enter Text or URL</Label>
        <Input
          placeholder="https://example.com"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="dark:bg-gray-800 dark:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] focus:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
          data-testid="input-qr-text"
        />
      </div>

      <Button onClick={generateQRCode} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] animate-bounceIn" data-testid="button-generate-qr">
        <QrCode className="mr-2 h-4 w-4 animate-spin-slow" />
        Generate QR Code
      </Button>

      {qrCodeUrl && (
        <div className="flex flex-col items-center space-y-4 animate-zoomIn">
          <div className="p-4 bg-white rounded-lg shadow-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-500 hover:scale-105 animate-rotateGlow">
            <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" data-testid="img-qrcode" />
          </div>
          <Button onClick={downloadQRCode} variant="outline" className="w-full dark:border-green-500 dark:text-green-400 dark:hover:bg-green-500/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-slideInFromBottom" data-testid="button-download-qr">
            <Download className="mr-2 h-4 w-4 animate-bounce" />
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
    <div className="space-y-4 animate-fadeUp">
      <div className="space-y-2 animate-slideInFromLeft">
        <Label data-testid="label-note-input" className="animate-textShine">Add New Note</Label>
        <Textarea
          placeholder="Type or paste text to save..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          rows={4}
          className="dark:bg-gray-800 dark:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] focus:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
          data-testid="textarea-clipboard"
        />
      </div>

      <Button onClick={saveNote} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] animate-bounceIn" data-testid="button-save-note">
        <ClipboardCopy className="mr-2 h-4 w-4 animate-pulse" />
        Save Note
      </Button>

      {notes.length > 0 && (
        <div className="space-y-2 animate-slideInFromBottom">
          <h3 className="font-semibold text-sm dark:text-white animate-textShine">Saved Notes ({notes.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notes.map((note, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 border border-orange-500/20 dark:border-orange-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] animate-popIn"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`note-item-${index}`}
              >
                <p className="text-sm flex-1 break-words dark:text-white">{note}</p>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(note)}
                    data-testid={`button-copy-note-${index}`}
                    className="dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                  >
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(index)}
                    data-testid={`button-delete-note-${index}`}
                    className="dark:hover:bg-gray-700 text-red-500 transition-all duration-300 hover:scale-110 hover:rotate-12"
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

export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // SEO Meta Tags
    if (!selectedCategory) {
      document.title = 'Free Fire Tools & Utilities - Name Generator, UID Creator, Sensitivity | NS Gamming';
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Free Fire tools hub: Stylish name generator, UID creator, sensitivity optimizer, password generator. Best Free Fire utilities and general productivity tools.');
      }

      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', 'free fire tools, ff name generator, free fire uid, sensitivity settings, free fire utilities, gaming tools, password generator, stylish names');
      }
    } else if (selectedCategory === 'ff-tools') {
      document.title = 'Free Fire Tools - Stylish Names, UID, Sensitivity Settings | NS Gamming';
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Free Fire gaming tools: Create stylish names with fancy fonts, generate random UIDs, optimize sensitivity settings, and create secure passwords for your FF account.');
      }
    } else if (selectedCategory === 'utilities') {
      document.title = 'General Utilities - Image Tools, QR Generator, Productivity | NS Gamming';
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Free productivity utilities: Image compressor, QR code generator, text-to-speech converter, clipboard manager. Boost your productivity with these free online tools.');
      }
    }
  }, [selectedCategory]);

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500 pt-20 pb-16 overflow-hidden">
        {/* Enhanced Animated Background with More Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-3xl animate-floatSlow"></div>
          <div className="absolute top-1/3 right-10 w-[30rem] h-[30rem] bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-[28rem] h-[28rem] bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Additional Floating Particles */}
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-cyan-400/20 dark:bg-cyan-400/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/3 w-40 h-40 bg-purple-400/20 dark:bg-purple-400/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/3 left-2/3 w-36 h-36 bg-orange-400/20 dark:bg-orange-400/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-16 animate-fadeUp">
            <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-orange-500/20 dark:from-cyan-500/30 dark:via-purple-500/30 dark:to-orange-500/30 rounded-full border border-cyan-500/30 dark:border-cyan-500/50 backdrop-blur-sm animate-shimmer shadow-lg">
              <span className="text-sm font-bold bg-gradient-to-r from-cyan-600 via-purple-600 to-orange-600 dark:from-cyan-400 dark:via-purple-400 dark:to-orange-400 bg-clip-text text-transparent">
                ✨ Choose Your Toolset
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-orbitron font-bold mb-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-textShine drop-shadow-2xl">
              🛠️ Tools Hub
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fadeUp leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Powerful utilities and gaming tools to supercharge your productivity and enhance your gaming experience
            </p>
          </div>

          {/* Modern Card Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto mb-16">
            {/* Free Fire Tools Card - Enhanced with 3D Effects */}
            <div 
              className="group relative overflow-hidden rounded-3xl cursor-pointer transform transition-all duration-700 hover:-translate-y-4 hover:scale-105 animate-scaleIn perspective-1000"
              onClick={() => setSelectedCategory('ff-tools')}
              data-testid="card-category-ff-tools"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Gradient Border Effect with Animation */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-md animate-gradient-shift"></div>

              {/* Glow Effect on Hover */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 opacity-0 group-hover:opacity-30 blur-3xl rounded-3xl transition-opacity duration-700"></div>

              {/* Card Content with 3D Transform */}
              <div className="relative bg-white dark:bg-gray-900 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-800 group-hover:border-cyan-500/60 dark:group-hover:border-cyan-500/80 rounded-3xl p-8 sm:p-10 transition-all duration-500 shadow-2xl group-hover:shadow-[0_30px_100px_rgba(6,182,212,0.4)] dark:group-hover:shadow-[0_30px_100px_rgba(6,182,212,0.6)]" style={{ transform: 'translateZ(20px)' }}>

                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-cyan-500/5 dark:from-cyan-500/10 dark:via-blue-500/10 dark:to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                {/* Enhanced Animated Particles with More Elements */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                  <div className="absolute top-20 right-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute bottom-10 left-20 w-2 h-2 bg-cyan-300 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" style={{ animationDelay: '0.6s' }}></div>
                  <div className="absolute bottom-20 right-10 w-2 h-2 bg-blue-300 rounded-full animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]" style={{ animationDelay: '0.9s' }}></div>
                  <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
                </div>

                {/* Icon Container with Enhanced 3D Effect */}
                <div className="relative mb-8">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-cyan-500 via-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_80px_rgba(6,182,212,1)] transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 animate-pulse-slow" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}>
                    <Sparkles className="w-14 h-14 sm:w-16 sm:h-16 text-white animate-pulse group-hover:animate-spin-slow" />
                  </div>
                  <div className="absolute inset-0 bg-cyan-500/60 dark:bg-cyan-500/80 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700"></div>
                </div>

                {/* Title */}
                <h3 className="relative text-3xl sm:text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent group-hover:scale-105 transform transition-transform duration-300">
                  Free Fire Tools 🎮
                </h3>

                {/* Description */}
                <p className="relative text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Stylish name generator, UID creator, sensitivity optimizer, and secure password tools for your gaming journey
                </p>

                {/* Feature Pills */}
                <div className="relative flex flex-wrap gap-2 mb-8">
                  <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/30 dark:to-blue-500/30 border border-cyan-500/40 dark:border-cyan-500/50 rounded-full text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-300 transform group-hover:scale-110 transition-all duration-300 shadow-md">
                    Name Gen
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 border border-blue-500/40 dark:border-blue-500/50 rounded-full text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.05s' }}>
                    UID Creator
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 border border-purple-500/40 dark:border-purple-500/50 rounded-full text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.1s' }}>
                    Sensitivity
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-red-500/20 dark:from-pink-500/30 dark:to-red-500/30 border border-pink-500/40 dark:border-pink-500/50 rounded-full text-xs sm:text-sm font-bold text-pink-700 dark:text-pink-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.15s' }}>
                    Password
                  </span>
                </div>

                {/* CTA */}
                <div className="relative flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent group-hover:translate-x-2 transition-transform duration-300">
                    Explore Now →
                  </span>
                  <div className="relative">
                    <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-500 animate-pulse" />
                    <div className="absolute inset-0 bg-cyan-500/60 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* General Utilities Card - Enhanced with 3D Effects */}
            <div 
              className="group relative overflow-hidden rounded-3xl cursor-pointer transform transition-all duration-700 hover:-translate-y-4 hover:scale-105 animate-scaleIn perspective-1000"
              style={{ animationDelay: '0.15s', transformStyle: 'preserve-3d' }}
              onClick={() => setSelectedCategory('utilities')}
              data-testid="card-category-utilities"
            >
              {/* Gradient Border Effect with Animation */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-md animate-gradient-shift"></div>

              {/* Glow Effect on Hover */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/50 to-pink-500/50 opacity-0 group-hover:opacity-30 blur-3xl rounded-3xl transition-opacity duration-700"></div>

              {/* Card Content with 3D Transform */}
              <div className="relative bg-white dark:bg-gray-900 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-800 group-hover:border-purple-500/60 dark:group-hover:border-purple-500/80 rounded-3xl p-8 sm:p-10 transition-all duration-500 shadow-2xl group-hover:shadow-[0_30px_100px_rgba(168,85,247,0.4)] dark:group-hover:shadow-[0_30px_100px_rgba(168,85,247,0.6)]" style={{ transform: 'translateZ(20px)' }}>

                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 dark:from-purple-500/10 dark:via-pink-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                {/* Enhanced Animated Particles with More Elements */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                  <div className="absolute top-20 right-20 w-2 h-2 bg-pink-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute bottom-10 left-20 w-2 h-2 bg-purple-300 rounded-full animate-pulse shadow-[0_0_10px_rgba(216,180,254,0.8)]" style={{ animationDelay: '0.6s' }}></div>
                  <div className="absolute bottom-20 right-10 w-2 h-2 bg-pink-300 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,168,212,0.8)]" style={{ animationDelay: '0.9s' }}></div>
                  <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
                </div>

                {/* Icon Container with Enhanced 3D Effect */}
                <div className="relative mb-8">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-purple-500 via-purple-400 to-pink-600 flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_80px_rgba(168,85,247,1)] transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 animate-pulse-slow" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}>
                    <Wrench className="w-14 h-14 sm:w-16 sm:h-16 text-white animate-pulse group-hover:animate-wiggle" />
                  </div>
                  <div className="absolute inset-0 bg-purple-500/60 dark:bg-purple-500/80 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700"></div>
                </div>

                {/* Title */}
                <h3 className="relative text-3xl sm:text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent group-hover:scale-105 transform transition-transform duration-300">
                  General Utilities 🔧
                </h3>

                {/* Description */}
                <p className="relative text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Image optimization, text-to-speech, QR generator, and clipboard tools for boosting your productivity
                </p>

                {/* Feature Pills */}
                <div className="relative flex flex-wrap gap-2 mb-8">
                  <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/30 dark:to-blue-500/30 border border-cyan-500/40 dark:border-cyan-500/50 rounded-full text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-300 transform group-hover:scale-110 transition-all duration-300 shadow-md">
                    Image Compress
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 border border-purple-500/40 dark:border-purple-500/50 rounded-full text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.05s' }}>
                    Text-to-Speech
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 border border-green-500/40 dark:border-green-500/50 rounded-full text-xs sm:text-sm font-bold text-green-700 dark:text-green-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.1s' }}>
                    QR Code
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 dark:from-orange-500/30 dark:to-red-500/30 border border-orange-500/40 dark:border-orange-500/50 rounded-full text-xs sm:text-sm font-bold text-orange-700 dark:text-orange-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.15s' }}>
                    Clipboard
                  </span>
                </div>

                {/* CTA */}
                <div className="relative flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent group-hover:translate-x-2 transition-transform duration-300">
                    Get Started →
                  </span>
                  <div className="relative">
                    <Star className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500 animate-spin-slow" />
                    <div className="absolute inset-0 bg-purple-500/60 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Placement */}
          <div className="mt-16 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
            <AdSenseAd />
          </div>
        </div>
      </div>
    );
  }

  // FF Tools Category
  if (selectedCategory === 'ff-tools') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-floatSlow"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1s' }}></div>
        </div>

        <HeroSection
          title="🎮 Free Fire Tools"
          subtitle="Level up your gaming with these awesome tools!"
        />

        <div className="container mx-auto px-4 py-12 relative z-10">
          <Button 
            onClick={() => setSelectedCategory(null)} 
            variant="outline" 
            className="mb-6 group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] dark:border-cyan-500/50 dark:hover:bg-cyan-500/10 animate-slideInFromLeft"
            data-testid="button-back-category"
          >
            <Wrench className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            Back to Categories
          </Button>

          <Tabs defaultValue="ffname" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-1.5 sm:p-2 dark:bg-gray-800/50 backdrop-blur-xl mb-8 sm:mb-10 md:mb-12 animate-fadeUp shadow-2xl hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] transition-all duration-500 rounded-2xl border-2 border-gray-200 dark:border-gray-700" data-testid="tabs-fftools">
              <TabsTrigger value="ffname" data-testid="tab-ffname" className="text-xs sm:text-sm md:text-base font-semibold transition-all duration-500 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-blue-500/30 data-[state=active]:shadow-[0_0_25px_rgba(6,182,212,0.5)] rounded-xl py-3 sm:py-4 px-2 sm:px-4">
                <Sparkles className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">FF Name</span>
                <span className="sm:hidden">Name</span>
              </TabsTrigger>
              <TabsTrigger value="uid" data-testid="tab-uid" className="text-xs sm:text-sm md:text-base font-semibold transition-all duration-500 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/30 data-[state=active]:to-pink-500/30 data-[state=active]:shadow-[0_0_25px_rgba(168,85,247,0.5)] rounded-xl py-3 sm:py-4 px-2 sm:px-4">
                <Gamepad2 className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span>UID</span>
              </TabsTrigger>
              <TabsTrigger value="sensitivity" data-testid="tab-sensitivity" className="text-xs sm:text-sm md:text-base font-semibold transition-all duration-500 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/30 data-[state=active]:to-emerald-500/30 data-[state=active]:shadow-[0_0_25px_rgba(34,197,94,0.5)] rounded-xl py-3 sm:py-4 px-2 sm:px-4">
                <Zap className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Sensitivity</span>
                <span className="sm:hidden">Sens</span>
              </TabsTrigger>
              <TabsTrigger value="password" data-testid="tab-password" className="text-xs sm:text-sm md:text-base font-semibold transition-all duration-500 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/30 data-[state=active]:to-red-500/30 data-[state=active]:shadow-[0_0_25px_rgba(249,115,22,0.5)] rounded-xl py-3 sm:py-4 px-2 sm:px-4">
                <Shield className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Password</span>
                <span className="sm:hidden">Pass</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ffname" className="mt-6 sm:mt-8 md:mt-10 animate-fadeUp">
              <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-cyan-500/50 rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-cyan-500/10 animate-gradient-shift" />
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-3 dark:text-white animate-textBounceIn text-xl sm:text-2xl">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
                      <Sparkles className="h-6 w-6 text-white animate-pulse" />
                    </div>
                    Free Fire Stylish Name Generator
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 animate-textFadeSlide text-base" style={{ animationDelay: '0.1s' }}>
                    Create unique, stylish names with fancy fonts and symbols ✨
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <FFNameGenerator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="uid" className="mt-6 sm:mt-8 md:mt-10 animate-fadeUp">
              <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-purple-500/50 rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 animate-gradient-shift" />
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-3 dark:text-white animate-textBounceIn text-xl sm:text-2xl">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
                      <Gamepad2 className="h-6 w-6 text-white animate-bounce" />
                    </div>
                    Random UID Generator
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 animate-textFadeSlide text-base" style={{ animationDelay: '0.1s' }}>
                    Generate random Free Fire UIDs for testing 🎮
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <UIDGenerator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sensitivity" className="mt-6 sm:mt-8 md:mt-10 animate-fadeUp">
              <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] dark:hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-green-500/50 rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 animate-gradient-shift" />
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-3 dark:text-white animate-textBounceIn text-xl sm:text-2xl">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                      <Sparkles className="h-6 w-6 text-white animate-pulse" />
                    </div>
                    FF Sensitivity Settings Generator
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 animate-textFadeSlide text-base" style={{ animationDelay: '0.1s' }}>
                    Get optimized sensitivity settings based on your playstyle ⚡
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <SensitivityGenerator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password" className="mt-6 sm:mt-8 md:mt-10 animate-fadeUp">
              <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] dark:hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-orange-500/50 rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-orange-500/10 animate-gradient-shift" />
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-3 dark:text-white animate-textBounceIn text-xl sm:text-2xl">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg">
                      <Shield className="h-6 w-6 text-white animate-pulse" />
                    </div>
                    Secure Password Generator
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 animate-textFadeSlide text-base" style={{ animationDelay: '0.1s' }}>
                    Create strong, secure passwords for your gaming accounts 🔒
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <PasswordGenerator />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12 animate-fadeUp">
            <AdSenseAd />
          </div>
        </div>
      </div>
    );
  }

  // Utilities Category
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1s' }}></div>
      </div>

      <HeroSection
        title="🔧 General Utilities"
        subtitle="Boost your productivity with these essential tools!"
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Button 
          onClick={() => setSelectedCategory(null)} 
          variant="outline" 
          className="mb-6 group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] dark:border-purple-500/50 dark:hover:bg-purple-500/10 animate-slideInFromLeft"
          data-testid="button-back-category"
        >
          <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
          Back to Categories
        </Button>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-1.5 sm:p-2 dark:bg-gray-800/50 backdrop-blur-xl mb-8 sm:mb-10 md:mb-12 animate-fadeUp shadow-2xl hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all duration-500 rounded-2xl border-2 border-gray-200 dark:border-gray-700" data-testid="tabs-utility">
            <TabsTrigger value="image" data-testid="tab-image" className="text-xs sm:text-sm md:text-base font-semibold transition-all duration-500 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-blue-500/30 data-[state=active]:shadow-[0_0_25px_rgba(6,182,212,0.5)] rounded-xl py-3 sm:py-4 px-2 sm:px-4">
              <ImageDown className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Image</span>
              <span className="sm:hidden">Img</span>
            </TabsTrigger>
            <TabsTrigger value="tts" data-testid="tab-tts" className="text-xs sm:text-sm md:text-base font-semibold transition-all duration-500 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/30 data-[state=active]:to-pink-500/30 data-[state=active]:shadow-[0_0_25px_rgba(168,85,247,0.5)] rounded-xl py-3 sm:py-4 px-2 sm:px-4">
              <Volume2 className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span>TTS</span>
            </TabsTrigger>
            <TabsTrigger value="qr" data-testid="tab-qr" className="text-xs sm:text-sm md:text-base font-semibold transition-all duration-500 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/30 data-[state=active]:to-emerald-500/30 data-[state=active]:shadow-[0_0_25px_rgba(34,197,94,0.5)] rounded-xl py-3 sm:py-4 px-2 sm:px-4">
              <QrCode className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">QR Code</span>
              <span className="sm:hidden">QR</span>
            </TabsTrigger>
            <TabsTrigger value="clipboard" data-testid="tab-clipboard" className="text-xs sm:text-sm md:text-base font-semibold transition-all duration-500 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/30 data-[state=active]:to-red-500/30 data-[state=active]:shadow-[0_0_25px_rgba(249,115,22,0.5)] rounded-xl py-3 sm:py-4 px-2 sm:px-4">
              <ClipboardCopy className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Clipboard</span>
              <span className="sm:hidden">Clip</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-6 sm:mt-8 md:mt-10 animate-fadeUp">
            <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-cyan-500/50 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-cyan-500/10 animate-gradient-shift" />
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 dark:text-white animate-textShine text-xl sm:text-2xl">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
                    <ImageDown className="h-6 w-6 text-white animate-bounce-slow" />
                  </div>
                  Image Compressor
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-base">
                  Reduce image file size while maintaining quality 📸
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ImageCompressor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tts" className="mt-6 sm:mt-8 md:mt-10 animate-fadeUp">
            <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-purple-500/50 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 animate-gradient-shift" />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 dark:text-white animate-textShine text-xl sm:text-2xl">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
                    <Volume2 className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  Text-to-Speech
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-base">
                  Convert any text to natural-sounding speech 🔊
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <TextToSpeech />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="mt-6 sm:mt-8 md:mt-10 animate-fadeUp">
            <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] dark:hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-green-500/50 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 animate-gradient-shift" />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 dark:text-white animate-textShine text-xl sm:text-2xl">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                    <QrCode className="h-6 w-6 text-white animate-spin-slow" />
                  </div>
                  QR Code Generator
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-base">
                  Generate QR codes for any text or URL instantly 📱
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <QRCodeGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clipboard" className="mt-6 sm:mt-8 md:mt-10 animate-fadeUp">
            <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] dark:hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-orange-500/50 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-orange-500/10 animate-gradient-shift" />
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 dark:text-white animate-textShine text-xl sm:text-2xl">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg">
                    <ClipboardCopy className="h-6 w-6 text-white animate-wiggle" />
                  </div>
                  Clipboard Manager
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-base">
                  Save and manage text snippets for quick access 📋
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ClipboardManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 animate-fadeUp">
          <AdSenseAd />
        </div>
      </div>
    </div>
  );
}