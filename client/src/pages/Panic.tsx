import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Panic = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const { toast } = useToast();

  const breathingPattern = {
    inhale: { duration: 4, text: 'Breathe In', color: 'from-blue-200 to-purple-200' },
    hold: { duration: 4, text: 'Hold', color: 'from-purple-200 to-pink-200' },
    exhale: { duration: 6, text: 'Breathe Out', color: 'from-pink-200 to-blue-200' },
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && count > 0) {
      timer = setTimeout(() => setCount(count - 1), 1000);
    } else if (isActive && count === 0) {
      // Move to next phase
      if (phase === 'inhale') {
        setPhase('hold');
        setCount(breathingPattern.hold.duration);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setCount(breathingPattern.exhale.duration);
      } else {
        setPhase('inhale');
        setCount(breathingPattern.inhale.duration);
        setCycle(cycle + 1);
      }
    }

    return () => clearTimeout(timer);
  }, [isActive, count, phase, cycle]);

  const startBreathing = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(breathingPattern.inhale.duration);
    setCycle(0);
    toast({ title: "Breathing exercise started. Focus on the circle and follow the instructions." });
  };

  const stopBreathing = () => {
    setIsActive(false);
    setCount(4);
    setPhase('inhale');
    toast({ title: "Great job! You completed your breathing exercise." });
  };

  const groundingTechniques = [
    {
      title: "5-4-3-2-1 Technique",
      description: "Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste",
      icon: "👁️"
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Tense and release each muscle group starting from your toes up to your head",
      icon: "💪"
    },
    {
      title: "Cold Water",
      description: "Splash cold water on your face or hold an ice cube to activate your vagus nerve",
      icon: "🧊"
    },
    {
      title: "Mindful Walking",
      description: "Take slow, deliberate steps and focus on the sensation of your feet touching the ground",
      icon: "🚶‍♀️"
    }
  ];

  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      available: "24/7"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      available: "24/7"
    },
    {
      name: "International Association for Suicide Prevention",
      number: "Visit iasp.info for global resources",
      available: "Global"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🌬️ Panic Relief
        </h1>
        <p className="text-lg text-gray-600">
          Immediate support for anxiety and panic attacks
        </p>
      </div>

      {/* Emergency Notice */}
      <Card className="glass border-red-200 bg-red-50/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="text-red-500 text-2xl">🚨</div>
            <div>
              <h3 className="font-semibold text-red-800 mb-2">If you're in immediate danger:</h3>
              <p className="text-red-700 mb-4">
                Please call emergency services (911 in the US) or go to your nearest emergency room.
                Your safety is the most important thing.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => window.open('tel:911')}
                >
                  Call 911
                </Button>
                <Button 
                  variant="outline"
                  className="border-red-300 text-red-700"
                  onClick={() => window.open('tel:988')}
                >
                  Crisis Line: 988
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Breathing Exercise */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="text-2xl">🫁</div>
              Guided Breathing Exercise
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div 
                className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${breathingPattern[phase].color} flex items-center justify-center transition-all duration-1000 ${
                  isActive ? 'animate-breathe' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{count}</div>
                  <div className="text-sm text-gray-600">{breathingPattern[phase].text}</div>
                </div>
              </div>
            </div>
            
            {isActive && (
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  {breathingPattern[phase].text}
                </p>
                <p className="text-sm text-gray-600">
                  Cycle {cycle + 1} • {phase.charAt(0).toUpperCase() + phase.slice(1)}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {!isActive ? (
                <Button 
                  onClick={startBreathing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Start Breathing Exercise
                </Button>
              ) : (
                <Button 
                  onClick={stopBreathing}
                  variant="outline"
                  className="w-full"
                >
                  Stop Exercise
                </Button>
              )}
              
              <p className="text-sm text-gray-600">
                Follow the circle's rhythm: Inhale for 4 seconds, hold for 4, exhale for 6
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="text-2xl">⚡</div>
              Quick Relief Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => {
                setIsActive(true);
                setPhase('inhale');
                setCount(4);
                toast({ title: "Quick breathing session started" });
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              🌬️ 1-Minute Breathing
            </Button>
            
            <Button 
              onClick={() => {
                navigator.vibrate && navigator.vibrate([200, 100, 200]);
                toast({ title: "Focus on this moment. You are safe." });
              }}
              variant="outline"
              className="w-full"
            >
              🧘‍♀️ Grounding Reminder
            </Button>
            
            <Button 
              onClick={() => {
                toast({ 
                  title: "Affirmation", 
                  description: "This feeling will pass. I am stronger than my anxiety. I am safe." 
                });
              }}
              variant="outline"
              className="w-full"
            >
              💭 Positive Affirmation
            </Button>

            <div className="bg-white/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Remember:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• This feeling is temporary</li>
                <li>• You have survived this before</li>
                <li>• Focus on your breathing</li>
                <li>• You are safe right now</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grounding Techniques */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Grounding Techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {groundingTechniques.map((technique, index) => (
              <div key={index} className="bg-white/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{technique.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{technique.title}</h4>
                    <p className="text-sm text-gray-600">{technique.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="text-2xl">📞</div>
            Crisis Support Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-white/50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-800">{contact.name}</h4>
                  <p className="text-sm text-gray-600">Available {contact.available}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-blue-600">{contact.number}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Important Note:</h4>
            <p className="text-sm text-blue-700">
              These resources are available when you need immediate support. Don't hesitate to reach out - 
              there are people who want to help you through difficult times.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Panic;
