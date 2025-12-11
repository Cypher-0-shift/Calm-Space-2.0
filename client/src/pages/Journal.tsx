import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMoodTheme } from '@/hooks/useMoodTheme';
import { useToast } from '@/hooks/use-toast';
import BreakSpace from './BreakSpace';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  date: string;
  prompt?: string;
}

const Journal = () => {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('journalEntries', []);
  const [currentEntry, setCurrentEntry] = useState({ title: '', content: '', prompt: '' });
  const [isWriting, setIsWriting] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const { mood } = useMoodTheme();
  const { toast } = useToast();

  const journalPrompts = [
    "What made you smile today?",
    "Describe a moment when you felt proud of yourself.",
    "What are three things you're grateful for right now?",
    "How did you overcome a challenge today?",
    "What would you tell your younger self?",
    "Describe a person who has positively influenced your life.",
    "What are your hopes for tomorrow?",
    "Write about a place that makes you feel peaceful.",
    "What lesson did you learn recently?",
    "How do you want to show kindness to yourself today?",
  ];

  const moodPrompts = {
    Happy: [
      "What's bringing you joy today?",
      "How can you share this happiness with others?",
      "What activities make you feel most alive?"
    ],
    Sad: [
      "What emotions are you experiencing right now?",
      "What comfort would you offer a friend feeling this way?",
      "What small step could brighten your day?"
    ],
    Anxious: [
      "What specific thoughts are causing you worry?",
      "What strategies have helped you feel calm before?",
      "What would you like to release or let go of?"
    ],
    Angry: [
      "What triggered these feelings?",
      "How can you express this emotion in a healthy way?",
      "What boundaries might you need to set?"
    ],
  };

  const getTodaysPrompt = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    if (mood && moodPrompts[mood as keyof typeof moodPrompts]) {
      const moodSpecific = moodPrompts[mood as keyof typeof moodPrompts];
      return moodSpecific[dayOfYear % moodSpecific.length];
    }
    
    return journalPrompts[dayOfYear % journalPrompts.length];
  };

  const saveEntry = () => {
    if (!currentEntry.content.trim()) {
      toast({ title: "Please write something first", variant: "destructive" });
      return;
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title || `Entry - ${new Date().toLocaleDateString()}`,
      content: currentEntry.content,
      mood: mood || undefined,
      date: new Date().toISOString(),
      prompt: currentEntry.prompt || undefined,
    };

    setEntries([entry, ...entries]);
    setCurrentEntry({ title: '', content: '', prompt: '' });
    setIsWriting(false);
    toast({ title: "Journal entry saved! ✍️" });
  };

  const startWriting = (prompt?: string) => {
    setIsWriting(true);
    setSelectedEntry(null);
    if (prompt) {
      setCurrentEntry({ ...currentEntry, prompt });
    }
  };

  const deleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter(entry => entry.id !== id));
      setSelectedEntry(null);
      toast({ title: "Entry deleted" });
    }
  };

  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const key = date.toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {} as { [key: string]: JournalEntry[] });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          📓 Journal Space
        </h1>
        <p className="text-lg text-gray-600">
          Track your thoughts, reflect on your journey, or simply let go
        </p>
      </div>

      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="journal">Personal Journal</TabsTrigger>
          <TabsTrigger value="breakspace">BreakSpace - Let Go</TabsTrigger>
        </TabsList>
        
        <TabsContent value="journal" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Writing Panel */}
            <div className="lg:col-span-2">
              {!isWriting && !selectedEntry ? (
                <Card className="glass">
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-6">✍️</div>
                    <h3 className="text-2xl font-semibold mb-4">Ready to write?</h3>
                    
                    {/* Today's Prompt */}
                    <div className="bg-white/50 rounded-xl p-6 mb-6">
                      <h4 className="font-semibold mb-2">Today's Prompt:</h4>
                      <p className="text-gray-700 italic">"{getTodaysPrompt()}"</p>
                      <Button 
                        onClick={() => startWriting(getTodaysPrompt())}
                        className="mt-4"
                      >
                        Use This Prompt
                      </Button>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button onClick={() => startWriting()}>
                        Free Write
                      </Button>
                      <Button variant="outline" onClick={() => {
                        const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
                        startWriting(randomPrompt);
                      }}>
                        Random Prompt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : isWriting ? (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>New Entry</CardTitle>
                    {currentEntry.prompt && (
                      <div className="bg-white/50 rounded-lg p-3">
                        <strong>Prompt:</strong> <em>"{currentEntry.prompt}"</em>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Entry title (optional)"
                      value={currentEntry.title}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Start writing your thoughts..."
                      value={currentEntry.content}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                      rows={12}
                      className="resize-none"
                    />
                    <div className="flex gap-3">
                      <Button onClick={saveEntry} disabled={!currentEntry.content.trim()}>
                        Save Entry
                      </Button>
                      <Button variant="outline" onClick={() => {
                        if (currentEntry.content && !confirm('Discard current entry?')) return;
                        setIsWriting(false);
                        setCurrentEntry({ title: '', content: '', prompt: '' });
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : selectedEntry ? (
                <Card className="glass">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedEntry.title}</CardTitle>
                        <p className="text-gray-600">
                          {new Date(selectedEntry.date).toLocaleString()}
                          {selectedEntry.mood && (
                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                              {selectedEntry.mood}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteEntry(selectedEntry.id)}
                          className="text-red-600"
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEntry(null)}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedEntry.prompt && (
                      <div className="bg-white/50 rounded-lg p-3 mb-4">
                        <strong>Prompt:</strong> <em>"{selectedEntry.prompt}"</em>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedEntry.content}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            {/* Entries Sidebar */}
            <div className="space-y-4">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Your Entries
                    <Button size="sm" onClick={() => startWriting()}>
                      + New
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {entries.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-3xl mb-2">📝</div>
                      <p className="text-gray-600 text-sm">
                        No entries yet. Start your journaling journey!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Object.entries(groupedEntries)
                        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                        .map(([date, dayEntries]) => (
                          <div key={date}>
                            <h4 className="font-semibold text-sm text-gray-600 mb-2">
                              {new Date(date).toLocaleDateString(undefined, {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </h4>
                            <div className="space-y-2">
                              {dayEntries.map((entry) => (
                                <div
                                  key={entry.id}
                                  onClick={() => setSelectedEntry(entry)}
                                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                    selectedEntry?.id === entry.id
                                      ? 'bg-purple-100 border-purple-300'
                                      : 'bg-white/50 hover:bg-white/80'
                                  }`}
                                >
                                  <h5 className="font-medium text-sm line-clamp-1">
                                    {entry.title}
                                  </h5>
                                  <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                    {entry.content}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-500">
                                      {new Date(entry.date).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                    {entry.mood && (
                                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                                        {entry.mood}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Entries:</span>
                      <span className="font-semibold">{entries.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">This Week:</span>
                      <span className="font-semibold">
                        {entries.filter(entry => {
                          const entryDate = new Date(entry.date);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return entryDate >= weekAgo;
                        }).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Streak:</span>
                      <span className="font-semibold">
                        {entries.length > 0 ? 
                          Math.max(1, Math.floor((Date.now() - new Date(entries[0].date).getTime()) / (1000 * 60 * 60 * 24))) + 
                          " days" : "0 days"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="breakspace" className="mt-6">
          <BreakSpace />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Journal;
