import React, { useState } from 'react';
import { Download, Upload, Trash2, Database, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const DataSection = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      const appData: Record<string, any> = {};
      Object.keys(localStorage).forEach(key => {
        if (key.includes('calm') || key.includes('journal') || key.includes('chat')) {
          appData[key] = localStorage.getItem(key);
        }
      });
      appData['exportDate'] = new Date().toISOString();

      const blob = new Blob([JSON.stringify(appData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `calmspace-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: 'Backup Complete', description: 'Your data is safe.' });
    } catch (e) {
      toast({ title: 'Export Failed', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);

          Object.keys(data).forEach(key => {
            if (key !== 'exportDate') localStorage.setItem(key, data[key]);
          });

          toast({ title: 'Import Successful', description: 'Reloading app...' });
          setTimeout(() => window.location.reload(), 1500);
        } catch {
          toast({ title: 'Invalid File', variant: 'destructive' });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleNuke = () => {
    if (
      confirm(
        '⚠️ DESTROY ALL DATA?\n\nThis is irreversible. Your journal, mood history, and settings will be wiped.'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Storage */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="w-5 h-5 text-blue-500" />
            Storage Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-200"
            >
              <Download className="w-6 h-6 text-blue-600" />
              <div className="text-center">
                <div className="font-semibold text-slate-700">Export Data</div>
                <div className="text-xs text-slate-400">Download JSON Backup</div>
              </div>
            </Button>

            <Button
              onClick={handleImport}
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-200"
            >
              <Upload className="w-6 h-6 text-emerald-600" />
              <div className="text-center">
                <div className="font-semibold text-slate-700">Import Data</div>
                <div className="text-xs text-slate-400">Restore from Backup</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-red-900">Factory Reset</h4>
              <p className="text-sm text-red-700 max-w-sm">
                Wipe all local data. This cannot be undone.
              </p>
            </div>

            {/* 🔴 HIGH-CONTRAST RESET BUTTON */}
            <Button
              onClick={handleNuke}
              className="
                bg-red-600 text-white
                hover:bg-red-700
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              "
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Everything
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
