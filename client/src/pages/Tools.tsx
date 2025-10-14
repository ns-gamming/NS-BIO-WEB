import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Copy, Sparkles, Shield, Gamepad2, Wand2, QrCode, Download, ArrowRight } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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
    trackToolUsage.mutate('ff-name-generator');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Name copied to clipboard" });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter your name..."
          value={baseName}
          onChange={(e) => setBaseName(e.target.value)}
          data-testid="input-ffname"
          className="flex-1 dark:bg-gray-800 dark:text-white"
        />
        <Button onClick={generateNames} data-testid="button-generate-ffname" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
          <Wand2 className="mr-2 h-4 w-4" />
          Generate
        </Button>
      </div>

      {generatedNames.length > 0 && (
        <div className="grid gap-3">
          {generatedNames.map((name, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-500/20 dark:border-cyan-500/40"
              data-testid={`text-ffname-${index}`}
            >
              <span className="text-lg font-semibold dark:text-white">{name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(name)}
                data-testid={`button-copy-ffname-${index}`}
                className="dark:hover:bg-gray-700"
              >
                <Copy className="h-4 w-4" />
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
    trackToolUsage.mutate('uid-generator');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "UID copied to clipboard" });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label data-testid="label-uid-count">Number of UIDs to generate: {uidCount}</Label>
        <Slider
          value={[uidCount]}
          onValueChange={(value) => setUidCount(value[0])}
          max={10}
          min={1}
          step={1}
          className="dark:bg-gray-700"
          data-testid="slider-uid-count"
        />
      </div>

      <Button onClick={generateUIDs} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" data-testid="button-generate-uid">
        <Gamepad2 className="mr-2 h-4 w-4" />
        Generate UIDs
      </Button>

      {generatedUIDs.length > 0 && (
        <div className="grid gap-2">
          {generatedUIDs.map((uid, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-500/20 dark:border-purple-500/40"
              data-testid={`text-uid-${index}`}
            >
              <span className="font-mono text-lg dark:text-white">{uid}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(uid)}
                data-testid={`button-copy-uid-${index}`}
                className="dark:hover:bg-gray-700"
              >
                <Copy className="h-4 w-4" />
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
    trackToolUsage.mutate('sensitivity-generator');
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label data-testid="label-gamemode">Select Game Mode</Label>
        <Select value={gameMode} onValueChange={setGameMode}>
          <SelectTrigger className="dark:bg-gray-800 dark:text-white" data-testid="select-gamemode">
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

      <Button onClick={generateSensitivity} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" data-testid="button-generate-sensitivity">
        <Sparkles className="mr-2 h-4 w-4" />
        Generate Settings
      </Button>

      {sensitivity && (
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-500/20 dark:border-green-500/40 space-y-2">
            <div className="flex justify-between" data-testid="text-general-sensitivity">
              <span className="dark:text-gray-300">General Sensitivity:</span>
              <span className="font-bold dark:text-white">{sensitivity.general}</span>
            </div>
            <div className="flex justify-between" data-testid="text-reddot-sensitivity">
              <span className="dark:text-gray-300">Red Dot:</span>
              <span className="font-bold dark:text-white">{sensitivity.red_dot}</span>
            </div>
            <div className="flex justify-between" data-testid="text-2x-sensitivity">
              <span className="dark:text-gray-300">2x Scope:</span>
              <span className="font-bold dark:text-white">{sensitivity.scope_2x}</span>
            </div>
            <div className="flex justify-between" data-testid="text-4x-sensitivity">
              <span className="dark:text-gray-300">4x Scope:</span>
              <span className="font-bold dark:text-white">{sensitivity.scope_4x}</span>
            </div>
            <div className="flex justify-between" data-testid="text-awm-sensitivity">
              <span className="dark:text-gray-300">AWM Scope:</span>
              <span className="font-bold dark:text-white">{sensitivity.awm}</span>
            </div>
          </div>

          <Button onClick={downloadSettings} variant="outline" className="w-full dark:border-green-500 dark:text-green-400 dark:hover:bg-green-500/10" data-testid="button-download-sensitivity">
            <Download className="mr-2 h-4 w-4" />
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
    trackToolUsage.mutate('password-generator');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({ title: "Copied!", description: "Password copied to clipboard" });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label data-testid="label-password-length">Password Length: {length}</Label>
        <Slider
          value={[length]}
          onValueChange={(value) => setLength(value[0])}
          max={32}
          min={8}
          step={1}
          className="dark:bg-gray-700"
          data-testid="slider-password-length"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-4 h-4 text-cyan-500 rounded"
            data-testid="checkbox-include-numbers"
          />
          <span className="dark:text-gray-300">Include Numbers</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-4 h-4 text-cyan-500 rounded"
            data-testid="checkbox-include-symbols"
          />
          <span className="dark:text-gray-300">Include Symbols</span>
        </label>
      </div>

      <Button onClick={generatePassword} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" data-testid="button-generate-password">
        <Shield className="mr-2 h-4 w-4" />
        Generate Password
      </Button>

      {password && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 border border-orange-500/20 dark:border-orange-500/40">
          <span className="font-mono text-lg break-all dark:text-white" data-testid="text-generated-password">{password}</span>
          <Button variant="ghost" size="sm" onClick={copyToClipboard} data-testid="button-copy-password" className="dark:hover:bg-gray-700">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

const trackToolUsage = {
  mutate: (toolName: string) => {
    fetch(`/api/tool-usage/${toolName}`, { method: 'POST' }).catch(console.error);
  }
};

export default function Tools() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HeroSection
        title="🛠️ Tools & Utilities Hub"
        subtitle="Choose your category: Free Fire gaming tools or general utilities"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Main Category Selection */}
        <Tabs defaultValue="fftools" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 dark:bg-gray-800" data-testid="tabs-category">
            <TabsTrigger value="fftools" data-testid="tab-category-ff" className="text-lg py-3">
              <i className="fas fa-fire mr-2"></i>
              Free Fire Tools
            </TabsTrigger>
            <TabsTrigger value="utilities" data-testid="tab-category-utilities" className="text-lg py-3">
              <i className="fas fa-tools mr-2"></i>
              General Utilities
            </TabsTrigger>
          </TabsList>

          {/* FF Tools Category */}
          <TabsContent value="fftools" className="mt-6">
            <Tabs defaultValue="ffname" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 dark:bg-gray-800" data-testid="tabs-fftools">
                <TabsTrigger value="ffname" data-testid="tab-ffname">FF Name Generator</TabsTrigger>
                <TabsTrigger value="uid" data-testid="tab-uid">UID Generator</TabsTrigger>
                <TabsTrigger value="sensitivity" data-testid="tab-sensitivity">Sensitivity Settings</TabsTrigger>
                <TabsTrigger value="password" data-testid="tab-password">Password Generator</TabsTrigger>
              </TabsList>

              <TabsContent value="ffname" className="mt-6">
                <Card className="dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Sparkles className="h-5 w-5 text-cyan-500" />
                      Free Fire Stylish Name Generator
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Create unique, stylish names with fancy fonts and symbols for your Free Fire profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FFNameGenerator />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="uid" className="mt-6">
                <Card className="dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Gamepad2 className="h-5 w-5 text-purple-500" />
                      Random UID Generator
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Generate random Free Fire UIDs for testing and development purposes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UIDGenerator />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sensitivity" className="mt-6">
                <Card className="dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Sparkles className="h-5 w-5 text-green-500" />
                      FF Sensitivity Settings Generator
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Get optimized sensitivity settings based on your playstyle
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SensitivityGenerator />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="password" className="mt-6">
                <Card className="dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Shield className="h-5 w-5 text-orange-500" />
                      Secure Password Generator
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Create strong, random passwords to secure your gaming accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PasswordGenerator />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* General Utilities Category */}
          <TabsContent value="utilities" className="mt-6">
            <div className="text-center py-12">
              <div className="max-w-2xl mx-auto glass rounded-2xl p-8 border-2 border-primary/30">
                <i className="fas fa-tools text-6xl text-primary mb-6 block animate-bounce"></i>
                <h3 className="text-2xl font-bold mb-4 dark:text-white">General Utility Tools</h3>
                <p className="text-muted-foreground mb-6">
                  Explore our collection of productivity tools including Image Compressor, Text-to-Speech, QR Code Generator, and more!
                </p>
                <Link href="/utility-tools">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" data-testid="button-goto-utilities">
                    <span className="flex items-center gap-2">
                      Go to Utility Tools
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
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
