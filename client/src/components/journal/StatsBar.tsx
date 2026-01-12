import React, { useMemo } from 'react';
import { Book, Flame } from 'lucide-react';
import { JournalEntry } from './EntryCard';

export const StatsBar = ({ entries }: { entries: JournalEntry[] }) => {
  const total = entries.length;
  
  const streak = useMemo(() => {
    if (entries.length === 0) return 0;
    // Basic streak logic (In production, use differenceInDays)
    const today = new Date().toDateString();
    const lastEntry = new Date(entries[0].date).toDateString();
    return today === lastEntry ? 1 : 0; 
  }, [entries]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {/* Total Entries Card */}
      <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
          <Book className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight">{total}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entries</div>
        </div>
      </div>

      {/* Streak Card */}
      <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 shadow-inner">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight">{streak}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Day Streak</div>
        </div>
      </div>
    </div>
  );
};