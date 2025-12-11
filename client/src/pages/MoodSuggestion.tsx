import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import ParticlesBackground from '@/components/ParticlesBackground';

const MoodSuggestion = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const mood = localStorage.getItem('currentMood');
    setCurrentMood(mood);
  }, []);

  const getSuggestions = () => {
    switch (currentMood) {
      case 'Happy':
        return {
          title: "Let's Keep the Good Vibes Going! 🌟",
          description: "Your positive energy is wonderful! Here are some ways to maintain and share your happiness:",
          activities: [
            { icon: '🎵', title: 'Upbeat Music', description: 'Listen to energizing songs that match your mood', path: '/music' },
            { icon: '🎨', title: 'Creative Expression', description: 'Channel your joy into art and creativity', path: '/creativity' },
            { icon: '📓', title: 'Gratitude Journal', description: 'Write about what made you happy today', path: '/journal' },
            { icon: '🎮', title: 'Fun Games', description: 'Play some uplifting memory games', path: '/games' },
          ]
        };
      case 'Sad':
        return {
          title: "It's Okay to Feel Sad 💙",
          description: "Your feelings are valid. Let's find gentle ways to comfort and support you:",
          activities: [
            { icon: '🎵', title: 'Soothing Music', description: 'Calming melodies to ease your heart', path: '/music' },
            { icon: '📓', title: 'Express Your Thoughts', description: 'Write about your feelings in a safe space', path: '/journal' },
            { icon: '🌈', title: 'Find Inspiration', description: 'Discover uplifting stories and quotes', path: '/inspiration' },
            { icon: '💬', title: 'Talk to AI Friend', description: 'Share your feelings with our caring AI', path: '/aichat' },
          ]
        };
      case 'Anxious':
        return {
          title: "Let's Find Your Calm 🌸",
          description: "Anxiety is tough, but you're tougher. Here are proven techniques to help you find peace:",
          activities: [
            { icon: '🌬️', title: 'Breathing Exercises', description: 'Quick relief with guided breathing', path: '/panic' },
            { icon: '🧘‍♀️', title: 'Relaxation Techniques', description: 'Meditation and mindfulness practices', path: '/relaxation' },
            { icon: '💬', title: 'AI Support', description: 'Talk through your worries with understanding', path: '/aichat' },
            { icon: '🎵', title: 'Calming Sounds', description: 'Nature sounds and peaceful music', path: '/music' },
          ]
        };
      case 'Angry':
        return {
          title: "Let's Transform This Energy 🔥",
          description: "Anger is a powerful emotion. Let's channel it into something positive and healing:",
          activities: [
            { icon: '🧘‍♀️', title: 'Cool Down', description: 'Breathing and meditation to find center', path: '/relaxation' },
            { icon: '🎨', title: 'Express Creatively', description: 'Use art to process and release emotions', path: '/creativity' },
            { icon: '🎮', title: 'Focus Games', description: 'Channel energy into mindful activities', path: '/games' },
            { icon: '📓', title: 'Write It Out', description: 'Journal to understand and release anger', path: '/journal' },
          ]
        };
      default:
        return {
          title: "Welcome to Your Wellness Journey 🌱",
          description: "Every step towards self-care matters. Explore these features to support your mental health:",
          activities: [
            { icon: '🎵', title: 'Music Therapy', description: 'Discover mood-enhancing playlists', path: '/music' },
            { icon: '💬', title: 'AI Chat', description: 'Get 24/7 emotional support', path: '/aichat' },
            { icon: '📓', title: 'Journal', description: 'Track your thoughts and feelings', path: '/journal' },
            { icon: '🧘‍♀️', title: 'Relaxation', description: 'Find peace with guided meditation', path: '/relaxation' },
          ]
        };
    }
  };

  const suggestions = getSuggestions();

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setLocation('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-8">
      <ParticlesBackground />
      
      <div className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-4 animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {suggestions.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {suggestions.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {suggestions.activities.map((activity, index) => (
            <Link key={index} href={activity.path}>
              <div className="glass rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-4xl mb-3">{activity.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-600">
                  {activity.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={completeOnboarding}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoodSuggestion;
