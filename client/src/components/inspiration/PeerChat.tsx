import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Loader2, ShieldCheck, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Mock messages for simulation
const INCOMING_MESSAGES = [
  "Hi there. I'm also here for some peace.",
  "It's been a tough week, honestly.",
  "I really liked that story about the rocket scientist.",
  "Thanks for listening. It helps to just type it out."
];

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'peer';
  timestamp: Date;
}

export const PeerChat = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<'idle' | 'searching' | 'connected'>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulation: Finding a Peer
  const startSearch = () => {
    setStatus('searching');
    setTimeout(() => {
      setStatus('connected');
      toast({ title: "Connected", description: "You are now chatting anonymously." });
      // Simulate first message
      setTimeout(() => {
        addMessage("Hello. I'm connected from London. Just looking for some calm.", 'peer');
      }, 1500);
    }, 3000);
  };

  const disconnect = () => {
    setStatus('idle');
    setMessages([]);
    toast({ title: "Disconnected", description: "Chat session ended." });
  };

  const addMessage = (text: string, sender: 'me' | 'peer') => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    }]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    addMessage(input, 'me');
    setInput('');

    // Simulate random reply
    if (Math.random() > 0.5) {
      setTimeout(() => {
        addMessage(INCOMING_MESSAGES[Math.floor(Math.random() * INCOMING_MESSAGES.length)], 'peer');
      }, 2000 + Math.random() * 2000);
    }
  };

  return (
    <div className="h-[600px] w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col">
      
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
          <div>
            <h3 className="font-semibold text-slate-800">Peer Connection</h3>
            <p className="text-xs text-slate-500">
              {status === 'idle' ? 'Offline' : status === 'searching' ? 'Looking for a peer...' : 'Anonymous Peer'}
            </p>
          </div>
        </div>
        {status === 'connected' && (
          <Button variant="ghost" size="sm" onClick={disconnect} className="text-red-500 hover:bg-red-50">
            <XCircle className="w-4 h-4 mr-2" /> End Chat
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#F8FAFC] relative overflow-hidden flex flex-col">
        
        {/* State: IDLE */}
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Connect Anonymously</h2>
            <p className="text-slate-500 max-w-md mb-8">
              Talk to someone else who is using CalmSpace right now. No names, no profiles, just human connection.
            </p>
            <div className="flex gap-2 items-center text-xs text-slate-400 mb-8 bg-white px-4 py-2 rounded-full border border-slate-100">
              <ShieldCheck className="w-3 h-3" /> Fully Anonymous & Encrypted
            </div>
            <Button onClick={startSearch} size="lg" className="rounded-full px-8 bg-slate-900 text-white hover:bg-slate-800">
              Find a Peer
            </Button>
          </div>
        )}

        {/* State: SEARCHING */}
        {status === 'searching' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-6" />
            <h3 className="text-xl font-medium text-slate-700">Searching for a match...</h3>
            <p className="text-slate-400 mt-2">Connecting you with someone seeking calm.</p>
            <Button variant="ghost" onClick={disconnect} className="mt-8 text-slate-400">Cancel</Button>
          </div>
        )}

        {/* State: CONNECTED (Chat Interface) */}
        {status === 'connected' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-center my-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300 bg-slate-100 px-3 py-1 rounded-full">
                  Session Started
                </span>
              </div>
              
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed
                    ${msg.sender === 'me' 
                      ? 'bg-slate-900 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm'}
                  `}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="rounded-full bg-slate-50 border-transparent focus:bg-white focus:border-purple-200 transition-all"
              />
              <Button type="submit" size="icon" className="rounded-full bg-purple-600 hover:bg-purple-700 text-white">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};