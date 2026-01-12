import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Flame, Waves, Wind, Package, Circle, 
  ArrowLeft, Sparkles, RefreshCw, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { PageContainer } from "@/components/layout/PageContainer";

// --- TYPES ---
type ReleaseType = 'burn' | 'wash' | 'float' | 'blow' | 'box';

interface ReleaseOption {
  id: ReleaseType;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  particleColor: string;
}

// --- CONFIGURATION ---
const RELEASE_OPTIONS: ReleaseOption[] = [
  {
    id: 'burn',
    icon: Flame,
    label: 'Incinerate',
    description: 'Watch your words turn to ash and vanish.',
    color: 'bg-orange-500',
    particleColor: '#f97316'
  },
  {
    id: 'wash',
    icon: Waves,
    label: 'Wash Away',
    description: 'Let the water dilute and carry the weight.',
    color: 'bg-blue-500',
    particleColor: '#3b82f6'
  },
  {
    id: 'float',
    icon: Circle,
    label: 'Release Balloon',
    description: 'Attach to a balloon and watch it disappear.',
    color: 'bg-pink-500',
    particleColor: '#ec4899'
  },
  {
    id: 'blow',
    icon: Wind,
    label: 'Scatter',
    description: 'Let the wind sweep the dust away.',
    color: 'bg-slate-500',
    particleColor: '#94a3b8'
  },
  {
    id: 'box',
    icon: Package,
    label: 'Archive',
    description: 'Pack it away deep in the void.',
    color: 'bg-amber-600',
    particleColor: '#d97706'
  }
];

const AFFIRMATIONS = [
  "It is gone. You remain.",
  "Heavier things have passed. This will too.",
  "You are not your thoughts. You are the observer.",
  "Space has been made for something better.",
  "The grip is loosened.",
  "Breathe into the empty space."
];

// --- PARTICLE COMPONENT ---
const ParticleSystem = ({ type, active }: { type: ReleaseType, active: boolean }) => {
  if (!active) return null;
  
  // Create 20 particles
  const particles = Array.from({ length: 20 });
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            x: 0, 
            y: 0, 
            scale: 0 
          }}
          animate={
            type === 'burn' ? { 
              opacity: [0, 1, 0], 
              y: -400, 
              x: (Math.random() - 0.5) * 200, 
              scale: [0, Math.random() * 2, 0],
              rotate: Math.random() * 360
            } : 
            type === 'wash' ? {
              opacity: [0, 0.5, 0],
              y: 200,
              x: (Math.random() - 0.5) * 50,
              scaleY: [1, 2, 1]
            } : 
            { opacity: 0 }
          }
          transition={{ 
            duration: 2 + Math.random(), 
            delay: Math.random() * 0.5, 
            repeat: type === 'burn' ? Infinity : 0 
          }}
          className={`absolute left-1/2 top-1/2 w-2 h-2 rounded-full ${
             type === 'burn' ? 'bg-orange-500/50 blur-[2px]' : 'bg-blue-400/50 blur-[1px]'
          }`}
        />
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
const BreakSpace = () => {
  const [, setLocation] = useLocation();
  const [text, setText] = useState('');
  const [stage, setStage] = useState<'write' | 'select' | 'processing' | 'finished'>('write');
  const [selectedMethod, setSelectedMethod] = useState<ReleaseOption | null>(null);
  const [affirmation, setAffirmation] = useState('');

  // Animation Controls
  const containerControls = useAnimation();

  // Reset Flow
  const handleReset = () => {
    setText('');
    setStage('write');
    setSelectedMethod(null);
  };

  // Trigger Release
  const handleRelease = async () => {
    if (!selectedMethod) return;
    setStage('processing');

    // 1. Dynamic Background Shift based on Method
    await containerControls.start({
      backgroundColor: 
        selectedMethod.id === 'burn' ? '#1c1917' : 
        selectedMethod.id === 'wash' ? '#ecfeff' : '#f8fafc',
      transition: { duration: 1 }
    });

    // 2. Wait for "Destruction" Animation
    await new Promise(resolve => setTimeout(resolve, 4500));

    // 3. Show Affirmation
    setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
    setStage('finished');
    
    // Reset Background
    containerControls.start({ backgroundColor: '#f8fafc', transition: { duration: 2 } });
  };

  // --- RENDER HELPERS ---
  
  // The Text Destruction Animation Logic
  const getDestructionVariants = (method: ReleaseType) => {
    switch(method) {
      case 'burn':
        return {
          animate: {
            color: ['#1f2937', '#b45309', '#7f1d1d', '#000000'],
            opacity: [1, 0.8, 0],
            scale: [1, 1.05, 0.9],
            filter: ['blur(0px)', 'blur(2px)', 'blur(8px)'],
            y: -50,
            transition: { duration: 4, ease: "easeInOut" }
          }
        };
      case 'wash':
        return {
          animate: {
            opacity: [1, 0.5, 0],
            y: [0, 50, 150],
            filter: ['blur(0px)', 'blur(4px)', 'blur(20px)'],
            transformOrigin: 'top',
            scaleY: [1, 1.2, 1.5],
            transition: { duration: 3, ease: "easeIn" }
          }
        };
      case 'float':
        return {
          animate: {
            y: -600,
            opacity: [1, 0.8, 0],
            x: [0, 20, -20, 0],
            scale: 0.5,
            transition: { duration: 5, ease: "easeIn" }
          }
        };
      case 'box':
        return {
          animate: {
            scale: [1, 0.1],
            rotate: [0, 90],
            opacity: [1, 0],
            transition: { duration: 2, ease: "backIn" }
          }
        };
      default: // blow
        return {
          animate: {
            x: 500,
            opacity: 0,
            rotate: 45,
            filter: 'blur(10px)',
            transition: { duration: 2, ease: "easeIn" }
          }
        };
    }
  };

  return (
    <motion.div 
      animate={containerControls}
      className="min-h-screen w-full flex flex-col relative overflow-hidden bg-slate-50 text-slate-900 transition-colors"
    >
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-[0.03] pointer-events-none" />
      
      <PageContainer className="flex-1 flex flex-col z-10">
        {/* HEADER */}
        <div className="relative z-50 py-6 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/journal')}
            className="hover:bg-white/50 rounded-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Return
          </Button>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/40 backdrop-blur-md rounded-full border border-white/20">
            <Flame className="w-3 h-3 text-orange-500" />
            <span className="text-xs font-medium uppercase tracking-widest text-slate-600">BreakSpace Simulation</span>
          </div>
        </div>

        {/* CENTER STAGE */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <AnimatePresence mode="wait">
            
            {/* PHASE 1: UNLOADING (Writing) */}
            {stage === 'write' && (
              <motion.div
                key="write"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-2xl space-y-8"
              >
                <div className="text-center space-y-2">
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-light tracking-tight text-slate-900"
                  >
                    Unburden Your Mind
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-slate-500 font-light"
                  >
                    Write whatever weighs on you. No one will ever see this.
                  </motion.p>
                </div>

                <motion.div 
                  className="relative group"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-1">
                    <Textarea
                      autoFocus
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type freely..."
                      className="min-h-[350px] p-8 text-xl md:text-2xl leading-relaxed border-none bg-transparent resize-none focus:ring-0 placeholder:text-slate-300 font-serif text-slate-700 selection:bg-purple-100"
                      spellCheck={false}
                    />
                    
                    {/* Character Count / Status */}
                    <div className="absolute bottom-4 right-6 text-xs text-slate-300 font-mono">
                      {text.length} chars • Unsaved • Ephemeral
                    </div>
                  </div>
                </motion.div>

                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={() => setStage('select')}
                    disabled={!text.trim()}
                    className="rounded-full h-16 px-10 text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
                  >
                    I am ready to let go
                  </Button>
                </div>
              </motion.div>
            )}

            {/* PHASE 2: THE RITUAL SELECTION */}
            {stage === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-4xl"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-light mb-4">Choose your release ritual</h2>
                  <p className="text-slate-500">How do you want to destroy this thought?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {RELEASE_OPTIONS.map((opt, i) => (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => { setSelectedMethod(opt); handleRelease(); }}
                      className="group relative flex flex-col items-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${opt.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <opt.icon size={28} />
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-2">{opt.label}</h3>
                      <p className="text-xs text-center text-slate-500 leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
                        {opt.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
                
                <div className="flex justify-center mt-12">
                  <Button variant="ghost" onClick={() => setStage('write')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </div>
              </motion.div>
            )}

            {/* PHASE 3: THE VISCERAL RELEASE (Animation) */}
            {stage === 'processing' && selectedMethod && (
              <motion.div
                key="processing"
                className="relative w-full max-w-2xl min-h-[500px] flex items-center justify-center"
              >
                {/* Particle System Layer */}
                <ParticleSystem type={selectedMethod.id} active={true} />

                {/* The Text Being Destroyed */}
                <motion.div
                  variants={getDestructionVariants(selectedMethod.id)}
                  animate="animate"
                  className="relative z-10 text-center font-serif text-2xl md:text-3xl leading-relaxed text-slate-800 whitespace-pre-wrap px-8"
                >
                  {text}
                </motion.div>
                
                {/* Optional "Sound" Visualizer or Progress */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="absolute bottom-10 text-sm font-medium tracking-[0.2em] uppercase text-slate-400/50"
                >
                  Releasing...
                </motion.div>
              </motion.div>
            )}

            {/* PHASE 4: THE AFTERMATH (Peace) */}
            {stage === 'finished' && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="text-center space-y-8 max-w-md"
              >
                <div className="inline-flex p-6 rounded-full bg-emerald-50 text-emerald-500 mb-2 shadow-inner">
                  <Sparkles size={48} className="animate-pulse" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl font-light text-slate-800">Gone.</h2>
                  <div className="h-px w-24 bg-slate-200 mx-auto" />
                  <p className="text-xl font-serif italic text-slate-600 leading-relaxed">
                    "{affirmation}"
                  </p>
                </div>

                <div className="pt-8">
                  <Button 
                    onClick={handleReset} 
                    className="rounded-full px-8 py-6 bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Begin Again
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </PageContainer>
    </motion.div>
  );
};

export default BreakSpace;