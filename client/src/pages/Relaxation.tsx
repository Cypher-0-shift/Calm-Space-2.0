import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface SoundTrack {
  id: string;
  name: string;
  emoji: string;
  file: string; // For demo, we'll use data URLs or external sources
  category: 'nature' | 'ambient' | 'meditation';
}

interface MeditationSession {
  id: string;
  title: string;
  duration: number; // in seconds
  description: string;
  category: 'breathing' | 'mindfulness' | 'sleep' | 'anxiety';
}

const Relaxation = () => {
  const [activeSound, setActiveSound] = useState<SoundTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [activeMeditation, setActiveMeditation] = useState<MeditationSession | null>(null);
  const [meditationTime, setMeditationTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const soundTracks: SoundTrack[] = [
    {
      id: '1',
      name: 'Ocean Waves',
      emoji: '🌊',
      file: 'https://www.soundjay.com/misc/sounds/ocean-wave.wav',
      category: 'nature'
    },
    {
      id: '2',
      name: 'Rain Sounds',
      emoji: '🌧️',
      file: 'https://www.soundjay.com/misc/sounds/rain-1.wav',
      category: 'nature'
    },
    {
      id: '3',
      name: 'Forest Birds',
      emoji: '🐦',
      file: 'https://www.soundjay.com/misc/sounds/birds-singing.wav',
      category: 'nature'
    },
    {
      id: '4',
      name: 'Wind Chimes',
      emoji: '🎐',
      file: 'https://www.soundjay.com/misc/sounds/wind-chimes.wav',
      category: 'ambient'
    },
    {
      id: '5',
      name: 'Tibetan Bowls',
      emoji: '🥣',
      file: 'https://www.soundjay.com/misc/sounds/singing-bowl.wav',
      category: 'meditation'
    },
    {
      id: '6',
      name: 'White Noise',
      emoji: '⚪',
      file: 'https://www.soundjay.com/misc/sounds/white-noise.wav',
      category: 'ambient'
    }
  ];

  const meditationSessions: MeditationSession[] = [
    {
      id: '1',
      title: '5-Minute Mindfulness',
      duration: 300,
      description: 'A quick mindfulness practice to center yourself',
      category: 'mindfulness'
    },
    {
      id: '2',
      title: 'Breathing for Anxiety',
      duration: 600,
      description: 'Calming breath work to reduce anxiety and stress',
      category: 'anxiety'
    },
    {
      id: '3',
      title: 'Body Scan Relaxation',
      duration: 900,
      description: 'Progressive relaxation through body awareness',
      category: 'mindfulness'
    },
    {
      id: '4',
      title: 'Sleep Preparation',
      duration: 1200,
      description: 'Gentle meditation to prepare your mind for rest',
      category: 'sleep'
    },
    {
      id: '5',
      title: '4-7-8 Breathing',
      duration: 480,
      description: 'Powerful breathing technique for instant calm',
      category: 'breathing'
    },
    {
      id: '6',
      title: 'Loving Kindness',
      duration: 720,
      description: 'Cultivate compassion for yourself and others',
      category: 'mindfulness'
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && meditationTime > 0) {
      timer = setInterval(() => {
        setMeditationTime(time => time - 1);
      }, 1000);
    } else if (meditationTime === 0 && isTimerActive) {
      setIsTimerActive(false);
      setActiveMeditation(null);
      toast({ title: "Meditation Complete! 🧘‍♀️", description: "Great job on completing your session." });
    }
    return () => clearInterval(timer);
  }, [isTimerActive, meditationTime]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const playSound = (track: SoundTrack) => {
    if (activeSound?.id === track.id && isPlaying) {
      // Pause current sound
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Play new sound
      setActiveSound(track);
      setIsPlaying(true);
      toast({ title: `Playing ${track.name} 🎵` });
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setActiveSound(null);
  };

  const startMeditation = (session: MeditationSession) => {
    setActiveMeditation(session);
    setMeditationTime(session.duration);
    setIsTimerActive(true);
    toast({ title: `Starting ${session.title}`, description: "Find a comfortable position and begin." });
  };

  const pauseMeditation = () => {
    setIsTimerActive(!isTimerActive);
  };

  const stopMeditation = () => {
    setIsTimerActive(false);
    setActiveMeditation(null);
    setMeditationTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstructions = () => {
    const instructions = [
      "Inhale slowly through your nose for 4 counts",
      "Hold your breath gently for 4 counts",
      "Exhale slowly through your mouth for 6 counts",
      "Pause briefly and repeat"
    ];
    const index = Math.floor(Date.now() / 4000) % instructions.length;
    return instructions[index];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🧘‍♀️ Relaxation Center
        </h1>
        <p className="text-lg text-gray-600">
          Find your inner peace with guided meditations and calming sounds
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Nature Sounds */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">🎵</div>
                Calming Sounds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {soundTracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => playSound(track)}
                    className={`p-4 rounded-xl transition-all duration-300 ${
                      activeSound?.id === track.id && isPlaying
                        ? 'bg-purple-200 ring-4 ring-purple-300 scale-105'
                        : 'bg-white/50 hover:bg-white/80 hover:scale-105'
                    }`}
                  >
                    <div className="text-3xl mb-2">{track.emoji}</div>
                    <div className="font-medium text-gray-800">{track.name}</div>
                    <div className="text-xs text-gray-600 capitalize">{track.category}</div>
                  </button>
                ))}
              </div>

              {/* Audio Player */}
              <div className="bg-white/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="font-medium text-gray-800">
                      {activeSound ? activeSound.name : 'No sound playing'}
                    </div>
                    {isPlaying && (
                      <div className="text-sm text-green-600">● Playing</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {isPlaying && (
                      <Button onClick={stopSound} variant="outline" size="sm">
                        Stop
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Volume: {volume[0]}%
                  </label>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Hidden audio element for demo */}
              <audio
                ref={audioRef}
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => {
                  toast({ title: "Audio not available", description: "Playing demo silence instead", variant: "destructive" });
                }}
              >
                {activeSound && <source src={activeSound.file} type="audio/wav" />}
              </audio>
            </CardContent>
          </Card>

          {/* Guided Meditations */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">🧘</div>
                Guided Meditations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!activeMeditation ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {meditationSessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-white/50 rounded-xl p-4 hover:bg-white/80 transition-colors cursor-pointer"
                      onClick={() => startMeditation(session)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{session.title}</h4>
                        <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                          {session.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{formatTime(session.duration)}</span>
                        <Button size="sm">Start Session</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {activeMeditation.title}
                    </h3>
                    <p className="text-gray-600">{activeMeditation.description}</p>
                  </div>

                  <div className="text-6xl font-mono text-purple-600">
                    {formatTime(meditationTime)}
                  </div>

                  <div className="bg-white/50 rounded-xl p-6">
                    <h4 className="font-semibold mb-2">Focus on your breath</h4>
                    <p className="text-gray-700">{getBreathingInstructions()}</p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button onClick={pauseMeditation}>
                      {isTimerActive ? 'Pause' : 'Resume'}
                    </Button>
                    <Button onClick={stopMeditation} variant="outline">
                      End Session
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">⚡</div>
                Quick Relaxation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => {
                  const session = meditationSessions.find(s => s.title === '5-Minute Mindfulness');
                  if (session) startMeditation(session);
                }}
                className="w-full"
              >
                🧘‍♀️ 5-Min Mindfulness
              </Button>
              
              <Button
                onClick={() => {
                  const session = meditationSessions.find(s => s.title === '4-7-8 Breathing');
                  if (session) startMeditation(session);
                }}
                variant="outline"
                className="w-full"
              >
                🌬️ Breathing Exercise
              </Button>
              
              <Button
                onClick={() => {
                  const oceanTrack = soundTracks.find(t => t.name === 'Ocean Waves');
                  if (oceanTrack) playSound(oceanTrack);
                }}
                variant="outline"
                className="w-full"
              >
                🌊 Ocean Sounds
              </Button>

              <Button
                onClick={() => {
                  toast({ 
                    title: "Progressive Relaxation", 
                    description: "Close your eyes. Start by tensing and relaxing your toes, then work your way up through your body." 
                  });
                }}
                variant="outline"
                className="w-full"
              >
                💆‍♀️ Body Scan
              </Button>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">💡</div>
                Relaxation Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Find a quiet, comfortable space</li>
                <li>• Use headphones for better sound quality</li>
                <li>• Practice regularly for best results</li>
                <li>• Don't worry about doing it "perfectly"</li>
                <li>• Start with shorter sessions</li>
                <li>• Focus on your breath when distracted</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">📈</div>
                Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="text-green-600">✓</div>
                  <div>Reduces stress and anxiety</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-600">✓</div>
                  <div>Improves sleep quality</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-600">✓</div>
                  <div>Enhances emotional well-being</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-600">✓</div>
                  <div>Increases focus and clarity</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-600">✓</div>
                  <div>Lowers blood pressure</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Relaxation */}
      <Card className="glass border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <div className="text-2xl">🆘</div>
            Need Immediate Calm?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🌬️</div>
              <h4 className="font-semibold mb-1">Box Breathing</h4>
              <p className="text-sm text-gray-600">Inhale 4, hold 4, exhale 4, hold 4</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤲</div>
              <h4 className="font-semibold mb-1">5-4-3-2-1 Grounding</h4>
              <p className="text-sm text-gray-600">5 things you see, 4 you touch, 3 you hear...</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💭</div>
              <h4 className="font-semibant mb-1">Positive Affirmation</h4>
              <p className="text-sm text-gray-600">"This feeling will pass. I am safe."</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relaxation;
