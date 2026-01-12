import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, X, ShieldCheck, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useInspiration } from '@/context/InspirationContext';
import { useToast } from '@/hooks/use-toast';

export const ComposeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { submitStory } = useInspiration();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({ title: '', content: '', author: '' });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) return;
    setIsSubmitting(true);
    
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    submitStory({
      ...formData,
      author: isAnonymous ? 'Anonymous' : (formData.author || 'Anonymous')
    });
    
    toast({ title: "Story submitted", description: "Thank you for sharing your light. It will be reviewed shortly." });
    
    // Reset & Close
    setFormData({ title: '', content: '', author: '' });
    setIsAnonymous(false);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-6">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-purple-500" />
                  Share Your Journey
                </h2>
                <p className="text-sm text-slate-400 mt-1">Your words could be the light someone needs.</p>
              </div>
              <Button size="icon" variant="ghost" onClick={onClose} className="rounded-full hover:bg-slate-50">
                <X className="w-5 h-5 text-slate-400" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Trust Badge */}
              <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 flex gap-3">
                <div className="p-2 bg-white rounded-full shadow-sm h-fit">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wide mb-1">Safe Space</h4>
                  <p className="text-xs text-purple-700/80 leading-relaxed">
                    Stories are reviewed to ensure this remains a safe, supportive environment. 
                    Hate speech or trauma dumping without trigger warnings may not be approved.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block ml-1">Title</label>
                  <Input 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Give your story a name..."
                    className="bg-slate-50 border-slate-200 h-14 text-lg rounded-2xl focus-visible:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block ml-1">Your Story</label>
                  <Textarea 
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    placeholder="Share a moment of resilience, hope, or clarity..."
                    className="bg-slate-50 border-slate-200 min-h-[240px] resize-none text-base leading-relaxed rounded-2xl p-4 focus-visible:ring-purple-500/20"
                  />
                </div>

                {/* Author / Anonymous Toggle */}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex-1 mr-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">Signed As</label>
                    <Input 
                      value={isAnonymous ? "Anonymous" : formData.author}
                      onChange={e => setFormData({...formData, author: e.target.value})}
                      disabled={isAnonymous}
                      placeholder="Your Name (Optional)"
                      className="bg-white border-slate-200 h-10 text-sm rounded-xl focus-visible:ring-purple-500/20 disabled:opacity-60 disabled:bg-slate-100"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-5">
                    <label htmlFor="anon-toggle" className="text-sm font-medium text-slate-600 cursor-pointer select-none">
                      Go Anonymous
                    </label>
                    <input 
                      id="anon-toggle"
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <Button 
                className="w-full h-14 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 text-lg font-medium gap-2 transition-all hover:scale-[1.01]"
                onClick={handleSubmit}
                disabled={!formData.title || !formData.content || isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Submit Story
                  </>
                )}
              </Button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};