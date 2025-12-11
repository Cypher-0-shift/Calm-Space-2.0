import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMoodTheme } from '@/hooks/useMoodTheme';
import { useToast } from '@/hooks/use-toast';

interface CreativeWork {
  id: string;
  type: 'drawing' | 'writing';
  title: string;
  content: string; // Base64 for drawings, text for writing
  prompt?: string;
  date: string;
  mood?: string;
}

const Creativity = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#8B5CF6');
  const [activeTab, setActiveTab] = useState<'draw' | 'write' | 'gallery'>('draw');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [writingText, setWritingText] = useState('');
  const [creativeWorks, setCreativeWorks] = useLocalStorage<CreativeWork[]>('creativeWorks', []);
  const { mood } = useMoodTheme();
  const { toast } = useToast();

  const drawingPrompts = [
    "Draw your current emotion as an abstract shape",
    "Illustrate a peaceful place from your memory",
    "Create a mandala with repeating patterns",
    "Draw your ideal safe space",
    "Sketch something that represents growth",
    "Design a symbol that means 'hope' to you",
    "Draw the weather of your feelings today",
    "Create a garden of your dreams"
  ];

  const writingPrompts = [
    "Write a letter to your future self",
    "Describe a moment when you felt truly at peace",
    "Create a short story about overcoming a fear",
    "Write about a person who inspired you",
    "Compose a poem about resilience",
    "Describe your perfect day in detail",
    "Write about a skill you'd like to learn and why",
    "Create a dialogue between your current and past self"
  ];

  const moodColors = {
    Happy: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4'],
    Sad: ['#4169E1', '#1E90FF', '#87CEEB', '#B0C4DE'],
    Anxious: ['#8B5CF6', '#9370DB', '#DDA0DD', '#E6E6FA'],
    Angry: ['#FF4500', '#DC143C', '#B22222', '#CD5C5C']
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const getRandomPrompt = (type: 'drawing' | 'writing') => {
    const prompts = type === 'drawing' ? drawingPrompts : writingPrompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      
      if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const saveDrawing = () => {
    if (!canvasRef.current) return;
    
    const title = prompt('Give your artwork a title:') || `Drawing - ${new Date().toLocaleDateString()}`;
    const dataURL = canvasRef.current.toDataURL();
    
    const work: CreativeWork = {
      id: Date.now().toString(),
      type: 'drawing',
      title,
      content: dataURL,
      prompt: currentPrompt,
      date: new Date().toISOString(),
      mood: mood || undefined
    };
    
    setCreativeWorks([work, ...creativeWorks]);
    toast({ title: "Artwork saved! 🎨" });
  };

  const saveWriting = () => {
    if (!writingText.trim()) {
      toast({ title: "Please write something first", variant: "destructive" });
      return;
    }
    
    const title = prompt('Give your writing a title:') || `Writing - ${new Date().toLocaleDateString()}`;
    
    const work: CreativeWork = {
      id: Date.now().toString(),
      type: 'writing',
      title,
      content: writingText,
      prompt: currentPrompt,
      date: new Date().toISOString(),
      mood: mood || undefined
    };
    
    setCreativeWorks([work, ...creativeWorks]);
    setWritingText('');
    setCurrentPrompt('');
    toast({ title: "Writing saved! ✍️" });
  };

  const deleteWork = (id: string) => {
    if (confirm('Are you sure you want to delete this creative work?')) {
      setCreativeWorks(creativeWorks.filter(work => work.id !== id));
      toast({ title: "Work deleted" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎨 Creative Tools
        </h1>
        <p className="text-lg text-gray-600">
          Express yourself through art and writing
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('draw')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'draw'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:bg-white/80'
          }`}
        >
          🎨 Draw
        </button>
        <button
          onClick={() => setActiveTab('write')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'write'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:bg-white/80'
          }`}
        >
          ✍️ Write
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'gallery'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:bg-white/80'
          }`}
        >
          🖼️ Gallery ({creativeWorks.length})
        </button>
      </div>

      {/* Drawing Tab */}
      {activeTab === 'draw' && (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Drawing Tools */}
          <div className="space-y-4">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Drawing Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Tool</label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={currentTool === 'pen' ? 'default' : 'outline'}
                      onClick={() => setCurrentTool('pen')}
                    >
                      ✏️ Pen
                    </Button>
                    <Button
                      size="sm"
                      variant={currentTool === 'eraser' ? 'default' : 'outline'}
                      onClick={() => setCurrentTool('eraser')}
                    >
                      🧽 Eraser
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Brush Size: {brushSize}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Color</label>
                  <div className="space-y-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-10 rounded border"
                    />
                    
                    {/* Mood Colors */}
                    {mood && moodColors[mood as keyof typeof moodColors] && (
                      <div className="grid grid-cols-4 gap-1">
                        {moodColors[mood as keyof typeof moodColors].map((moodColor, index) => (
                          <button
                            key={index}
                            onClick={() => setColor(moodColor)}
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: moodColor }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button onClick={clearCanvas} variant="outline" className="w-full">
                    Clear Canvas
                  </Button>
                  <Button onClick={saveDrawing} className="w-full">
                    Save Artwork
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Drawing Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                {currentPrompt && (
                  <div className="bg-white/50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-gray-700">Current Prompt:</p>
                    <p className="text-sm text-gray-600 italic">"{currentPrompt}"</p>
                  </div>
                )}
                <Button
                  onClick={() => setCurrentPrompt(getRandomPrompt('drawing'))}
                  variant="outline"
                  className="w-full"
                >
                  Get Random Prompt
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <Card className="glass">
              <CardContent className="p-6">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="border border-gray-300 rounded-lg cursor-crosshair bg-white w-full"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Writing Tab */}
      {activeTab === 'write' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Creative Writing</CardTitle>
                {currentPrompt && (
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700">Writing Prompt:</p>
                    <p className="text-sm text-gray-600 italic">"{currentPrompt}"</p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Start writing your thoughts, stories, or poetry..."
                  value={writingText}
                  onChange={(e) => setWritingText(e.target.value)}
                  rows={15}
                  className="resize-none"
                />
                <div className="flex gap-3 mt-4">
                  <Button onClick={saveWriting} disabled={!writingText.trim()}>
                    Save Writing
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (writingText && !confirm('Clear current writing?')) return;
                      setWritingText('');
                      setCurrentPrompt('');
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Writing Prompts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setCurrentPrompt(getRandomPrompt('writing'))}
                  variant="outline"
                  className="w-full"
                >
                  Get Random Prompt
                </Button>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Quick Prompts:</h4>
                  {writingPrompts.slice(0, 3).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPrompt(prompt)}
                      className="text-left text-sm text-gray-600 hover:text-gray-800 hover:bg-white/50 p-2 rounded border w-full"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Writing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Write without editing first</li>
                  <li>• Set a timer for focused sessions</li>
                  <li>• Describe emotions through senses</li>
                  <li>• Use specific, concrete details</li>
                  <li>• Don't worry about perfection</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {creativeWorks.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">Your Creative Gallery</h3>
                <p className="text-gray-600">
                  Start creating to see your artwork and writings here!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creativeWorks.map((work) => (
                <Card key={work.id} className="glass hover:scale-105 transition-transform">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg line-clamp-1">{work.title}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {new Date(work.date).toLocaleDateString()}
                          {work.mood && (
                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                              {work.mood}
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteWork(work.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {work.prompt && (
                      <div className="bg-white/50 rounded p-2 mb-3">
                        <p className="text-xs text-gray-600 italic">"{work.prompt}"</p>
                      </div>
                    )}
                    
                    {work.type === 'drawing' ? (
                      <img
                        src={work.content}
                        alt={work.title}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ) : (
                      <div className="bg-white/50 rounded p-3 h-32 overflow-hidden">
                        <p className="text-sm text-gray-700 line-clamp-6">
                          {work.content}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Creative Benefits */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Benefits of Creative Expression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💭</div>
              <h4 className="font-semibold mb-2">Emotional Processing</h4>
              <p className="text-sm text-gray-600">
                Art and writing help process complex emotions and experiences
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🧘‍♀️</div>
              <h4 className="font-semibold mb-2">Mindful Focus</h4>
              <p className="text-sm text-gray-600">
                Creative activities promote flow states and present-moment awareness
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌱</div>
              <h4 className="font-semibold mb-2">Self-Discovery</h4>
              <p className="text-sm text-gray-600">
                Creative expression reveals insights about yourself and your inner world
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Creativity;
