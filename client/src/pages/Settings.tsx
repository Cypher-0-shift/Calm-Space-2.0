import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, Shield, Database, 
  Palette, Info, Bell, ChevronRight 
} from 'lucide-react';

// Components
import { DataSection } from '@/components/settings/DataSection';
import { PrivacySection } from '@/components/settings/PrivacySection';
import { Appearance } from '@/components/settings/Appearance';
import { Notifications } from '@/components/settings/Notifications';
import { About } from '@/components/settings/About'; // Simple component defined below if missing
import { PageContainer } from "@/components/layout/PageContainer";

// Fallback About if file not created
const AboutSection = () => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4">
    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
      <Info className="w-8 h-8 text-white" />
    </div>
    <div>
      <h3 className="text-xl font-bold text-slate-900">CalmSpace</h3>
      <p className="text-slate-500">v1.2.0 (Stable)</p>
    </div>
    <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 leading-relaxed border border-slate-100">
      Built with privacy at its core. No tracking, no clouds, just peace.
      <br/> All data stays on this device.
    </div>
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('appearance');

  const menuItems = [
    { id: 'appearance', label: 'Look & Feel', icon: Palette, color: 'text-purple-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-amber-500' },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield, color: 'text-emerald-500' },
    { id: 'data', label: 'Data & Storage', icon: Database, color: 'text-blue-500' },
    { id: 'about', label: 'About', icon: Info, color: 'text-slate-500' },
  ];

  return (
    <PageContainer>
      <div className="pb-20 pt-4">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-8 rounded-3xl shadow-sm mb-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-slate-400" />
              Settings
            </h1>
            <p className="text-slate-500 mt-2">Manage your preferences and control your data.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 grid md:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="md:col-span-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-white shadow-md text-slate-900 font-medium ring-1 ring-slate-200' 
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-50 ${activeTab === item.id ? 'bg-opacity-100' : 'bg-opacity-50'}`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  {item.label}
                </div>
                {activeTab === item.id && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="md:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'appearance' && <Appearance />}
                {activeTab === 'notifications' && <Notifications />}
                {activeTab === 'privacy' && <PrivacySection />}
                {activeTab === 'data' && <DataSection />}
                {activeTab === 'about' && <AboutSection />}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;