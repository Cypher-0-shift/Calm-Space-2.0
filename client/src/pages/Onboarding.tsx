import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import ParticlesBackground from '@/components/ParticlesBackground';

const slides = [
  {
    title: "Welcome to Calm Space",
    description: "Your personal sanctuary for mental wellness and emotional support. Let's take a moment to set up your experience.",
    emoji: "🌟",
  },
  {
    title: "Track Your Mood",
    description: "Monitor your emotional journey with our intuitive mood tracking system. Understand patterns and triggers.",
    emoji: "😊",
  },
  {
    title: "AI Companion",
    description: "Get 24/7 emotional support from our caring AI assistant. Always here to listen and help.",
    emoji: "💬",
  },
  {
    title: "Music Therapy",
    description: "Discover curated playlists tailored to your mood. Let music be your pathway to healing.",
    emoji: "🎵",
  },
  {
    title: "Privacy First",
    description: "Your data stays on your device. We prioritize your privacy and security above all else.",
    emoji: "🔒",
  },
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setLocation('/privacy');
  };

  const current = slides[currentSlide];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <ParticlesBackground />
      
      <div className="glass rounded-3xl p-8 md:p-12 max-w-2xl mx-4 text-center animate-slide-up">
        <div className="text-8xl mb-6 animate-float">
          {current.emoji}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          {current.title}
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {current.description}
        </p>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-purple-600 w-8'
                  : index < currentSlide
                  ? 'bg-purple-400'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={skipOnboarding}
            className="px-6 py-3"
          >
            Skip
          </Button>
          
          <Button
            onClick={nextSlide}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700"
          >
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
