import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import HeroSection from '@/components/HeroSection';
import AdSenseAd from '@/components/AdSenseAd';
import PageFeedback from '@/components/PageFeedback';
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
  ImageDown, Volume2, ClipboardCopy, Mic, MicOff, Wrench, Zap, Star, Smartphone,
  Crosshair, Target, Type, UserPlus, Video, Check
} from 'lucide-react';
import QRCode from 'qrcode';

// Free Fire Tools Components
const FFNameGenerator = () => {
  const [baseName, setBaseName] = useState('');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const { toast } = useToast();

  const fancyStyles = {
    bold: '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳0123456789',
    italic: '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛 U𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻0123456789',
    fancy: '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡',
    cursive: '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣 U𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃0123456789',
    monospace: '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿',
    outline: '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫0123456789',
  };

  const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const symbols = ['✨', '★', '⚡', '🔥', '👑', '💎', '🎮', '🎯', '⭐', '✪', '◈', '◉', '◊', '◇'];

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
      `${convertText(baseName, 'cursive')} ${symbols[9]}`,
      `${symbols[10]}━${convertText(baseName, 'monospace')}━${symbols[10]}`,
      `◥◣${convertText(baseName, 'bold')}◢◤`,
      `°•.｡❀｡.•° ${convertText(baseName, 'cursive')} °•.｡❀｡.•°`,
      `▄▀▄▀${convertText(baseName, 'italic')}▀▄▀▄`,
      `『${symbols[5]}${convertText(baseName, 'fancy')}${symbols[5]}』`,
      `╰☆☆ ${convertText(baseName, 'bold')} ☆☆╮`,
      `⌈${convertText(baseName, 'monospace')}⌋`,
    ];

    setGeneratedNames(names);
    toast({ title: "Generated!", description: `Created ${names.length} stylish Free Fire names!` });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Name copied to clipboard" });
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="flex flex-col sm:flex-row gap-2 animate-slideInFromLeft" style={{ animationDelay: '0.1s' }}>
        <Input
          placeholder="Enter your name..."
          value={baseName}
          onChange={(e) => setBaseName(e.target.value)}
          data-testid="input-ffname"
          className="flex-1 dark:bg-gray-800 dark:text-white transition-all duration-300 focus:scale-[1.02] focus:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        />
        <Button onClick={generateNames} data-testid="button-generate-ffname" className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:scale-110 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
          <Wand2 className="mr-2 h-4 w-4 animate-spin-slow" />
          Generate Names
        </Button>
      </div>

      {generatedNames.length > 0 && (
        <div className="grid gap-2">
          {generatedNames.map((name, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-500/20 dark:border-cyan-500/40 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 animate-bounceIn"
              data-testid={`text-ffname-${index}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="text-base sm:text-lg font-semibold dark:text-white animate-textShine break-all">{name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(name)}
                data-testid={`button-copy-ffname-${index}`}
                className="dark:hover:bg-gray-700 hover:scale-125 transition-all duration-300 shrink-0 ml-2"
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
  const [generatedUIDs, setGeneratedUIDs] = useState<Array<{uid: string, rating: number, ratingText: string, color: string}>>([]);
  const { toast } = useToast();

  const rateUID = (uid: string) => {
    const numericValue = parseInt(uid);
    const digitSum = uid.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    const repeatingDigits = /(\d)\1{2,}/.test(uid);
    const sequentialDigits = /(?:012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/.test(uid);
    const palindrome = uid === uid.split('').reverse().join('');

    let rating = 50;

    if (palindrome) rating += 25;
    if (repeatingDigits) rating += 15;
    if (sequentialDigits) rating += 20;
    if (digitSum % 10 === 0) rating += 10;
    if (uid.endsWith('00') || uid.endsWith('11') || uid.endsWith('99')) rating += 5;
    if (uid.startsWith('999') || uid.startsWith('777') || uid.startsWith('888')) rating += 10;

    rating = Math.min(100, rating);

    let ratingText = '';
    let color = '';

    if (rating >= 90) {
      ratingText = '🔥 Legendary!';
      color = 'text-orange-500 dark:text-orange-400';
    } else if (rating >= 75) {
      ratingText = '⭐ Epic!';
      color = 'text-purple-500 dark:text-purple-400';
    } else if (rating >= 60) {
      ratingText = '✨ Rare!';
      color = 'text-blue-500 dark:text-blue-400';
    } else {
      ratingText = '👍 Good!';
      color = 'text-green-500 dark:text-green-400';
    }

    return { rating, ratingText, color };
  };

  const generateUIDs = () => {
    const uids: Array<{uid: string, rating: number, ratingText: string, color: string}> = [];
    for (let i = 0; i < uidCount; i++) {
      const uid = Math.floor(Math.random() * (9999999999 - 100000000) + 100000000).toString();
      const { rating, ratingText, color } = rateUID(uid);
      uids.push({ uid, rating, ratingText, color });
    }
    uids.sort((a, b) => b.rating - a.rating);
    setGeneratedUIDs(uids);
    toast({ title: "Generated!", description: `Created and rated ${uids.length} UIDs!` });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "UID copied to clipboard" });
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="space-y-2 animate-slideInFromRight" style={{ animationDelay: '0.1s' }}>
        <Label data-testid="label-uid-count" className="text-base sm:text-lg font-semibold animate-textFadeSlide">Number of UIDs: {uidCount}</Label>
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
        Generate & Rate UIDs
      </Button>

      {generatedUIDs.length > 0 && (
        <div className="grid gap-2">
          {generatedUIDs.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-500/20 dark:border-purple-500/40 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 animate-slideInFromBottom"
              data-testid={`text-uid-${index}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex-1">
                <span className="font-mono text-base sm:text-lg dark:text-white animate-countUp block">{item.uid}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm font-semibold ${item.color}`}>{item.ratingText}</span>
                  <div className="flex-1 max-w-[100px] bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        item.rating >= 90 ? 'from-orange-500 to-red-500' :
                        item.rating >= 75 ? 'from-purple-500 to-pink-500' :
                        item.rating >= 60 ? 'from-blue-500 to-cyan-500' :
                        'from-green-500 to-emerald-500'
                      } transition-all duration-500`}
                      style={{ width: `${item.rating}%` }}
                    />
                  </div>
                  <span className="text-xs dark:text-gray-400">{item.rating}/100</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(item.uid)}
                data-testid={`button-copy-uid-${index}`}
                className="dark:hover:bg-gray-700 hover:scale-125 transition-all duration-300 shrink-0 ml-2"
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
  const [device, setDevice] = useState('medium-phone');
  const [gameMode, setGameMode] = useState('assault');
  const [fingerCount, setFingerCount] = useState('2');
  const [fireButtonSize, setFireButtonSize] = useState('medium');
  const [preferredGun, setPreferredGun] = useState('ak');
  const [dpi, setDpi] = useState(400);
  const [sensitivity, setSensitivity] = useState<any>(null);
  const { toast } = useToast();

  const deviceOptions = [
    { value: 'small-phone', label: 'Small Phone (iPhone SE, Mini)', dpi: 326 },
    { value: 'medium-phone', label: 'Medium Phone (iPhone 14, S23)', dpi: 400 },
    { value: 'large-phone', label: 'Large Phone (iPhone Pro Max, S23 Ultra)', dpi: 460 },
    { value: 'tablet-small', label: 'Small Tablet (iPad Mini)', dpi: 326 },
    { value: 'tablet', label: 'Tablet (iPad, Galaxy Tab)', dpi: 264 },
    { value: 'tablet-large', label: 'Large Tablet (iPad Pro)', dpi: 264 },
    { value: 'emulator', label: 'PC Emulator', dpi: 320 },
    { value: 'custom', label: 'Custom DPI', dpi: 400 },
  ];

  const sensitivityPresets = {
    assault: {
      general: 85, redDot: 75, scope2x: 70, scope4x: 65, scope8x: 60, awm: 58, 
      freeLook: 80, character: 90, ads: 75
    },
    sniper: {
      general: 65, redDot: 60, scope2x: 55, scope4x: 50, scope8x: 45, awm: 42, 
      freeLook: 70, character: 75, ads: 60
    },
    rusher: {
      general: 110, redDot: 100, scope2x: 95, scope4x: 85, scope8x: 75, awm: 70, 
      freeLook: 100, character: 120, ads: 95
    },
    balanced: {
      general: 80, redDot: 75, scope2x: 70, scope4x: 65, scope8x: 60, awm: 55, 
      freeLook: 75, character: 85, ads: 70
    },
    'sniper-pro': {
      general: 50, redDot: 45, scope2x: 40, scope4x: 35, scope8x: 30, awm: 28, 
      freeLook: 60, character: 65, ads: 45
    },
    'rush-pro': {
      general: 130, redDot: 125, scope2x: 115, scope4x: 105, scope8x: 95, awm: 90, 
      freeLook: 120, character: 140, ads: 115
    },
  };

  const adjustForDPI = (value: number, baseDPI: number, targetDPI: number) => {
    const adjusted = Math.round(value * (baseDPI / targetDPI));
    return Math.min(200, Math.max(10, adjusted));
  };

  const generateSensitivity = () => {
    const selectedDevice = deviceOptions.find(d => d.value === device);
    const targetDPI = selectedDevice?.value === 'custom' ? dpi : (selectedDevice?.dpi || 400);
    const baseDPI = 400;

    const preset = sensitivityPresets[gameMode as keyof typeof sensitivityPresets];

    let fingerMultiplier = 1;
    if (fingerCount === '3') fingerMultiplier = 1.1;
    if (fingerCount === '4') fingerMultiplier = 1.2;
    if (fingerCount === '5') fingerMultiplier = 1.25;

    const buttonSizeModifier = fireButtonSize === 'small' ? 5 : fireButtonSize === 'large' ? -5 : 0;

    const adjusted = {
      general: Math.round(adjustForDPI(preset.general, baseDPI, targetDPI) * fingerMultiplier) + buttonSizeModifier,
      redDot: Math.round(adjustForDPI(preset.redDot, baseDPI, targetDPI) * fingerMultiplier),
      scope2x: Math.round(adjustForDPI(preset.scope2x, baseDPI, targetDPI) * fingerMultiplier),
      scope4x: Math.round(adjustForDPI(preset.scope4x, baseDPI, targetDPI) * fingerMultiplier),
      scope8x: Math.round(adjustForDPI(preset.scope8x, baseDPI, targetDPI) * fingerMultiplier),
      awm: Math.round(adjustForDPI(preset.awm, baseDPI, targetDPI) * fingerMultiplier),
      freeLook: Math.round(adjustForDPI(preset.freeLook, baseDPI, targetDPI) * fingerMultiplier),
      character: Math.round(adjustForDPI(preset.character, baseDPI, targetDPI) * fingerMultiplier) + buttonSizeModifier,
      ads: Math.round(adjustForDPI(preset.ads, baseDPI, targetDPI) * fingerMultiplier),
      deviceType: selectedDevice?.label || 'Custom',
      dpi: targetDPI,
      fingerCount: fingerCount,
      fireButtonSize: fireButtonSize,
      preferredGun: preferredGun.toUpperCase(),
    };

    setSensitivity(adjusted);
    toast({ title: "Generated!", description: `Advanced ${fingerCount}-finger sensitivity settings ready!` });
  };

  const downloadSettings = () => {
    if (!sensitivity) return;
    const data = JSON.stringify(sensitivity, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${gameMode}-${device}-sensitivity.json`;
    link.click();
    toast({ title: "Downloaded!", description: "Settings saved to file" });
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      {/* Device Selection */}
      <div className="space-y-2 animate-zoomIn" style={{ animationDelay: '0.1s' }}>
        <Label data-testid="label-device" className="text-base sm:text-lg font-semibold animate-textFadeSlide flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-green-500" />
          Select Your Device
        </Label>
        <Select value={device} onValueChange={setDevice}>
          <SelectTrigger className="dark:bg-gray-800 dark:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]" data-testid="select-device">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:text-white">
            {deviceOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom DPI Input */}
      {device === 'custom' && (
        <div className="space-y-2 animate-slideInFromLeft">
          <Label data-testid="label-custom-dpi" className="text-base sm:text-lg font-semibold">Custom DPI: {dpi}</Label>
          <Slider
            value={[dpi]}
            onValueChange={(value) => setDpi(value[0])}
            max={600}
            min={200}
            step={10}
            className="dark:bg-gray-700 transition-all duration-300 hover:scale-[1.02]"
            data-testid="slider-dpi"
          />
          <p className="text-xs text-muted-foreground">Adjust to match your device's screen DPI</p>
        </div>
      )}

      {/* Game Mode Selection */}
      <div className="space-y-2 animate-zoomIn" style={{ animationDelay: '0.2s' }}>
        <Label data-testid="label-gamemode" className="text-base sm:text-lg font-semibold animate-textFadeSlide">Select Playstyle</Label>
        <Select value={gameMode} onValueChange={setGameMode}>
          <SelectTrigger className="dark:bg-gray-800 dark:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]" data-testid="select-gamemode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:text-white">
            <SelectItem value="assault">Assault Rifle Main</SelectItem>
            <SelectItem value="sniper">Sniper Main</SelectItem>
            <SelectItem value="rusher">Rusher / Shotgun</SelectItem>
            <SelectItem value="balanced">Balanced All-Rounder</SelectItem>
            <SelectItem value="sniper-pro">Pro Sniper (Low Sens)</SelectItem>
            <SelectItem value="rush-pro">Pro Rusher (High Sens)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-slideInFromRight" style={{ animationDelay: '0.3s' }}>
        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-white">Finger Count</Label>
          <Select value={fingerCount} onValueChange={setFingerCount}>
            <SelectTrigger className="dark:bg-gray-800 dark:text-white" data-testid="select-finger-count">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white">
              <SelectItem value="2">2 Fingers</SelectItem>
              <SelectItem value="3">3 Fingers</SelectItem>
              <SelectItem value="4">4 Fingers</SelectItem>
              <SelectItem value="5">5 Fingers (Pro)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-white">Fire Button Size</Label>
          <Select value={fireButtonSize} onValueChange={setFireButtonSize}>
            <SelectTrigger className="dark:bg-gray-800 dark:text-white" data-testid="select-fire-button">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white">
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-white">Preferred Gun</Label>
          <Select value={preferredGun} onValueChange={setPreferredGun}>
            <SelectTrigger className="dark:bg-gray-800 dark:text-white" data-testid="select-preferred-gun">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white">
              <SelectItem value="ak">AK-47</SelectItem>
              <SelectItem value="m1014">M1014</SelectItem>
              <SelectItem value="awm">AWM</SelectItem>
              <SelectItem value="mp40">MP40</SelectItem>
              <SelectItem value="scar">SCAR</SelectItem>
              <SelectItem value="groza">Groza</SelectItem>
              <SelectItem value="m4a1">M4A1</SelectItem>
              <SelectItem value="ump">UMP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={generateSensitivity} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 animate-swingIn" data-testid="button-generate-sensitivity" style={{ animationDelay: '0.4s' }}>
        <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
        Generate Advanced Settings
      </Button>

      {sensitivity && (
        <div className="space-y-3 animate-popIn" style={{ animationDelay: '0.4s' }}>
          <div className="p-4 sm:p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-500/20 dark:border-green-500/40 space-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] transition-all duration-300">
            <div className="mb-3 pb-3 border-b border-green-500/30">
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">Device: {sensitivity.deviceType}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">DPI: {sensitivity.dpi} | Max Sens: 200</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex justify-between animate-slideInFromLeft p-2 rounded bg-white/50 dark:bg-gray-800/50" data-testid="text-general-sensitivity" style={{ animationDelay: '0.1s' }}>
                <span className="dark:text-gray-300 text-sm sm:text-base">General:</span>
                <span className="font-bold dark:text-white animate-countUp text-green-600 dark:text-green-400">{sensitivity.general}</span>
              </div>
              <div className="flex justify-between animate-slideInFromRight p-2 rounded bg-white/50 dark:bg-gray-800/50" data-testid="text-reddot-sensitivity" style={{ animationDelay: '0.15s' }}>
                <span className="dark:text-gray-300 text-sm sm:text-base">Red Dot:</span>
                <span className="font-bold dark:text-white animate-countUp text-green-600 dark:text-green-400">{sensitivity.redDot}</span>
              </div>
              <div className="flex justify-between animate-slideInFromLeft p-2 rounded bg-white/50 dark:bg-gray-800/50" data-testid="text-2x-sensitivity" style={{ animationDelay: '0.2s' }}>
                <span className="dark:text-gray-300 text-sm sm:text-base">2x Scope:</span>
                <span className="font-bold dark:text-white animate-countUp text-green-600 dark:text-green-400">{sensitivity.scope2x}</span>
              </div>
              <div className="flex justify-between animate-slideInFromRight p-2 rounded bg-white/50 dark:bg-gray-800/50" data-testid="text-4x-sensitivity" style={{ animationDelay: '0.25s' }}>
                <span className="dark:text-gray-300 text-sm sm:text-base">4x Scope:</span>
                <span className="font-bold dark:text-white animate-countUp text-green-600 dark:text-green-400">{sensitivity.scope4x}</span>
              </div>
              <div className="flex justify-between animate-slideInFromLeft p-2 rounded bg-white/50 dark:bg-gray-800/50" data-testid="text-8x-sensitivity" style={{ animationDelay: '0.3s' }}>
                <span className="dark:text-gray-300 text-sm sm:text-base">8x Scope:</span>
                <span className="font-bold dark:text-white animate-countUp text-green-600 dark:text-green-400">{sensitivity.scope8x}</span>
              </div>
              <div className="flex justify-between animate-slideInFromRight p-2 rounded bg-white/50 dark:bg-gray-800/50" data-testid="text-awm-sensitivity" style={{ animationDelay: '0.35s' }}>
                <span className="dark:text-gray-300 text-sm sm:text-base">AWM:</span>
                <span className="font-bold dark:text-white animate-countUp text-green-600 dark:text-green-400">{sensitivity.awm}</span>
              </div>
              <div className="flex justify-between animate-slideInFromLeft p-2 rounded bg-white/50 dark:bg-gray-800/50" data-testid="text-freelook-sensitivity" style={{ animationDelay: '0.4s' }}>
                <span className="dark:text-gray-300 text-sm sm:text-base">Free Look:</span>
                <span className="font-bold dark:text-white animate-countUp text-green-600 dark:text-green-400">{sensitivity.freeLook}</span>
              </div>
              <div className="flex justify-between animate-slideInFromRight p-2 rounded bg-white/50 dark:bg-gray-800/50" data-testid="text-character-sensitivity" style={{ animationDelay: '0.45s' }}>
                <span className="dark:text-gray-300 text-sm sm:text-base">Character:</span>
                <span className="font-bold dark:text-white animate-countUp text-green-600 dark:text-green-400">{sensitivity.character}</span>
              </div>
              <div className="flex justify-between animate-slideInFromLeft p-2 rounded bg-white/50 dark:bg-gray-800/50 sm:col-span-2" data-testid="text-ads-sensitivity" style={{ animationDelay: '0.5s' }}>
                <span className="dark:text-gray-300 text-sm sm:text-base">ADS Sensitivity:</span>
                <span className="font-bold dark:text-white animate-countUp text-green-600 dark:text-green-400">{sensitivity.ads}</span>
              </div>
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
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const { toast} = useToast();

  const presetLengths = [8, 12, 16, 20, 24, 32];

  const generatePassword = () => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (chars.length === 0) {
      toast({ title: "Error", description: "Please select at least one character type", variant: "destructive" });
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(result);
    toast({ title: "Generated!", description: `Secure ${length}-character password created!` });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({ title: "Copied!", description: "Password copied to clipboard" });
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="space-y-2 animate-slideInFromLeft" style={{ animationDelay: '0.1s' }}>
        <Label data-testid="label-password-length" className="text-base sm:text-lg font-semibold animate-textFadeSlide">Length: {length} characters</Label>
        <Slider
          value={[length]}
          onValueChange={(value) => setLength(value[0])}
          max={64}
          min={4}
          step={1}
          className="dark:bg-gray-700 transition-all duration-300 hover:scale-[1.02]"
          data-testid="slider-password-length"
        />
        <div className="flex gap-2 flex-wrap">
          {presetLengths.map(len => (
            <button
              key={len}
              onClick={() => setLength(len)}
              className={`px-3 py-1 rounded text-sm transition-all duration-300 hover:scale-105 ${
                length === len 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {len}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 animate-slideInFromRight" style={{ animationDelay: '0.2s' }}>
        <label className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="w-4 h-4 text-orange-500 rounded transition-all duration-300"
            data-testid="checkbox-include-uppercase"
          />
          <span className="dark:text-gray-300">Uppercase (A-Z)</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="w-4 h-4 text-orange-500 rounded transition-all duration-300"
            data-testid="checkbox-include-lowercase"
          />
          <span className="dark:text-gray-300">Lowercase (a-z)</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-4 h-4 text-orange-500 rounded transition-all duration-300"
            data-testid="checkbox-include-numbers"
          />
          <span className="dark:text-gray-300">Numbers (0-9)</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-4 h-4 text-orange-500 rounded transition-all duration-300"
            data-testid="checkbox-include-symbols"
          />
          <span className="dark:text-gray-300">Symbols (!@#$%)</span>
        </label>
      </div>

      <Button onClick={generatePassword} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-300 animate-popIn" data-testid="button-generate-password" style={{ animationDelay: '0.3s' }}>
        <Shield className="mr-2 h-4 w-4 animate-pulse" />
        Generate Secure Password
      </Button>

      {password && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 border border-orange-500/20 dark:border-orange-500/40 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-all duration-300 animate-bounceIn">
          <span className="font-mono text-base sm:text-lg break-all dark:text-white animate-textShine flex-1" data-testid="text-generated-password">{password}</span>
          <Button variant="ghost" size="sm" onClick={copyToClipboard} data-testid="button-copy-password" className="dark:hover:bg-gray-700 hover:scale-125 transition-all duration-300 shrink-0">
            <Copy className="h-4 w-4 hover:animate-wiggle" />
          </Button>
        </div>
      )}
    </div>
  );
};

// NEW Free Fire Tools
const WeaponStatsLookup = () => {
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const { toast } = useToast();

  const weaponStats = {
    'AK': { damage: 61, range: 75, accuracy: 54, fireRate: 56, reload: 41, magazine: 30 },
    'M1014': { damage: 94, range: 25, accuracy: 12, fireRate: 54, reload: 48, magazine: 6 },
    'AWM': { damage: 90, range: 91, accuracy: 90, fireRate: 27, reload: 43, magazine: 5 },
    'MP40': { damage: 48, range: 22, accuracy: 59, fireRate: 83, reload: 48, magazine: 20 },
    'SCAR': { damage: 53, range: 60, accuracy: 53, fireRate: 61, reload: 42, magazine: 30 },
    'Groza': { damage: 61, range: 79, accuracy: 62, fireRate: 58, reload: 42, magazine: 30 },
  };

  const stats = selectedWeapon ? weaponStats[selectedWeapon as keyof typeof weaponStats] : null;

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="space-y-2 animate-zoomIn" style={{ animationDelay: '0.1s' }}>
        <Label className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-red-500" />
          Select Weapon
        </Label>
        <Select value={selectedWeapon} onValueChange={setSelectedWeapon}>
          <SelectTrigger className="dark:bg-gray-800 dark:text-white" data-testid="select-weapon">
            <SelectValue placeholder="Choose a weapon..." />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:text-white">
            {Object.keys(weaponStats).map(weapon => (
              <SelectItem key={weapon} value={weapon}>{weapon}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {stats && (
        <div className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 border border-red-500/20 dark:border-red-500/40 animate-bounceIn">
          <h3 className="font-bold text-xl text-red-600 dark:text-red-400 mb-4">{selectedWeapon} Stats</h3>
          {Object.entries(stats).map(([key, value], idx) => (
            <div key={key} className="flex justify-between items-center animate-slideInFromLeft" style={{ animationDelay: `${idx * 0.1}s` }} data-testid={`stat-${key}`}>
              <span className="dark:text-gray-300 capitalize">{key}:</span>
              <div className="flex items-center gap-2 flex-1 max-w-xs ml-4">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="font-bold text-red-600 dark:text-red-400 min-w-[3ch]">{value}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DropSimulator = () => {
  const [dropLocation, setDropLocation] = useState<any>(null);
  const [matchType, setMatchType] = useState('br-rank');
  const { toast } = useToast();

  const locations = [
    { name: 'Clock Tower', loot: 'High', risk: 'Very High', players: '8-12', message: 'Hot drop central! Perfect for aggressive players who love early action. High risk, high reward - be ready to fight immediately! 🔥' },
    { name: 'Peak', loot: 'High', risk: 'Very High', players: '6-10', message: 'High ground advantage with great loot! Dominate from above and control the zone. Ideal for skilled players! ⚡' },
    { name: 'Mars Electric', loot: 'Medium', risk: 'Medium', players: '4-6', message: 'Balanced spot for steady gameplay. Good loot with manageable fights. Perfect for building momentum! 💎' },
    { name: 'Mill', loot: 'Medium', risk: 'Low', players: '2-4', message: 'Safe drop for a chill start! Loot up peacefully and rotate smartly. Great for strategic players! 🎯' },
    { name: 'Rim Nam Village', loot: 'Medium', risk: 'Medium', players: '3-5', message: 'Classic drop with good rotations! Solid loot and decent action. A reliable choice for any match! ✨' },
    { name: 'Shipyard', loot: 'High', risk: 'High', players: '5-8', message: 'Action-packed with premium loot! Close-quarters combat guaranteed. For brave warriors only! 🏆' },
    { name: 'Observatory', loot: 'High', risk: 'Very High', players: '7-11', message: 'Pro player favorite! Intense fights with top-tier loot. Show your skills here! 👑' },
    { name: 'Bimasakti Strip', loot: 'Medium', risk: 'Low', players: '2-3', message: 'Quiet looting spot for smart players! Gear up safely and plan your next move. Strategic excellence! 🧠' },
    { name: 'Factory', loot: 'Medium', risk: 'Medium', players: '4-5', message: 'Industrial warfare awaits! Good cover and decent loot. Perfect for tactical players! ⚙️' },
    { name: 'Cape Town', loot: 'High', risk: 'High', players: '6-9', message: 'Coastal chaos! Amazing loot but expect company. Prove your dominance! 🌊' },
  ];

  const simulateDrop = () => {
    let filteredLocations = [...locations];

    if (matchType === 'rush') {
      filteredLocations = locations.filter(l => l.risk === 'Very High' || l.risk === 'High');
    } else if (matchType === 'custom') {
      filteredLocations = locations.filter(l => l.risk === 'Medium' || l.risk === 'Low');
    } else if (matchType === 'tournament') {
      filteredLocations = locations.filter(l => l.loot === 'High');
    }

    const randomLocation = filteredLocations[Math.floor(Math.random() * filteredLocations.length)];
    setDropLocation(randomLocation);
    toast({ title: "Drop Confirmed! 🎯", description: `Landing at ${randomLocation.name} - ${matchType.toUpperCase()}` });
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="space-y-2 animate-slideInFromLeft" style={{ animationDelay: '0.1s' }}>
        <Label className="text-sm font-semibold dark:text-white">Match Type</Label>
        <Select value={matchType} onValueChange={setMatchType}>
          <SelectTrigger className="dark:bg-gray-800 dark:text-white" data-testid="select-match-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:text-white">
            <SelectItem value="br-rank">BR Ranked</SelectItem>
            <SelectItem value="normal">Normal Match</SelectItem>
            <SelectItem value="rush">Rush Mode</SelectItem>
            <SelectItem value="tournament">Tournament</SelectItem>
            <SelectItem value="custom">Custom Room</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={simulateDrop} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-popIn" data-testid="button-simulate-drop" style={{ animationDelay: '0.2s' }}>
        <Target className="mr-2 h-4 w-4 animate-pulse" />
        Find Perfect Drop Location
      </Button>

      {dropLocation && (
        <div className="p-5 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-500/20 dark:border-blue-500/40 space-y-3 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-300 animate-bounceIn">
          <h3 className="font-bold text-2xl text-blue-600 dark:text-blue-400 animate-textShine">{dropLocation.name}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div data-testid="drop-loot" className="p-2 rounded bg-white/50 dark:bg-gray-800/50">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Loot:</span> 
              <span className="font-bold dark:text-white ml-2">{dropLocation.loot}</span>
            </div>
            <div data-testid="drop-risk" className="p-2 rounded bg-white/50 dark:bg-gray-800/50">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Risk:</span> 
              <span className="font-bold dark:text-white ml-2">{dropLocation.risk}</span>
            </div>
            <div className="col-span-2 p-2 rounded bg-white/50 dark:bg-gray-800/50" data-testid="drop-players">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Expected Players:</span> 
              <span className="font-bold dark:text-white ml-2">{dropLocation.players}</span>
            </div>
          </div>
          <div className="p-3 rounded bg-gradient-to-r from-blue-400/20 to-cyan-400/20 border border-blue-400/30">
            <p className="text-sm dark:text-white leading-relaxed animate-slideInFromBottom" style={{ animationDelay: '0.2s' }}>
              <strong className="text-blue-600 dark:text-blue-400">Why here? </strong>{dropLocation.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// NEW Utility Tools
const TextFormatter = () => {
  const [text, setText] = useState('');
  const [formatted, setFormatted] = useState('');
  const [formatType, setFormatType] = useState('uppercase');
  const { toast } = useToast();

  const fancyChars = {
    bold: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    boldMap: '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇',
    italic: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    italicMap: '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛U𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻',
    cursive: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    cursiveMap: '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙K𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣 U𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃',
    bubbled: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    bubbledMap: 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ',
  };

  const convertToStyle = (text: string, style: string) => {
    let result = '';
    const sourceChars = fancyChars[style as keyof typeof fancyChars];
    const targetChars = fancyChars[(style + 'Map') as keyof typeof fancyChars];

    for (const char of text) {
      const index = sourceChars.indexOf(char);
      if (index !== -1) {
        result += targetChars[index];
      } else {
        result += char;
      }
    }
    return result;
  };

  const formatText = () => {
    let result = text;
    switch (formatType) {
      case 'uppercase': result = text.toUpperCase(); break;
      case 'lowercase': result = text.toLowerCase(); break;
      case 'capitalize': result = text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '); break;
      case 'reverse': result = text.split('').reverse().join(''); break;
      case 'removeSpaces': result = text.replace(/\s+/g, ''); break;
      case 'alternating': result = text.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join(''); break;
      case 'bold': result = convertToStyle(text, 'bold'); break;
      case 'italic': result = convertToStyle(text, 'italic'); break;
      case 'cursive': result = convertToStyle(text, 'cursive'); break;
      case 'bubbled': result = convertToStyle(text, 'bubbled'); break;
      case 'underline': result = text.split('').join('\u0332') + '\u0332'; break;
      case 'strikethrough': result = text.split('').join('\u0336') + '\u0336'; break;
      case 'zalgo': 
        const zalgoChars = ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱'];
        result = text.split('').map(c => c + zalgoChars[Math.floor(Math.random() * zalgoChars.length)] + zalgoChars[Math.floor(Math.random() * zalgoChars.length)]).join('');
        break;
    }
    setFormatted(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatted);
    toast({ title: "Copied!", description: "Formatted text copied" });
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <Textarea
        placeholder="Enter text to format..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="dark:bg-gray-800 dark:text-white min-h-[100px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        data-testid="input-text-formatter"
      />

      <div className="space-y-2 animate-slideInFromLeft" style={{ animationDelay: '0.1s' }}>
        <Label className="text-sm font-semibold dark:text-white">Text Style</Label>
        <Select value={formatType} onValueChange={setFormatType}>
          <SelectTrigger className="dark:bg-gray-800 dark:text-white" data-testid="select-format-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:text-white max-h-60">
            <SelectItem value="uppercase">UPPERCASE</SelectItem>
            <SelectItem value="lowercase">lowercase</SelectItem>
            <SelectItem value="capitalize">Capitalize Each Word</SelectItem>
            <SelectItem value="alternating">aLtErNaTiNg CaSe</SelectItem>
            <SelectItem value="reverse">Reverse Text</SelectItem>
            <SelectItem value="removeSpaces">RemoveSpaces</SelectItem>
            <SelectItem value="bold">𝗕𝗼𝗹𝗱 𝗧𝗲𝘅𝘁</SelectItem>
            <SelectItem value="italic">𝘐𝘵𝘢𝘭𝘪𝘤 𝘛𝘦𝘹𝘵</SelectItem>
            <SelectItem value="cursive">𝓒𝓾𝓻𝓼𝓲𝓿𝓮 𝓣𝓮𝔁𝓽</SelectItem>
            <SelectItem value="bubbled">Ⓑⓤⓑⓑⓛⓔⓓ Ⓣⓔⓧⓣ</SelectItem>
            <SelectItem value="underline">U̲n̲d̲e̲r̲l̲i̲n̲e̲</SelectItem>
            <SelectItem value="strikethrough">S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶</SelectItem>
            <SelectItem value="zalgo">Z̭̮a̰l̤g̥o̩ T̫e̬x̭t̯</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={formatText} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-popIn" data-testid="button-format-text">
        <Type className="mr-2 h-4 w-4 animate-pulse" />
        Format Text
      </Button>

      {formatted && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-500/20 dark:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] animate-bounceIn">
          <span className="flex-1 dark:text-white break-all text-lg" data-testid="text-formatted-result">{formatted}</span>
          <Button variant="ghost" size="sm" onClick={copyToClipboard} data-testid="button-copy-formatted" className="hover:scale-125 transition-all duration-300">
            <Copy className="h-4 w-4 hover:animate-wiggle" />
          </Button>
        </div>
      )}
    </div>
  );
};

const RandomNicknameGenerator = () => {
  const [nickname, setNickname] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('any');
  const [nicknameStyle, setNicknameStyle] = useState('gaming');
  const [generatedNicknames, setGeneratedNicknames] = useState<string[]>([]);
  const { toast } = useToast();

  const gamingAdjectives = ['Epic', 'Legendary', 'Pro', 'Shadow', 'Mystic', 'Elite', 'Alpha', 'Ultra', 'Supreme', 'Toxic', 'Divine', 'Savage', 'Immortal', 'Phantom', 'Celestial', 'Eternal', 'Dark', 'Silent', 'Ghost', 'Thunder'];
  const gamingNouns = ['Sniper', 'Warrior', 'Hunter', 'Phantom', 'Assassin', 'Legend', 'Beast', 'King', 'Dragon', 'Ninja', 'Demon', 'Angel', 'Samurai', 'Wolf', 'Phoenix', 'Viper', 'Reaper', 'Titan', 'Storm', 'Blade'];

  const coolPrefixes = ['Cool', 'Chill', 'Ice', 'Frost', 'Crystal', 'Diamond', 'Neon', 'Cyber', 'Tech', 'Digital'];
  const coolSuffixes = ['Vibes', 'Wave', 'Flow', 'Mode', 'Style', 'Zone', 'Core', 'Pulse', 'Beat', 'Edge'];

  const stlyishSymbols = ['✨', '★', '⚡', '🔥', '👑', '💎', '🎮', '🎯', '⭐', '✪', '༺', '༻', '꧁', '꧂', '【', '】', '「', '」'];

  const fancyStyles = {
    normal: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    bold: '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳',
    italic: '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛U𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻',
  };

  const convertToFancy = (text: string, style: keyof typeof fancyStyles) => {
    let result = '';
    for (const char of text) {
      const index = fancyStyles.normal.indexOf(char);
      if (index !== -1) {
        result += fancyStyles[style][index];
      } else {
        result += char;
      }
    }
    return result;
  };

  const generateNicknames = () => {
    const nicknames: string[] = [];

    let adjList = nicknameStyle === 'gaming' ? gamingAdjectives : coolPrefixes;
    let nounList = nicknameStyle === 'gaming' ? gamingNouns : coolSuffixes;

    if (selectedLetter !== 'any') {
      adjList = adjList.filter(w => w[0].toUpperCase() === selectedLetter.toUpperCase());
      nounList = nounList.filter(w => w[0].toUpperCase() === selectedLetter.toUpperCase());
    }

    if (adjList.length === 0) adjList = nicknameStyle === 'gaming' ? gamingAdjectives : coolPrefixes;
    if (nounList.length === 0) nounList = nicknameStyle === 'gaming' ? gamingNouns : coolSuffixes;

    for (let i = 0; i < 8; i++) {
      const adj = adjList[Math.floor(Math.random() * adjList.length)];
      const noun = nounList[Math.floor(Math.random() * nounList.length)];
      const num = Math.floor(Math.random() * 999) + 1;
      const sym1 = stlyishSymbols[Math.floor(Math.random() * stlyishSymbols.length)];
      const sym2 = stlyishSymbols[Math.floor(Math.random() * stlyishSymbols.length)];

      let nick = '';
      switch (i) {
        case 0: nick = `${convertToFancy(adj + noun, 'bold')}${num}`; break;
        case 1: nick = `${sym1} ${adj}${noun} ${sym2}`; break;
        case 2: nick = `༺${convertToFancy(adj + noun, 'italic')}༻`; break;
        case 3: nick = `꧁${adj}${noun}${num}꧂`; break;
        case 4: nick = `【${sym1}${adj}_${noun}${sym2}】`; break;
        case 5: nick = `${adj}・${noun}・${num}`; break;
        case 6: nick = `${convertToFancy(adj, 'bold')}_${convertToFancy(noun, 'italic')}_${num}`; break;
        case 7: nick = `「${sym1}${adj}${noun}${sym2}」${num}`; break;
      }
      nicknames.push(nick);
    }

    setGeneratedNicknames(nicknames);
    if (nicknames.length > 0) setNickname(nicknames[0]);
    toast({ title: "Generated!", description: `Created ${nicknames.length} awesome nicknames!` });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Nickname copied" });
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slideInFromLeft" style={{ animationDelay: '0.1s' }}>
        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-white">Nickname Style</Label>
          <Select value={nicknameStyle} onValueChange={setNicknameStyle}>
            <SelectTrigger className="dark:bg-gray-800 dark:text-white" data-testid="select-nickname-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white">
              <SelectItem value="gaming">Gaming & Powerful</SelectItem>
              <SelectItem value="cool">Cool & Stylish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-white">Starting Letter</Label>
          <Select value={selectedLetter} onValueChange={setSelectedLetter}>
            <SelectTrigger className="dark:bg-gray-800 dark:text-white" data-testid="select-letter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white max-h-60">
              <SelectItem value="any">Any Letter</SelectItem>
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                <SelectItem key={letter} value={letter}>{letter}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={generateNicknames} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] animate-popIn" data-testid="button-generate-nickname">
        <UserPlus className="mr-2 h-4 w-4 animate-pulse" />
        Generate Advanced Nicknames
      </Button>

      {generatedNicknames.length > 0 && (
        <div className="grid gap-2 animate-zoomIn">
          {generatedNicknames.map((nick, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-500/20 dark:border-green-500/40 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 animate-bounceIn"
              data-testid={`text-generated-nickname-${index}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="flex-1 text-lg font-bold dark:text-white break-all animate-textShine">{nick}</span>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(nick)} data-testid={`button-copy-nickname-${index}`} className="hover:scale-125 transition-all duration-300 shrink-0 ml-2">
                <Copy className="h-4 w-4 hover:animate-wiggle" />
              </Button>
            </div>
          ))}
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
  const [compressionMode, setCompressionMode] = useState<'quality' | 'size'>('quality');
  const [targetSize, setTargetSize] = useState(2);
  const [quality, setQuality] = useState(70);
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

      let width = img.width;
      let height = img.height;
      let currentQuality = quality / 100;

      if (compressionMode === 'size') {
        const targetBytes = targetSize * 1024 * 1024;
        const maxDimension = 3840;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height *= maxDimension / width;
            width = maxDimension;
          } else {
            width *= maxDimension / height;
            height = maxDimension;
          }
        }

        const scale = Math.sqrt(targetBytes / originalSize);
        width = Math.round(width * Math.min(scale, 1));
        height = Math.round(height * Math.min(scale, 1));

        currentQuality = Math.min(0.9, Math.max(0.3, targetBytes / originalSize));
      } else {
        const maxWidth = 1920;
        const maxHeight = 1080;

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
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', currentQuality);
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

      <div className="space-y-3 animate-slideInFromLeft" style={{ animationDelay: '0.1s' }}>
        <Label className="text-sm font-semibold dark:text-white">Compression Mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setCompressionMode('quality')}
            className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
              compressionMode === 'quality' 
                ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            data-testid="button-mode-quality"
          >
            <p className="text-sm dark:text-white font-semibold">Quality Based</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Set quality %</p>
          </button>
          <button
            onClick={() => setCompressionMode('size')}
            className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
              compressionMode === 'size' 
                ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            data-testid="button-mode-size"
          >
            <p className="text-sm dark:text-white font-semibold">Target Size</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Set MB target</p>
          </button>
        </div>

        {compressionMode === 'quality' ? (
          <div className="space-y-1">
            <Label className="text-xs dark:text-white">Quality: {quality}%</Label>
            <Slider
              value={[quality]}
              onValueChange={(value) => {
                setQuality(value[0]);
                if (originalImage) compressImage(originalImage, originalSize);
              }}
              max={100}
              min={10}
              step={5}
              className="dark:bg-gray-700"
              data-testid="slider-quality"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <Label className="text-xs dark:text-white">Target Size: {targetSize} MB</Label>
            <Slider
              value={[targetSize]}
              onValueChange={(value) => {
                setTargetSize(value[0]);
                if (originalImage) compressImage(originalImage, originalSize);
              }}
              max={10}
              min={0.5}
              step={0.5}
              className="dark:bg-gray-700"
              data-testid="slider-target-size"
            />
          </div>
        )}
      </div>

      {originalImage && compressedImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-zoomIn">
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoice) {
          setSelectedVoice(availableVoices[0].name);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = () => {
    if (!text.trim()) {
      toast({ title: "Error", description: "Please enter some text first" });
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;
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

  const downloadAudio = async () => {
    if (!text.trim()) {
      toast({ title: "Error", description: "Please enter some text first" });
      return;
    }

    try {
      const stream = await (navigator.mediaDevices as any).getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = 'tts-audio.webm';
        link.click();
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        toast({ title: "Downloaded!", description: "Audio saved successfully" });
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      speak();
      setTimeout(() => {
        mediaRecorder.stop();
      }, text.length * 100);
    } catch (err) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;

      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = 'tts-audio.webm';
        link.click();
        toast({ title: "Downloaded!", description: "Audio saved successfully" });
      };

      mediaRecorder.start();
      window.speechSynthesis.speak(utterance);
      utterance.onend = () => {
        setTimeout(() => mediaRecorder.stop(), 100);
      };
    }
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <Textarea
        placeholder="Enter text to convert to speech..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="dark:bg-gray-800 dark:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] focus:shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-slideInFromBottom"
        data-testid="textarea-tts"
      />

      <div className="space-y-3 animate-slideInFromLeft" style={{ animationDelay: '0.1s' }}>
        <div className="space-y-2">
          <Label className="text-sm font-semibold dark:text-white">Voice Selection</Label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="dark:bg-gray-800 dark:text-white" data-testid="select-voice">
              <SelectValue placeholder="Choose voice..." />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white max-h-60">
              {voices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs dark:text-white">Pitch: {pitch.toFixed(1)}</Label>
            <Slider
              value={[pitch]}
              onValueChange={(value) => setPitch(value[0])}
              max={2}
              min={0.5}
              step={0.1}
              className="dark:bg-gray-700"
              data-testid="slider-pitch"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs dark:text-white">Speed: {rate.toFixed(1)}</Label>
            <Slider
              value={[rate]}
              onValueChange={(value) => setRate(value[0])}
              max={2}
              min={0.5}
              step={0.1}
              className="dark:bg-gray-700"
              data-testid="slider-rate"
            />
          </div>
        </div>
      </div>

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
        <Button onClick={downloadAudio} variant="outline" className="flex-1 dark:border-purple-500 dark:text-purple-400 dark:hover:bg-purple-500/10 transition-all duration-300 hover:scale-105" data-testid="button-download-audio">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

const QRCodeGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState('white');
  const { toast } = useToast();

  const backgrounds = [
    { id: 'white', name: 'Classic White', class: 'bg-white', preview: 'bg-white' },
    { id: 'gradient-blue', name: 'Ocean Blue', class: 'bg-gradient-to-br from-blue-400 to-cyan-300', preview: 'bg-gradient-to-br from-blue-400 to-cyan-300' },
    { id: 'gradient-purple', name: 'Purple Dream', class: 'bg-gradient-to-br from-purple-400 to-pink-300', preview: 'bg-gradient-to-br from-purple-400 to-pink-300' },
    { id: 'gradient-sunset', name: 'Sunset Glow', class: 'bg-gradient-to-br from-orange-400 to-red-400', preview: 'bg-gradient-to-br from-orange-400 to-red-400' },
    { id: 'gradient-emerald', name: 'Emerald Forest', class: 'bg-gradient-to-br from-green-400 to-emerald-300', preview: 'bg-gradient-to-br from-green-400 to-emerald-300' },
    { id: 'gradient-cyber', name: 'Cyber Neon', class: 'bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500', preview: 'bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500' },
  ];

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
      toast({ title: "Generated!", description: "QR code created successfully with custom background!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate QR code", variant: "destructive" });
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const padding = 40;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;

      const selectedBg = backgrounds.find(bg => bg.id === selectedBackground);
      if (selectedBg?.id === 'white') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        if (selectedBg?.id === 'gradient-blue') {
          gradient.addColorStop(0, '#60A5FA');
          gradient.addColorStop(1, '#67E8F9');
        } else if (selectedBg?.id === 'gradient-purple') {
          gradient.addColorStop(0, '#C084FC');
          gradient.addColorStop(1, '#F9A8D4');
        } else if (selectedBg?.id === 'gradient-sunset') {
          gradient.addColorStop(0, '#FB923C');
          gradient.addColorStop(1, '#F87171');
        } else if (selectedBg?.id === 'gradient-emerald') {
          gradient.addColorStop(0, '#4ADE80');
          gradient.addColorStop(1, '#6EE7B7');
        } else if (selectedBg?.id === 'gradient-cyber') {
          gradient.addColorStop(0, '#06B6D4');
          gradient.addColorStop(0.5, '#A855F7');
          gradient.addColorStop(1, '#EC4899');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, padding, padding);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `qrcode-${selectedBg?.id || 'white'}.png`;
      link.click();
      toast({ title: "Downloaded!", description: "QR code with custom background saved!" });
    };
    img.src = qrCodeUrl;
  };

  return (
    <div className="space-y-4 animate-fadeUp">
      <Input
        placeholder="Enter text or URL..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        data-testid="input-qr-text"
        className="dark:bg-gray-800 dark:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-slideInFromLeft"
      />

      <div className="space-y-2 animate-slideInFromRight" style={{ animationDelay: '0.1s' }}>
        <Label className="text-sm font-semibold dark:text-white">Choose Background Style</Label>
        <div className="grid grid-cols-3 gap-2">
          {backgrounds.map((bg, idx) => (
            <button
              key={bg.id}
              onClick={() => setSelectedBackground(bg.id)}
              className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 animate-bounceIn ${
                selectedBackground === bg.id 
                  ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              data-testid={`button-bg-${bg.id}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className={`w-full h-12 rounded ${bg.preview} mb-1`}></div>
              <p className="text-xs dark:text-white text-center">{bg.name}</p>
            </button>
          ))}
        </div>
      </div>

      <Button onClick={generateQRCode} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] animate-popIn" data-testid="button-generate-qr">
        <QrCode className="mr-2 h-4 w-4 animate-spin-slow" />
        Generate QR Code
      </Button>

      {qrCodeUrl && (
        <div className="space-y-4 animate-zoomIn">
          <div className={`flex justify-center p-8 rounded-lg ${backgrounds.find(bg => bg.id === selectedBackground)?.class} shadow-xl transition-all duration-500 hover:scale-105`}>
            <img src={qrCodeUrl} alt="QR Code" className="transition-all duration-500" data-testid="img-qr-code" />
          </div>
          <Button onClick={downloadQRCode} variant="outline" className="w-full dark:border-green-500 dark:text-green-400 dark:hover:bg-green-500/10 transition-all duration-300 hover:scale-105 animate-bounceIn" data-testid="button-download-qr">
            <Download className="mr-2 h-4 w-4 animate-bounce" />
            Download QR Code with Background
          </Button>
        </div>
      )}
    </div>
  );
};

const ClipboardManager = () => {
  const [currentNote, setCurrentNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('clipboard-notes');
    if (saved) {
      setSavedNotes(JSON.parse(saved));
    }
  }, []);

  const saveNote = () => {
    if (!currentNote.trim()) {
      toast({ title: "Error", description: "Please enter some text first" });
      return;
    }

    const updated = [currentNote, ...savedNotes];
    setSavedNotes(updated);
    localStorage.setItem('clipboard-notes', JSON.stringify(updated));
    setCurrentNote('');
    toast({ title: "Saved!", description: "Note added to clipboard" });
  };

  const copyNote = (note: string) => {
    navigator.clipboard.writeText(note);
    toast({ title: "Copied!", description: "Note copied to clipboard" });
  };

  const deleteNote = (index: number) => {
    const updated = savedNotes.filter((_, i) => i !== index);
    setSavedNotes(updated);
    localStorage.setItem('clipboard-notes', JSON.stringify(updated));
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

      <Button onClick={saveNote} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] animate-popIn" data-testid="button-save-note">
        <ClipboardCopy className="mr-2 h-4 w-4 animate-pulse" />
        Save Note
      </Button>

      {savedNotes.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar animate-slideInFromBottom">
          {savedNotes.map((note, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 border border-orange-500/20 dark:border-orange-500/40 hover:scale-[1.02] transition-all duration-300"
              data-testid={`note-${index}`}
            >
              <span className="flex-1 text-sm break-all dark:text-white">{note}</span>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => copyNote(note)} className="dark:hover:bg-gray-700 hover:scale-125 transition-all" data-testid={`button-copy-note-${index}`}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteNote(index)} className="dark:hover:bg-gray-700 hover:scale-125 transition-all text-red-500" data-testid={`button-delete-note-${index}`}>
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
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
};

// Platform Download Card Component - Enhanced Version
const PlatformDownloadCard = ({ platform, name, icon, color, delay }: { platform: string; name: string; icon: string; color: string; delay: number }) => {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    if (platform === 'youtube') {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      ];
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
    }
    return null;
  };

  const getVideoTitle = (url: string) => {
    const videoId = extractVideoId(url);
    if (videoId && platform === 'youtube') {
      return `YouTube Video - ${videoId}`;
    }
    return `${name} Video`;
  };

  const copyTitle = () => {
    const title = getVideoTitle(url);
    navigator.clipboard.writeText(title);
    toast({ title: "Copied!", description: "Video title copied to clipboard" });
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "URL copied to clipboard" });
  };

  const handlePreview = () => {
    const videoId = extractVideoId(url);
    if (videoId && platform === 'youtube') {
      setShowPreview(!showPreview);
    } else {
      toast({ title: "Preview unavailable", description: `Preview is currently only available for YouTube videos` });
    }
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({ title: "Error", description: "Please enter a URL" });
      return;
    }

    setDownloading(true);
    toast({ title: "Initiating Download...", description: `Fetching data from ${name}...` });

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setVideoData(data);

      toast({
        title: "Download Ready! 🎉",
        description: "Click the download button below to save your video",
        duration: 5000,
      });

    } catch (error: any) {
      toast({ title: "Download Failed", description: error.message, variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  const videoId = extractVideoId(url);

  return (
    <Card className="dark:bg-gray-900/95 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 relative overflow-hidden border-2 rounded-2xl animate-bounceIn group" style={{ animationDelay: `${delay}s` }}>
      {/* Animated gradient border */}
      <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-2xl" />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5" />
      
      <CardHeader className="relative z-10 pb-3">
        <CardTitle className="flex items-center gap-3 dark:text-white text-lg">
          <div className={`p-3 bg-gradient-to-br ${color} rounded-xl shadow-lg text-2xl transform group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="flex-1">
            <span className="font-bold">{name}</span>
            <p className="text-xs text-muted-foreground mt-0.5">Download videos in HD quality</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-3 pt-0">
        <div className="space-y-2">
          <Label className="text-xs font-semibold dark:text-white flex items-center gap-2">
            <Video className="w-3 h-3" />
            Video URL
          </Label>
          <div className="relative">
            <Input 
              placeholder={`Paste ${name} URL here...`}
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              className="dark:bg-gray-800 dark:text-white text-sm h-10 pr-20 border-2 focus:border-primary transition-all"
              data-testid={`input-${platform}-url`}
            />
            {url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={copyUrl}
                className="absolute right-1 top-1 h-8 px-2 hover:bg-primary/10"
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleDownload} 
            disabled={downloading || !url.trim()}
            className={`bg-gradient-to-r ${color} text-sm h-10 transition-all duration-300 disabled:opacity-50 hover:scale-105 shadow-lg`}
            data-testid={`button-download-${platform}`}
          >
            {downloading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 8l2-2.709z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={!url.trim() || platform !== 'youtube'}
            className="text-sm h-10 border-2 hover:border-primary transition-all duration-300 hover:scale-105"
          >
            <Video className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>

        {/* Utility buttons */}
        {url && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyTitle}
              className="flex-1 text-xs border-2 hover:border-primary/50"
            >
              <ClipboardCopy className="mr-1 h-3 w-3" />
              Copy Title
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUrl('');
                setVideoData(null);
                setShowPreview(false);
              }}
              className="text-xs border-2 hover:border-red-500/50 hover:text-red-500"
            >
              Clear
            </Button>
          </div>
        )}

        {/* Video Preview */}
        {showPreview && videoId && platform === 'youtube' && (
          <div className="mt-4 rounded-lg overflow-hidden border-2 border-primary/30 animate-fadeUp">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Video Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Download ready section */}
        {videoData && videoData.downloadUrl && (
          <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 animate-bounceIn">
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Ready to Download!
            </p>
            <Button
              onClick={() => window.open(videoData.downloadUrl, '_blank')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Download className="mr-2 h-4 w-4" />
              Open Download Page
            </Button>
          </div>
        )}

        {/* Platform info */}
        <div className="mt-3 p-2 rounded bg-primary/5 border border-primary/10">
          <p className="text-xs text-muted-foreground text-center">
            {videoData?.instructions || `Paste a ${name} video URL above to get started`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};


// Main Tools Page Component
export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState<'ff-tools' | 'utilities' | 'downloads' | null>(null);
  
  // Add proper padding and spacing to prevent any overlapping
  const categoryContainerClass = "pb-32 md:pb-40 relative z-10 mb-20";

  // Category Selection Screen
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-floatSlow"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '4s' }}></div>
        </div>

        <HeroSection
          title="🛠️ Gaming & Utility Tools"
          subtitle="Choose your category to access powerful tools!"
        />

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-4 mb-20">
            {/* FF Tools Card */}
            <div
              className="group relative cursor-pointer transform transition-all duration-700 hover:scale-105 animate-fadeUp"
              onClick={() => setSelectedCategory('ff-tools')}
              data-testid="card-category-ff-tools"
              style={{ animationDelay: '0.2s' }}
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
                  <div className="absolute bottom-10 left-20 w-2 h-2 bg-cyan-300 rounded-full animate-pulse shadow-[0_0_10px_rgba(103,232,249,0.8)]" style={{ animationDelay: '0.6s' }}></div>
                  <div className="absolute bottom-20 right-10 w-2 h-2 bg-blue-300 rounded-full animate-pulse shadow-[0_0_10px_rgba(147,197,253,0.8)]" style={{ animationDelay: '0.9s' }}></div>
                  <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
                </div>

                {/* Icon Container with Enhanced 3D Effect */}
                <div className="relative mb-8">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_80px_rgba(249,115,22,1)] transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 animate-pulse-slow" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}>
                    <Gamepad2 className="w-14 h-14 sm:w-16 sm:h-16 text-white animate-pulse group-hover:animate-wiggle" />
                  </div>
                  <div className="absolute inset-0 bg-orange-500/60 dark:bg-orange-500/80 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700"></div>
                </div>

                {/* Title */}
                <h3 className="relative text-3xl sm:text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent group-hover:scale-105 transform transition-transform duration-300">
                  Free Fire Tools 🎮
                </h3>

                {/* Description */}
                <p className="relative text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Stylish name generator, UID creator, advanced sensitivity settings, and secure password generator for gamers
                </p>

                {/* Feature Pills */}
                <div className="relative flex flex-wrap gap-2 mb-8">
                  <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/30 dark:to-blue-500/30 border border-cyan-500/40 dark:border-cyan-500/50 rounded-full text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-300 transform group-hover:scale-110 transition-all duration-300 shadow-md">
                    FF Names
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 border border-purple-500/40 dark:border-purple-500/50 rounded-full text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.05s' }}>
                    UID Gen
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 border border-green-500/40 dark:border-green-500/50 rounded-full text-xs sm:text-sm font-bold text-green-700 dark:text-green-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.1s' }}>
                    Sensitivity
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 dark:from-orange-500/30 dark:to-red-500/30 border border-orange-500/40 dark:border-orange-500/50 rounded-full text-xs sm:text-sm font-bold text-orange-700 dark:text-orange-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.15s' }}>
                    Passwords
                  </span>
                </div>

                {/* CTA */}
                <div className="relative flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent group-hover:translate-x-2 transition-transform duration-300">
                    Get Started →
                  </span>
                  <div className="relative">
                    <Star className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500 animate-spin-slow" />
                    <div className="absolute inset-0 bg-orange-500/60 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Utility Tools Card */}
            <div
              className="group relative cursor-pointer transform transition-all duration-700 hover:scale-105 animate-fadeUp"
              onClick={() => setSelectedCategory('utilities')}
              data-testid="card-category-utilities"
              style={{ animationDelay: '0.4s' }}
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
                  Productivity Tools 🔧
                </h3>

                {/* Description */}
                <p className="relative text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Image optimization, text-to-speech converter, QR generator, and clipboard manager to boost productivity
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

            {/* Downloads Category Card */}
            <div
              className="group relative cursor-pointer transform transition-all duration-700 hover:scale-105 animate-fadeUp"
              onClick={() => setSelectedCategory('downloads')}
              data-testid="card-category-downloads"
              style={{ animationDelay: '0.6s' }}
            >
              {/* Gradient Border Effect with Animation */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-md animate-gradient-shift"></div>

              {/* Glow Effect on Hover */}
              <div className="absolute -inset-2 bg-gradient-to-r from-red-500/50 to-pink-500/50 opacity-0 group-hover:opacity-30 blur-3xl rounded-3xl transition-opacity duration-700"></div>

              {/* Card Content with 3D Transform */}
              <div className="relative bg-white dark:bg-gray-900 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-800 group-hover:border-red-500/60 dark:group-hover:border-red-500/80 rounded-3xl p-8 sm:p-10 transition-all duration-500 shadow-2xl group-hover:shadow-[0_30px_100px_rgba(239,68,68,0.4)] dark:group-hover:shadow-[0_30px_100px_rgba(239,68,68,0.6)]" style={{ transform: 'translateZ(20px)' }}>

                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-pink-500/5 to-red-500/5 dark:from-red-500/10 dark:via-pink-500/10 dark:to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                {/* Enhanced Animated Particles with More Elements */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-10 left-10 w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                  <div className="absolute top-20 right-20 w-2 h-2 bg-pink-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute bottom-10 left-20 w-2 h-2 bg-red-300 rounded-full animate-pulse shadow-[0_0_10px_rgba(252,165,165,0.8)]" style={{ animationDelay: '0.6s' }}></div>
                  <div className="absolute bottom-20 right-10 w-2 h-2 bg-pink-300 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,168,212,0.8)]" style={{ animationDelay: '0.9s' }}></div>
                  <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
                </div>

                {/* Icon Container with Enhanced 3D Effect */}
                <div className="relative mb-8">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-red-500 via-orange-500 to-pink-600 flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_80px_rgba(239,68,68,1)] transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 animate-pulse-slow" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}>
                    <Download className="w-14 h-14 sm:w-16 sm:h-16 text-white animate-pulse group-hover:animate-wiggle" />
                  </div>
                  <div className="absolute inset-0 bg-red-500/60 dark:bg-red-500/80 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700"></div>
                </div>

                {/* Title */}
                <h3 className="relative text-3xl sm:text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent group-hover:scale-105 transform transition-transform duration-300">
                  Video Downloads 📥
                </h3>

                {/* Description */}
                <p className="relative text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Download videos from various platforms like YouTube, TikTok, Instagram and more!
                </p>

                {/* Feature Pills */}
                <div className="relative flex flex-wrap gap-2 mb-8">
                  <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/30 dark:to-blue-500/30 border border-cyan-500/40 dark:border-cyan-500/50 rounded-full text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-300 transform group-hover:scale-110 transition-all duration-300 shadow-md">
                    YouTube
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 border border-purple-500/40 dark:border-purple-500/50 rounded-full text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.05s' }}>
                    TikTok
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 border border-green-500/40 dark:border-green-500/50 rounded-full text-xs sm:text-sm font-bold text-green-700 dark:text-green-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.1s' }}>
                    Instagram
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 dark:from-orange-500/30 dark:to-red-500/30 border border-orange-500/40 dark:border-orange-500/50 rounded-full text-xs sm:text-sm font-bold text-orange-700 dark:text-orange-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.15s' }}>
                    Facebook
                  </span>
                </div>

                {/* CTA */}
                <div className="relative flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent group-hover:translate-x-2 transition-transform duration-300">
                    Download Now →
                  </span>
                  <div className="relative">
                    <Download className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 animate-bounce" />
                    <div className="absolute inset-0 bg-red-500/60 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Placement */}
          <div className="mt-16 animate-fadeUp" style={{ animationDelay: '0.6s' }}>
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
          subtitle="Level up your gaming with advanced tools!"
        />

        <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10 max-w-6xl">
          <Button 
            onClick={() => setSelectedCategory(null)} 
            variant="outline" 
            className="mb-6 group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] dark:border-cyan-500/50 dark:hover:bg-cyan-500/10 animate-slideInFromLeft"
            data-testid="button-back-category"
          >
            <Wrench className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            Back to Categories
          </Button>

          <div className={categoryContainerClass}>
          <Tabs defaultValue="ffname" className="w-full relative z-10 mb-20">
            <TabsList className="flex flex-wrap justify-center gap-2 mb-8 p-3 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 dark:from-cyan-500/20 dark:via-blue-500/20 dark:to-purple-500/20 backdrop-blur-xl border-2 border-cyan-500/30 dark:border-cyan-500/50 rounded-2xl shadow-xl animate-slideInFromBottom relative z-10" data-testid="tabs-ff-tools">
              <TabsTrigger value="ffname" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/40 data-[state=active]:to-blue-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-cyan-500/50" data-testid="tab-ffname">
                <Wand2 className="h-4 w-4" />
                <span className="whitespace-nowrap">FF Name</span>
              </TabsTrigger>
              <TabsTrigger value="uid" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/40 data-[state=active]:to-pink-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-purple-500/50" data-testid="tab-uid">
                <Gamepad2 className="h-4 w-4" />
                <span className="whitespace-nowrap">UID Gen</span>
              </TabsTrigger>
              <TabsTrigger value="sensitivity" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/40 data-[state=active]:to-emerald-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-green-500/50" data-testid="tab-sensitivity">
                <Zap className="h-4 w-4" />
                <span className="whitespace-nowrap">Sensitivity</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/40 data-[state=active]:to-red-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-orange-500/50" data-testid="tab-password">
                <Shield className="h-4 w-4" />
                <span className="whitespace-nowrap">Password</span>
              </TabsTrigger>
              <TabsTrigger value="weapons" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/40 data-[state=active]:to-orange-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-red-500/50" data-testid="tab-weapons">
                <Crosshair className="h-4 w-4" />
                <span className="whitespace-nowrap">Weapons</span>
              </TabsTrigger>
              <TabsTrigger value="drop" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-blue-500/50" data-testid="tab-drop">
                <Target className="h-4 w-4" />
                <span className="whitespace-nowrap">Drop Sim</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ffname" className="mt-6 animate-fadeUp relative z-10 mb-10">
              <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-lg transition-all duration-300 relative overflow-hidden border-2 rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-cyan-500/10 animate-gradient-shift" />
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textBounceIn text-xl sm:text-2xl mb-2">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
                      <Sparkles className="h-6 w-6 text-white animate-pulse" />
                    </div>
                    Free Fire Stylish Name Generator
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 animate-textFadeSlide text-sm sm:text-base" style={{ animationDelay: '0.1s' }}>
                    Create unique, stylish names with fancy fonts and symbols ✨
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 pt-2">
                  <FFNameGenerator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="uid" className="mt-8 sm:mt-12 animate-fadeUp relative z-30">
              <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-purple-500/50 rounded-2xl z-30">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 animate-gradient-shift" />
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textBounceIn text-xl sm:text-2xl">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
                      <Gamepad2 className="h-6 w-6 text-white animate-bounce" />
                    </div>
                    Random UID Generator
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 animate-textFadeSlide text-sm sm:text-base" style={{ animationDelay: '0.1s' }}>
                    Generate random Free Fire UIDs for testing 🎮
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <UIDGenerator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sensitivity" className="mt-8 sm:mt-12 animate-fadeUp relative z-30">
              <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] dark:hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-green-500/50 rounded-2xl z-30">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 animate-gradient-shift" />
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textBounceIn text-xl sm:text-2xl">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                      <Sparkles className="h-6 w-6 text-white animate-pulse" />
                    </div>
                    Advanced Sensitivity Generator
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 animate-textFadeSlide text-sm sm:text-base" style={{ animationDelay: '0.1s' }}>
                    Get device-optimized sensitivity settings (Max 200) with DPI adjustment ⚡
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <SensitivityGenerator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password" className="mt-8 sm:mt-12 animate-fadeUp relative z-30">
              <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] dark:hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-orange-500/50 rounded-2xl z-30">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-orange-500/10 animate-gradient-shift" />
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textBounceIn text-xl sm:text-2xl">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg">
                      <Shield className="h-6 w-6 text-white animate-pulse" />
                    </div>
                    Secure Password Generator
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 animate-textFadeSlide text-sm sm:text-base" style={{ animationDelay: '0.1s' }}>
                    Create strong, secure passwords for your gaming accounts 🔒
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <PasswordGenerator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weapons" className="mt-8 sm:mt-12 animate-fadeUp relative z-30">
              <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] dark:hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-red-500/50 rounded-2xl z-30">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-red-500/10 animate-gradient-shift" />
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textBounceIn text-xl sm:text-2xl">
                    <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg shadow-lg">
                      <Crosshair className="h-6 w-6 text-white animate-pulse" />
                    </div>
                    FF Weapon Stats Lookup
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 animate-textFadeSlide text-sm sm:text-base" style={{ animationDelay: '0.1s' }}>
                    View detailed weapon statistics and compare performance 🎯
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <WeaponStatsLookup />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drop" className="mt-8 sm:mt-12 animate-fadeUp relative z-30">
              <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-blue-500/50 rounded-2xl z-30">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-blue-500/10 animate-gradient-shift" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textBounceIn text-xl sm:text-2xl">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg">
                      <Target className="h-6 w-6 text-white animate-spin-slow" />
                    </div>
                    Drop Location Simulator
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400 animate-textFadeSlide text-sm sm:text-base" style={{ animationDelay: '0.1s' }}>
                    Simulate random drop locations with loot and risk analysis 📍
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <DropSimulator />
                </CardContent>
              </Card>
            </TabsContent>

            </Tabs>
        </div>

          <div className="mt-12 animate-fadeUp">
            <AdSenseAd />
          </div>

          {/* Feedback Section */}
          <div className="mt-12 animate-fadeUp" style={{ animationDelay: '0.6s' }}>
            <PageFeedback pageName="FF Tools" />
          </div>
        </div>
      </div>
    );
  }

  // Downloads Category
  if (selectedCategory === 'downloads') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-floatSlow"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1s' }}></div>
        </div>

        <HeroSection
          title="📥 Video Downloads"
          subtitle="Download videos from your favorite platforms!"
        />

        <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10 max-w-6xl">
          <Button 
            onClick={() => setSelectedCategory(null)} 
            variant="outline" 
            className="mb-6 group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] dark:border-red-500/50 dark:hover:bg-red-500/10 animate-slideInFromLeft"
            data-testid="button-back-category"
          >
            <Video className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            Back to Categories
          </Button>

          <div className={categoryContainerClass}>
            {/* Featured YouTube Downloader */}
            <div className="mb-8 animate-fadeUp">
              <Link href="/tools/youtube-downloader">
                <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 cursor-pointer group border-2 hover:border-red-500/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg text-4xl group-hover:scale-110 transition-transform">
                        🎥
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">YouTube Downloader - Full Version</h3>
                        <p className="text-muted-foreground">Enhanced experience with video preview, title copy, and more features</p>
                      </div>
                      <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:scale-110 transition-transform">
                        Open Full Page →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
              <PlatformDownloadCard 
                platform="youtube" 
                name="YouTube" 
                icon="🎥" 
                color="from-red-500 to-red-600" 
                delay={0.1} 
              />
              <PlatformDownloadCard 
                platform="tiktok" 
                name="TikTok" 
                icon="🎵" 
                color="from-pink-500 to-purple-600" 
                delay={0.2} 
              />
              <PlatformDownloadCard 
                platform="instagram" 
                name="Instagram" 
                icon="📸" 
                color="from-purple-500 to-pink-600" 
                delay={0.3} 
              />
              <PlatformDownloadCard 
                platform="facebook" 
                name="Facebook" 
                icon="👥" 
                color="from-blue-500 to-blue-600" 
                delay={0.4} 
              />
              <PlatformDownloadCard 
                platform="twitter" 
                name="Twitter/X" 
                icon="🐦" 
                color="from-sky-500 to-blue-600" 
                delay={0.5} 
              />
              <PlatformDownloadCard 
                platform="pinterest" 
                name="Pinterest" 
                icon="📌" 
                color="from-red-600 to-pink-600" 
                delay={0.6} 
              />
              <PlatformDownloadCard 
                platform="vimeo" 
                name="Vimeo" 
                icon="🎬" 
                color="from-cyan-500 to-blue-600" 
                delay={0.7} 
              />
              <PlatformDownloadCard 
                platform="dailymotion" 
                name="Dailymotion" 
                icon="▶️" 
                color="from-indigo-500 to-purple-600" 
                delay={0.8} 
              />
              <PlatformDownloadCard 
                platform="reddit" 
                name="Reddit" 
                icon="🤖" 
                color="from-orange-500 to-red-600" 
                delay={0.9} 
              />
            </div>
          </div>

          <div className="mt-12 animate-fadeUp">
            <AdSenseAd />
          </div>

          {/* Feedback Section */}
          <div className="mt-12 animate-fadeUp" style={{ animationDelay: '0.6s' }}>
            <PageFeedback pageName="Video Downloads" />
          </div>
        </div>
      </div>
    );
  }

  // Utilities Category - Return statement at the end
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1s' }}></div>
      </div>

      <HeroSection
        title="🔧 Productivity Tools"
        subtitle="Boost your productivity with these essential utilities!"
      />

      <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10 max-w-6xl">
        <Button 
          onClick={() => setSelectedCategory(null)} 
          variant="outline" 
          className="mb-6 group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] dark:border-purple-500/50 dark:hover:bg-purple-500/10 animate-slideInFromLeft"
          data-testid="button-back-category"
        >
          <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
          Back to Categories
        </Button>

        <div className={categoryContainerClass}>
          <Tabs defaultValue="image" className="w-full relative z-10 mb-20">
            <TabsList className="flex flex-wrap justify-center gap-2 p-3 dark:bg-gray-800/50 backdrop-blur-xl mb-8 animate-fadeUp shadow-xl rounded-2xl border-2 border-gray-200 dark:border-gray-700 relative z-10" data-testid="tabs-utility">
            <TabsTrigger value="image" data-testid="tab-image" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/40 data-[state=active]:to-blue-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-cyan-500/50">
              <ImageDown className="h-4 w-4" />
              <span className="whitespace-nowrap">Image</span>
            </TabsTrigger>
            <TabsTrigger value="tts" data-testid="tab-tts" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/40 data-[state=active]:to-pink-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-purple-500/50">
              <Volume2 className="h-4 w-4" />
              <span className="whitespace-nowrap">TTS</span>
            </TabsTrigger>
            <TabsTrigger value="qr" data-testid="tab-qr" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/40 data-[state=active]:to-emerald-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-green-500/50">
              <QrCode className="h-4 w-4" />
              <span className="whitespace-nowrap">QR Code</span>
            </TabsTrigger>
            <TabsTrigger value="clipboard" data-testid="tab-clipboard" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/40 data-[state=active]:to-red-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-orange-500/50">
              <ClipboardCopy className="h-4 w-4" />
              <span className="whitespace-nowrap">Clipboard</span>
            </TabsTrigger>
            <TabsTrigger value="text-formatter" data-testid="tab-text-formatter" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/40 data-[state=active]:to-pink-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-purple-500/50">
              <Type className="h-4 w-4" />
              <span className="whitespace-nowrap">Formatter</span>
            </TabsTrigger>
            <TabsTrigger value="nickname" data-testid="tab-nickname" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/40 data-[state=active]:to-emerald-500/40 data-[state=active]:shadow-lg rounded-xl border-2 border-transparent data-[state=active]:border-green-500/50">
              <UserPlus className="h-4 w-4" />
              <span className="whitespace-nowrap">Nickname</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-8 sm:mt-12 animate-fadeUp relative z-30">
            <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-cyan-500/50 rounded-2xl z-30">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-cyan-500/10 animate-gradient-shift" />
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textShine text-xl sm:text-2xl">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
                    <ImageDown className="h-6 w-6 text-white animate-bounce-slow" />
                  </div>
                  Image Compressor
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-sm sm:text-base">
                  Reduce image file size while maintaining quality 📸
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ImageCompressor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tts" className="mt-8 sm:mt-12 animate-fadeUp relative z-30">
            <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-purple-500/50 rounded-2xl z-30">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 animate-gradient-shift" />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textShine text-xl sm:text-2xl">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
                    <Volume2 className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  Text-to-Speech
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-sm sm:text-base">
                  Convert any text to natural-sounding speech 🔊
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <TextToSpeech />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="mt-8 sm:mt-12 animate-fadeUp relative z-30">
            <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] dark:hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-green-500/50 rounded-2xl z-30">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 animate-gradient-shift" />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textShine text-xl sm:text-2xl">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                    <QrCode className="h-6 w-6 text-white animate-spin-slow" />
                  </div>
                  QR Code Generator
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-sm sm:text-base">
                  Generate QR codes for any text or URL instantly 📱
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <QRCodeGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clipboard" className="mt-8 sm:mt-12 animate-fadeUp relative z-30">
            <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] dark:hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-orange-500/50 rounded-2xl z-30">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-orange-500/10 animate-gradient-shift" />
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textShine text-xl sm:text-2xl">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg">
                    <ClipboardCopy className="h-6 w-6 text-white animate-wiggle" />
                  </div>
                  Clipboard Manager
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-sm sm:text-base">
                  Save and manage text snippets for quick access 📋
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ClipboardManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text-formatter" className="mt-8 sm:mt-12 animate-fadeUp relative z-30">
            <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-purple-500/50 rounded-2xl z-30">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 animate-gradient-shift" />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textShine text-xl sm:text-2xl">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
                    <Type className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  Text Formatter
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-sm sm:text-base">
                  Transform text with various formatting options ✍️
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <TextFormatter />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nickname" className="mt-8 sm:mt-12 animate-fadeUp relative z-30">
            <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] dark:hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] transition-all duration-500 relative overflow-hidden border-2 hover:border-green-500/50 rounded-2xl z-30">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 animate-gradient-shift" />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 dark:text-white animate-textShine text-xl sm:text-2xl">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                    <UserPlus className="h-6 w-6 text-white animate-bounce-slow" />
                  </div>
                  Random Nickname Generator
                </CardTitle>
                <CardDescription className="dark:text-gray-400 animate-fadeInLeft text-sm sm:text-base">
                  Generate unique gaming nicknames instantly 🎮
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <RandomNicknameGenerator />
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 animate-fadeUp">
          <AdSenseAd />
        </div>

        {/* Feedback Section */}
        <div className="mt-12 animate-fadeUp" style={{ animationDelay: '0.6s' }}>
          <PageFeedback pageName="Utility Tools" />
        </div>
      </div>
    </div>
  );
}