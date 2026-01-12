import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Book, Lock, PenLine, Sparkles, Flame, Sun, CloudRain, 
  Wind, Coffee, ChevronRight, Search, BookOpen 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { PageContainer } from "@/components/layout/PageContainer";

// --- TYPES & INTERFACES ---
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  date: string;
  prompt?: string;
  tags?: string[];
}

interface MoodPrompt {
  mood: string;
  questions: string[];
  icon: React.ElementType;
  color: string;
}

// --- CONFIGURATION ---
const MOOD_PROMPTS: Record<string, MoodPrompt> = {
  Happy: {
    mood: 'Happy',
    questions: ["What went right today?", "Capture this moment of joy.", "Who made you smile?"],
    icon: Sun,
    color: 'text-amber-500 bg-amber-50'
  },
  Sad: {
    mood: 'Sad',
    questions: ["What feels heavy right now?", "Be kind to yourself: write one good thing.", "What do you need?"],
    icon: CloudRain,
    color: 'text-blue-500 bg-blue-50'
  },
  Anxious: {
    mood: 'Anxious',
    questions: ["List 3 things you can control.", "What is the worst that can happen? (Is it likely?)", "Breathe."],
    icon: Wind,
    color: 'text-purple-500 bg-purple-50'
  },
  Calm: {
    mood: 'Calm',
    questions: ["What does peace feel like?", "How can you keep this feeling?", "Observation of the moment."],
    icon: Coffee,
    color: 'text-emerald-500 bg-emerald-50'
  },
  Default: {
    mood: 'Neutral',
    questions: ["What is on your mind?", "Describe your day so far.", "One goal for tomorrow."],
    icon: Book,
    color: 'text-slate-500 bg-slate-50'
  }
};

// --- COMPONENTS ---

// 1. The Entry Card (Reusable)
const EntryCard = ({ entry, onClick, onDelete }: { entry: JournalEntry, onClick: () => void, onDelete: (id: string) => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    onClick={onClick}
    className="group relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer overflow-hidden"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {format(new Date(entry.date), 'MMM dd')}
        </span>
        <span className="text-xs text-slate-300">•</span>
        <span className="text-xs text-slate-400">
          {format(new Date(entry.date), 'h:mm a')}
        </span>
      </div>
      {entry.mood && (
        <span className="px-2 py-1 rounded-md bg-slate-50 text-[10px] font-medium text-slate-500 uppercase tracking-wide">
          {entry.mood}
        </span>
      )}
    </div>
    
    <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
      {entry.title || "Untitled Entry"}
    </h3>
    
    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-serif">
      {entry.content}
    </p>

    {/* Hover Actions */}
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 hover:bg-red-50 hover:text-red-500 rounded-full"
        onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </motion.div>
);

// 2. The Stats Bar
const StatsBar = ({ entries }: { entries: JournalEntry[] }) => {
  const total = entries.length;
  const streak = useMemo(() => {
    if (entries.length === 0) return 0;
    // Simple streak logic placeholder
    return 1; 
  }, [entries]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 flex items-center gap-4 shadow-sm">
        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
          <Book className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-800">{total}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">Entries</div>
        </div>
      </div>
      <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 flex items-center gap-4 shadow-sm">
        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-800">{streak}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const Journal = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // State
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('journalEntries', []);
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  
  // Editor State
  const [editorData, setEditorData] = useState<{title: string, content: string, prompt?: string, mood?: string}>({
    title: '', content: ''
  });
  
  // Derived Data
  const groupedEntries = useMemo(() => {
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries]);

  // --- ACTIONS ---

  const handleCreateNew = (prompt?: string, mood?: string) => {
    setEditorData({
      title: '',
      content: '',
      prompt: prompt,
      mood: mood
    });
    setView('editor');
  };

  const handleSave = () => {
    if (!editorData.content.trim()) {
      toast({ title: "Journal is empty", description: "Write a few words first." });
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: editorData.title || format(new Date(), 'EEEE, MMMM do'),
      content: editorData.content,
      date: new Date().toISOString(),
      mood: editorData.mood,
      prompt: editorData.prompt
    };

    setEntries([newEntry, ...entries]);
    toast({ title: "Saved securely", description: "Your thoughts are encrypted locally." });
    setView('dashboard');
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    toast({ title: "Entry deleted" });
  };

  const handleOpenEntry = (entry: JournalEntry) => {
    setEditorData({
      title: entry.title,
      content: entry.content,
      prompt: entry.prompt,
      mood: entry.mood
    });
    setView('editor');
  };

  // --- RENDERING ---

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-slate-900 font-sans selection:bg-purple-100">
      
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-40 w-full bg-[#FAFAFA]/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-slate-700" />
            <h1 className="font-serif text-xl font-medium">Journal</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Private</span>
            </div>
            
            <Button 
              variant="outline" 
              className="hidden md:flex gap-2 rounded-full border-slate-200 hover:bg-slate-100"
              onClick={() => setLocation('/breakspace')}
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <span>BreakSpace</span>
            </Button>
          </div>
        </div>
      </header>

      <PageContainer className="py-8">
        <AnimatePresence mode="wait">
          
          {/* VIEW: DASHBOARD */}
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* LEFT COLUMN: SIDEBAR & PROMPTS */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* 1. Quick Stats */}
                <StatsBar entries={entries} />

                {/* 2. New Entry CTA */}
                <Button 
                  onClick={() => handleCreateNew()}
                  className="w-full h-14 text-lg rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 transition-all hover:scale-[1.02]"
                >
                  <PenLine className="w-5 h-5 mr-2" /> Write New Entry
                </Button>

                {/* 3. Daily Prompts (Dynamic) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold text-slate-800">Daily Reflection</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {MOOD_PROMPTS.Default.questions.slice(0, 3).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleCreateNew(q, 'Neutral')}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 text-sm text-slate-600 hover:text-purple-600 transition-colors border border-transparent hover:border-slate-100"
                      >
                        "{q}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Mood Check (Quick Start) */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pl-2">Write by Mood</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(MOOD_PROMPTS).slice(0,4).map((m) => (
                      <button
                        key={m.mood}
                        onClick={() => handleCreateNew(m.questions[0], m.mood)}
                        className={`p-3 rounded-xl border border-transparent hover:border-slate-200 transition-all text-left flex items-center gap-3 ${m.color.replace('bg-', 'hover:bg-opacity-80 bg-opacity-50 ')}`}
                      >
                        <m.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{m.mood}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: ENTRIES LIST */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between pl-2">
                  <h2 className="text-xl font-serif text-slate-800">Recent Memories</h2>
                  <div className="text-sm text-slate-400">
                    Sort by <span className="font-medium text-slate-600">Date</span>
                  </div>
                </div>

                {entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-700 mb-1">Your journal is empty</h3>
                    <p className="text-slate-400 max-w-xs mx-auto">
                      Today is a great day to start. Capture a thought, a feeling, or a moment.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {groupedEntries.map((entry) => (
                      <EntryCard 
                        key={entry.id} 
                        entry={entry} 
                        onClick={() => handleOpenEntry(entry)}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* VIEW: EDITOR */}
          {view === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-3xl mx-auto"
            >
              {/* Editor Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => setView('dashboard')} className="gap-2 pl-0 hover:bg-transparent hover:text-slate-600">
                  <ChevronRight className="w-4 h-4 rotate-180" /> Back
                </Button>
                <div className="text-xs font-mono text-slate-300">
                  {editorData.content.length} chars
                </div>
              </div>

              {/* THE REAL PAGE (Paper Surface) */}
              <div className="bg-[#FDFBF7] min-h-[75vh] rounded-[2px] md:rounded-[4px] shadow-2xl shadow-slate-300/60 p-8 md:p-12 relative overflow-hidden border border-stone-200/60">
                
                {/* 1. Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

                {/* 2. Margin Line (Classic Notebook Style) */}
                <div className="absolute left-10 md:left-16 top-0 bottom-0 w-px bg-red-200/40 pointer-events-none z-0" />

                {/* Content Container */}
                <div className="relative z-10 pl-6 md:pl-12 h-full flex flex-col">
                  
                  {/* Prompt Banner */}
                  {editorData.prompt && (
                    <div className="mb-8 p-4 bg-purple-50/50 rounded-lg border border-purple-100 flex gap-3 items-start backdrop-blur-sm -ml-2">
                      <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Prompt</div>
                        <p className="text-purple-900 font-medium">{editorData.prompt}</p>
                      </div>
                    </div>
                  )}

                  {/* Title Input */}
                  <Input
                    value={editorData.title}
                    onChange={(e) => setEditorData({...editorData, title: e.target.value})}
                    placeholder="Title your entry..."
                    className="text-3xl md:text-4xl font-serif font-medium border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-slate-300/50 mb-6 bg-transparent"
                  />

                  {/* Main Content (Ruled Lines Effect) */}
                  <Textarea
                    autoFocus
                    value={editorData.content}
                    onChange={(e) => setEditorData({...editorData, content: e.target.value})}
                    placeholder="Start writing here..."
                    className="flex-1 w-full resize-none border-none p-0 text-lg md:text-xl text-slate-700 font-serif placeholder:text-slate-300/50 focus-visible:ring-0 bg-transparent leading-[2.5rem]"
                    style={{
                      // Creating the ruled lines visually
                      backgroundImage: 'linear-gradient(transparent 95%, #e2e8f0 95%)',
                      backgroundSize: '100% 2.5rem',
                      lineHeight: '2.5rem',
                      backgroundAttachment: 'local'
                    }}
                  />

                  {/* Footer Action */}
                  <div className="flex justify-end pt-8 mt-auto">
                    <Button 
                      size="lg" 
                      onClick={handleSave}
                      className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      Save Entry
                    </Button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </PageContainer>
    </div>
  );
};

export default Journal;