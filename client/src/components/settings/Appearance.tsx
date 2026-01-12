import React, { useEffect } from 'react';
import { Moon, Sun, Monitor, Type, Eye, Zap, Palette } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
}

export const Appearance = () => {
  const [settings, setSettings] = useLocalStorage<AppearanceSettings>('calm_appearance', {
    theme: 'auto',
    fontSize: 'medium',
    reducedMotion: false,
    highContrast: false,
  });

  // Apply Side Effects
  useEffect(() => {
    // Theme logic usually handled by a ThemeProvider, but we simulate here
    const root = document.documentElement;
    
    if (settings.theme === 'dark') root.classList.add('dark');
    else if (settings.theme === 'light') root.classList.remove('dark');
    
    if (settings.reducedMotion) root.style.setProperty('--animation-duration', '0s');
    else root.style.removeProperty('--animation-duration');

    if (settings.highContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');

    const sizes = { small: '14px', medium: '16px', large: '18px' };
    root.style.fontSize = sizes[settings.fontSize];
  }, [settings]);

  const update = (key: keyof AppearanceSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5 text-purple-500" />
            Visual Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-medium text-slate-900">App Theme</label>
              <p className="text-sm text-slate-500">Select your preferred lighting mode</p>
            </div>
            <Select value={settings.theme} onValueChange={(v) => update('theme', v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light"><div className="flex items-center gap-2"><Sun className="w-4 h-4"/> Light</div></SelectItem>
                <SelectItem value="dark"><div className="flex items-center gap-2"><Moon className="w-4 h-4"/> Dark</div></SelectItem>
                <SelectItem value="auto"><div className="flex items-center gap-2"><Monitor className="w-4 h-4"/> Auto</div></SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-medium text-slate-900">Font Size</label>
              <p className="text-sm text-slate-500">Adjust text size for readability</p>
            </div>
            <Select value={settings.fontSize} onValueChange={(v) => update('fontSize', v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small"><div className="flex items-center gap-2"><Type className="w-3 h-3"/> Small</div></SelectItem>
                <SelectItem value="medium"><div className="flex items-center gap-2"><Type className="w-4 h-4"/> Medium</div></SelectItem>
                <SelectItem value="large"><div className="flex items-center gap-2"><Type className="w-5 h-5"/> Large</div></SelectItem>
              </SelectContent>
            </Select>
          </div>

        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="w-5 h-5 text-blue-500" />
            Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-medium text-slate-900">Reduced Motion</label>
              <p className="text-sm text-slate-500">Disable parallax and heavy animations</p>
            </div>
            <Switch checked={settings.reducedMotion} onCheckedChange={(c) => update('reducedMotion', c)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-medium text-slate-900">High Contrast</label>
              <p className="text-sm text-slate-500">Increase contrast for better visibility</p>
            </div>
            <Switch checked={settings.highContrast} onCheckedChange={(c) => update('highContrast', c)} />
          </div>

        </CardContent>
      </Card>
    </div>
  );
};