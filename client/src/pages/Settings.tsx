import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMoodTheme } from '@/hooks/useMoodTheme';
import { useToast } from '@/hooks/use-toast';

interface Settings {
  theme: 'light' | 'dark' | 'auto';
  aiMemory: boolean;
  localStorageOnly: boolean;
  notifications: {
    dailyMoodCheck: boolean;
    relaxationReminders: boolean;
    journalReminders: boolean;
  };
  privacy: {
    shareUsageData: boolean;
    enableAnalytics: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

const Settings = () => {
  const [settings, setSettings] = useLocalStorage<Settings>('appSettings', {
    theme: 'light',
    aiMemory: true,
    localStorageOnly: true,
    notifications: {
      dailyMoodCheck: true,
      relaxationReminders: false,
      journalReminders: false,
    },
    privacy: {
      shareUsageData: false,
      enableAnalytics: false,
    },
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
    },
  });

  const [exportData, setExportData] = useState<string>('');
  const { setMood } = useMoodTheme();
  const { toast } = useToast();

  useEffect(() => {
    // Apply theme changes
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply accessibility settings
    if (settings.accessibility.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }

    if (settings.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply font size
    const fontSizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = fontSizes[settings.accessibility.fontSize];

  }, [settings]);

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current: any = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setSettings(newSettings);
    toast({ title: "Setting updated successfully" });
  };

  const exportUserData = () => {
    const userData = {
      settings,
      userProfile: localStorage.getItem('userProfile'),
      journalEntries: localStorage.getItem('journalEntries'),
      favorites: localStorage.getItem('favorites'),
      playlists: localStorage.getItem('playlists'),
      chatHistory: localStorage.getItem('chatHistory'),
      creativeWorks: localStorage.getItem('creativeWorks'),
      currentMood: localStorage.getItem('currentMood'),
      favoriteQuotes: localStorage.getItem('favoriteQuotes'),
      memoryGameHighScores: localStorage.getItem('memoryGameHighScores'),
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(userData, null, 2);
    setExportData(dataStr);
    
    // Create download link
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calm-space-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Data exported successfully", description: "Your data has been downloaded as a JSON file" });
  };

  const importUserData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            
            // Restore settings
            if (data.settings) setSettings(data.settings);
            
            // Restore other data
            Object.entries(data).forEach(([key, value]) => {
              if (key !== 'settings' && key !== 'exportDate' && value) {
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
              }
            });
            
            toast({ title: "Data imported successfully", description: "Your data has been restored. Please refresh the page." });
          } catch (error) {
            toast({ title: "Import failed", description: "Invalid file format", variant: "destructive" });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Clear all app data
      const keysToKeep = ['appSettings']; // Keep settings
      Object.keys(localStorage).forEach(key => {
        if (!keysToKeep.includes(key) && !key.startsWith('vite')) {
          localStorage.removeItem(key);
        }
      });
      
      toast({ title: "All data cleared", description: "Your data has been permanently deleted" });
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset all settings to default values?')) {
      setSettings({
        theme: 'light',
        aiMemory: true,
        localStorageOnly: true,
        notifications: {
          dailyMoodCheck: true,
          relaxationReminders: false,
          journalReminders: false,
        },
        privacy: {
          shareUsageData: false,
          enableAnalytics: false,
        },
        accessibility: {
          reducedMotion: false,
          highContrast: false,
          fontSize: 'medium',
        },
      });
      toast({ title: "Settings reset to defaults" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ⚙️ Settings & Privacy
        </h1>
        <p className="text-lg text-gray-600">
          Customize your Calm Space experience and manage your privacy
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="text-2xl">🎨</div>
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Theme
              </label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">🌞 Light</SelectItem>
                  <SelectItem value="dark">🌙 Dark</SelectItem>
                  <SelectItem value="auto">🔄 Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Font Size
              </label>
              <Select 
                value={settings.accessibility.fontSize} 
                onValueChange={(value) => updateSetting('accessibility.fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Reduced Motion</div>
                <div className="text-sm text-gray-600">Minimize animations</div>
              </div>
              <Switch
                checked={settings.accessibility.reducedMotion}
                onCheckedChange={(checked) => updateSetting('accessibility.reducedMotion', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">High Contrast</div>
                <div className="text-sm text-gray-600">Improve text readability</div>
              </div>
              <Switch
                checked={settings.accessibility.highContrast}
                onCheckedChange={(checked) => updateSetting('accessibility.highContrast', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="text-2xl">🔒</div>
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">AI Memory</div>
                <div className="text-sm text-gray-600">Remember conversation context</div>
              </div>
              <Switch
                checked={settings.aiMemory}
                onCheckedChange={(checked) => updateSetting('aiMemory', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Local Storage Only</div>
                <div className="text-sm text-gray-600">Keep all data on your device</div>
              </div>
              <Switch
                checked={settings.localStorageOnly}
                onCheckedChange={(checked) => updateSetting('localStorageOnly', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Share Usage Data</div>
                <div className="text-sm text-gray-600">Help improve the app</div>
              </div>
              <Switch
                checked={settings.privacy.shareUsageData}
                onCheckedChange={(checked) => updateSetting('privacy.shareUsageData', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Analytics</div>
                <div className="text-sm text-gray-600">Anonymous usage tracking</div>
              </div>
              <Switch
                checked={settings.privacy.enableAnalytics}
                onCheckedChange={(checked) => updateSetting('privacy.enableAnalytics', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="text-2xl">🔔</div>
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Daily Mood Check</div>
                <div className="text-sm text-gray-600">Reminder to log your mood</div>
              </div>
              <Switch
                checked={settings.notifications.dailyMoodCheck}
                onCheckedChange={(checked) => updateSetting('notifications.dailyMoodCheck', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Relaxation Reminders</div>
                <div className="text-sm text-gray-600">Scheduled mindfulness breaks</div>
              </div>
              <Switch
                checked={settings.notifications.relaxationReminders}
                onCheckedChange={(checked) => updateSetting('notifications.relaxationReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Journal Reminders</div>
                <div className="text-sm text-gray-600">Prompts to write in your journal</div>
              </div>
              <Switch
                checked={settings.notifications.journalReminders}
                onCheckedChange={(checked) => updateSetting('notifications.journalReminders', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="text-2xl">💾</div>
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={exportUserData} className="w-full" variant="outline">
              📤 Export Your Data
            </Button>
            
            <Button onClick={importUserData} className="w-full" variant="outline">
              📥 Import Data
            </Button>
            
            <Button onClick={resetToDefaults} className="w-full" variant="outline">
              🔄 Reset Settings
            </Button>
            
            <Button 
              onClick={clearAllData} 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              🗑️ Clear All Data
            </Button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="text-yellow-600">⚠️</div>
                <div className="text-sm text-yellow-800">
                  <strong>Data Protection:</strong> Your data is stored locally on your device. 
                  Export regularly to back up your information.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Information */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="text-2xl">ℹ️</div>
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Version</h4>
              <p className="text-gray-600">Calm Space v1.0.0</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Privacy</h4>
              <p className="text-gray-600">Your data never leaves your device</p>
            </div>
            <div>
              <h4 className="font-semibant text-gray-800 mb-2">Support</h4>
              <p className="text-gray-600">help@calmspace.app</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Privacy Commitment</h4>
            <p className="text-sm text-blue-700">
              Calm Space is designed with privacy at its core. All your personal data, including journal entries, 
              mood tracking, and conversations, are stored locally on your device. We don't collect, store, or 
              share your personal information with third parties.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
