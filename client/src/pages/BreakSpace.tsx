import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Waves, Wind, Package, Circle } from 'lucide-react';

type ReleaseType = 'burn' | 'wash' | 'float' | 'blow' | 'box';

interface ReleaseOption {
  type: ReleaseType;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

const BreakSpace = () => {
  const [text, setText] = useState('');
  const [selectedRelease, setSelectedRelease] = useState<ReleaseType | null>(null);
  const [showRelease, setShowRelease] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);

  const releaseOptions: ReleaseOption[] = [
    {
      type: 'burn',
      icon: <Flame className="w-6 h-6" />,
      label: 'Burn It',
      description: 'Watch your words ignite and turn to ash',
      color: 'from-orange-400 to-red-500'
    },
    {
      type: 'wash',
      icon: <Waves className="w-6 h-6" />,
      label: 'Wash It Away',
      description: 'Let the waters carry it away',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      type: 'float',
      icon: <Circle className="w-6 h-6" />,
      label: 'Let It Float',
      description: 'Attach to a balloon and watch it rise',
      color: 'from-pink-400 to-purple-500'
    },
    {
      type: 'blow',
      icon: <Wind className="w-6 h-6" />,
      label: 'Blow It Away',
      description: 'Let the wind sweep it from your mind',
      color: 'from-gray-400 to-slate-500'
    },
    {
      type: 'box',
      icon: <Package className="w-6 h-6" />,
      label: 'Box It Up',
      description: 'Pack it away and let it fade',
      color: 'from-amber-400 to-yellow-500'
    }
  ];

  const affirmations = [
    "It's gone now. Breathe deeply.",
    "You did the right thing by letting go.",
    "Your feelings are valid, and now they're free.",
    "This moment of release was yours to take.",
    "You're lighter now. Feel the difference.",
    "What's released cannot weigh you down.",
    "You chose healing. That takes courage.",
    "Your heart has more space now."
  ];

  const handleRelease = async () => {
    if (!selectedRelease || !text.trim()) return;

    setIsReleasing(true);
    
    // Release animation duration
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Clear the text and show affirmation
    setText('');
    setSelectedRelease(null);
    setShowRelease(false);
    setIsReleasing(false);
    setShowAffirmation(true);
    
    // Show affirmation for 4 seconds, then reset
    setTimeout(() => {
      setShowAffirmation(false);
    }, 4000);
  };

  const getReleaseAnimation = () => {
    switch (selectedRelease) {
      case 'burn':
        return {
          initial: { opacity: 1, scale: 1 },
          animate: { 
            opacity: [1, 0.8, 0.3, 0],
            scale: [1, 1.1, 0.9, 0.1],
            color: ['#374151', '#f97316', '#dc2626', '#7f1d1d']
          },
          transition: { duration: 3, ease: 'easeInOut' }
        };
      case 'wash':
        return {
          initial: { opacity: 1, y: 0 },
          animate: { 
            opacity: [1, 0.7, 0.3, 0],
            y: [0, 10, 50, 100],
            blur: [0, 2, 6, 10]
          },
          transition: { duration: 3, ease: 'easeOut' }
        };
      case 'float':
        return {
          initial: { opacity: 1, y: 0, scale: 1 },
          animate: { 
            opacity: [1, 0.8, 0.4, 0],
            y: [0, -50, -150, -300],
            scale: [1, 0.8, 0.6, 0.3]
          },
          transition: { duration: 3, ease: 'easeOut' }
        };
      case 'blow':
        return {
          initial: { opacity: 1, x: 0 },
          animate: { 
            opacity: [1, 0.6, 0.2, 0],
            x: [0, 50, 150, 300],
            rotateZ: [0, 5, 15, 45]
          },
          transition: { duration: 3, ease: 'easeOut' }
        };
      case 'box':
        return {
          initial: { opacity: 1, scale: 1 },
          animate: { 
            opacity: [1, 0.8, 0.4, 0],
            scale: [1, 0.8, 0.3, 0],
            rotateX: [0, 45, 90, 180]
          },
          transition: { duration: 3, ease: 'easeInOut' }
        };
      default:
        return { initial: {}, animate: {}, transition: {} };
    }
  };

  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  if (showAffirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center space-y-6 max-w-md mx-auto px-6"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl mb-6"
          >
            ✨
          </motion.div>
          <h2 className="text-2xl font-medium text-gray-700 leading-relaxed">
            {randomAffirmation}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            className="h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-8 mt-8"
        >
          <h1 className="text-4xl font-light text-gray-800 mb-4">
            🔐 BreakSpace
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            This is your space. Type what you need to release. When you're ready, let it go.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            No login • No tracking • Nothing saved • Fully private
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showRelease ? (
            <motion.div
              key="writing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass border-0 shadow-2xl">
                <CardContent className="p-8">
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write freely. No one will see this but you..."
                    className="min-h-[300px] text-lg leading-relaxed border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                    autoFocus
                  />
                  
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={() => setShowRelease(true)}
                      disabled={!text.trim()}
                      size="lg"
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Ready to Let Go
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : !isReleasing ? (
            <motion.div
              key="choosing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-light text-gray-700 mb-2">
                  Choose Your Release
                </h2>
                <p className="text-gray-500">
                  How would you like to symbolically let this go?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {releaseOptions.map((option) => (
                  <motion.div
                    key={option.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                        selectedRelease === option.type
                          ? 'border-purple-400 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRelease(option.type)}
                    >
                      <CardContent className="p-6 text-center">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${option.color} text-white mb-4`}
                        >
                          {option.icon}
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {option.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowRelease(false)}
                  className="px-6"
                >
                  Back to Writing
                </Button>
                <Button
                  onClick={handleRelease}
                  disabled={!selectedRelease}
                  size="lg"
                  className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
                >
                  Release It
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="releasing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="text-center max-w-2xl mx-auto px-6">
                <motion.div
                  {...getReleaseAnimation()}
                  className="text-lg leading-relaxed text-gray-700 mb-8 whitespace-pre-wrap"
                >
                  {text}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="text-gray-500"
                >
                  Letting it go...
                </motion.div>
                
                {/* Particle effects based on release type */}
                {selectedRelease === 'burn' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="w-2 h-2 bg-orange-400 rounded-full absolute top-1/2 left-1/2 animate-ping" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BreakSpace;