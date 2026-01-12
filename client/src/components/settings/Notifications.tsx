import React from 'react';
import { Bell, Moon, BookOpen, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const Notifications = () => {
  const [settings, setSettings] = useLocalStorage('calm_notifications', {
    moodCheck: true,
    journal: false,
    relax: false
  });

  const update = (key: string, val: boolean) => setSettings(prev => ({ ...prev, [key]: val }));

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="w-5 h-5 text-amber-500" />
          Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg"><Sun className="w-4 h-4 text-amber-600" /></div>
            <div>
              <p className="font-medium text-slate-900">Daily Mood Check</p>
              <p className="text-xs text-slate-500">Morning check-in</p>
            </div>
          </div>
          <Switch checked={settings.moodCheck} onCheckedChange={(c) => update('moodCheck', c)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg"><BookOpen className="w-4 h-4 text-purple-600" /></div>
            <div>
              <p className="font-medium text-slate-900">Journal Prompt</p>
              <p className="text-xs text-slate-500">Evening reflection</p>
            </div>
          </div>
          <Switch checked={settings.journal} onCheckedChange={(c) => update('journal', c)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg"><Moon className="w-4 h-4 text-blue-600" /></div>
            <div>
              <p className="font-medium text-slate-900">Wind Down</p>
              <p className="text-xs text-slate-500">Bedtime relaxation</p>
            </div>
          </div>
          <Switch checked={settings.relax} onCheckedChange={(c) => update('relax', c)} />
        </div>
      </CardContent>
    </Card>
  );
};