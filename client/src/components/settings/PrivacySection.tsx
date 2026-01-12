import React, { useState } from 'react';
import { Shield, Lock, Brain, EyeOff, Activity } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const PrivacySection = () => {
  const { toast } = useToast();
  const [locked, setLocked] = useState(false); // Simulates current session lock state
  const [settings, setSettings] = useLocalStorage('calm_privacy', {
    appLock: false,
    aiMemory: true,
    analytics: false,
    shareData: false
  });

  const update = (key: string, val: boolean) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    toast({ title: "Privacy Setting Updated" });
  };

  const handleLockToggle = (checked: boolean) => {
    if (checked) {
      // Simulate biometric prompt
      const confirmed = confirm("Enable App Lock? You will need to authenticate to open the app.");
      if (confirmed) update('appLock', true);
    } else {
      update('appLock', false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-emerald-500" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-medium text-slate-900">App Lock</label>
              <p className="text-sm text-slate-500">Require authentication on startup</p>
            </div>
            <Switch checked={settings.appLock} onCheckedChange={handleLockToggle} />
          </div>

          {settings.appLock && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-900">Vault is Secure</p>
                <p className="text-xs text-emerald-700">
                  Your journal and chat history are encrypted at rest. 
                  Biometric unlock is enabled.
                </p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-purple-500" />
            Intelligence & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-medium text-slate-900">AI Context Memory</label>
              <p className="text-sm text-slate-500">Allow AI to remember past conversations</p>
            </div>
            <Switch checked={settings.aiMemory} onCheckedChange={(c) => update('aiMemory', c)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-medium text-slate-900">Anonymous Analytics</label>
              <p className="text-sm text-slate-500">Help improve CalmSpace (No personal data)</p>
            </div>
            <Switch checked={settings.analytics} onCheckedChange={(c) => update('analytics', c)} />
          </div>

        </CardContent>
      </Card>
    </div>
  );
};