import React from 'react';
import { Info, ShieldCheck, Heart, ExternalLink, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const About = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* Brand Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
        
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-white/50">
            <span className="text-3xl">🌿</span>
          </div>
          
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">CalmSpace</h2>
            <p className="text-slate-500 font-medium">v1.2.0 (Stable)</p>
          </div>

          <div className="flex justify-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Offline
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Encrypted
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Mission */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-pink-500" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 leading-relaxed text-sm">
            CalmSpace was built on a simple promise: <strong>Your mind is not a product.</strong>
            <br /><br />
            In a world of tracking pixels and data mining, we created a sanctuary that exists entirely on your device. 
            We believe mental health tools should be private, accessible, and safe by default.
          </p>
        </CardContent>
      </Card>

      {/* Links */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="w-5 h-5 text-slate-500" />
            Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Button variant="ghost" className="justify-between w-full h-12 hover:bg-slate-50 text-slate-600">
            <span>Privacy Policy</span>
            <ExternalLink className="w-4 h-4 opacity-50" />
          </Button>
          <Button variant="ghost" className="justify-between w-full h-12 hover:bg-slate-50 text-slate-600">
            <span>Terms of Service</span>
            <ExternalLink className="w-4 h-4 opacity-50" />
          </Button>
          <Button variant="ghost" className="justify-between w-full h-12 hover:bg-slate-50 text-slate-600">
            <span>Open Source Licenses</span>
            <ExternalLink className="w-4 h-4 opacity-50" />
          </Button>
          <div className="h-px bg-slate-100 my-1" />
          <Button variant="ghost" className="justify-between w-full h-12 hover:bg-slate-50 text-slate-600">
            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Contact Support</span>
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 pt-4">
        <p>&copy; {currentYear} CalmSpace Labs. All rights reserved.</p>
        <p className="mt-1">Made with care for the human mind.</p>
      </div>
    </div>
  );
};