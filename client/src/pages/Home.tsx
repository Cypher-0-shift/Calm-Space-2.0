import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMoodTheme } from '@/hooks/useMoodTheme';
import MoodSelector from '@/components/MoodSelector';

const Home = () => {
  const [userProfile] = useLocalStorage('userProfile', null);
  const { mood } = useMoodTheme();
  const [showRecommendations, setShowRecommendations] = useState(false);

  const getMoodRecommendations = () => {
    switch (mood) {
      case 'Happy':
        return [
          { title: 'Listen to upbeat music', icon: '🎵', path: '/music' },
          { title: 'Create something beautiful', icon: '🎨', path: '/creativity' },
          { title: 'Share your joy in journal', icon: '📓', path: '/journal' },
        ];
      case 'Sad':
        return [
          { title: 'Try soothing music', icon: '🎵', path: '/music' },
          { title: 'Journal your thoughts', icon: '📓', path: '/journal' },
          { title: 'Find inspiration', icon: '🌈', path: '/inspiration' },
        ];
      case 'Anxious':
        return [
          { title: 'Practice breathing exercises', icon: '🌬️', path: '/panic' },
          { title: 'Try relaxation techniques', icon: '🧘‍♀️', path: '/relaxation' },
          { title: 'Chat with AI support', icon: '💬', path: '/aichat' },
        ];
      case 'Angry':
        return [
          { title: 'Try calming activities', icon: '🧘‍♀️', path: '/relaxation' },
          { title: 'Express through creativity', icon: '🎨', path: '/creativity' },
          { title: 'Play mindful games', icon: '🎮', path: '/games' },
        ];
      default:
        return [
          { title: 'Explore music therapy', icon: '🎵', path: '/music' },
          { title: 'Start journaling', icon: '📓', path: '/journal' },
          { title: 'Chat with AI', icon: '💬', path: '/aichat' },
        ];
    }
  };

  const handleMoodSelect = () => {
    setShowRecommendations(true);
  };

  return (
    <div className="animate-slide-up">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <div className="glass rounded-3xl p-8 mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-purple-600">Calm Space</span>
          </h1>
          {userProfile?.name && (
            <p className="text-2xl text-gray-600 mb-4">
              Hello, {userProfile.name}! 👋
            </p>
          )}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal sanctuary for mental wellness, mood tracking, and emotional support
          </p>
          
          <MoodSelector onMoodSelect={handleMoodSelect} currentMood={mood} />
          
          {showRecommendations && mood && (
            <div className="mt-8 animate-slide-up">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Recommended for you:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {getMoodRecommendations().map((rec, index) => (
                  <Link key={index} href={rec.path}>
                    <div className="glass rounded-xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
                      <div className="text-3xl mb-2">{rec.icon}</div>
                      <div className="font-medium text-gray-800">{rec.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <Link href="/mood-check">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 mt-6">
              Get Personalized Recommendations
            </button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        
        {/* Music Feature */}
        <Link href="/music">
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">🎵</div>
              <h3 className="text-xl font-semibold text-gray-800">Music Therapy</h3>
            </div>
            <p className="text-gray-600 mb-4">Curated playlists tailored to your mood with YouTube integration</p>
            <div className="bg-black rounded-lg aspect-video mb-4 flex items-center justify-center">
              <i className="fas fa-play text-white text-2xl"></i>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                <i className="fas fa-heart mr-1"></i> Favorites
              </button>
              <button className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                <i className="fas fa-list mr-1"></i> Playlists
              </button>
            </div>
          </div>
        </Link>

        {/* AI Chat Feature */}
        <Link href="/aichat">
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">💬</div>
              <h3 className="text-xl font-semibold text-gray-800">AI Support Chat</h3>
            </div>
            <p className="text-gray-600 mb-4">24/7 emotional support powered by AI</p>
            <div className="space-y-3 mb-4 h-32 overflow-hidden">
              <div className="chat-bubble bg-gray-100 rounded-lg p-3 text-sm">
                Hi! I'm here to listen and support you. How are you feeling today?
              </div>
              <div className="chat-bubble bg-purple-100 rounded-lg p-3 text-sm ml-auto">
                I've been feeling anxious lately
              </div>
              <div className="chat-bubble bg-gray-100 rounded-lg p-3 text-sm">
                I understand. Let's explore some breathing techniques...
              </div>
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Start Conversation
            </button>
          </div>
        </Link>

        {/* Journal Feature */}
        <Link href="/journal">
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">📓</div>
              <h3 className="text-xl font-semibold text-gray-800">Mood Journal</h3>
            </div>
            <p className="text-gray-600 mb-4">Track your emotional journey with guided prompts</p>
            <div className="bg-white/50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-500 mb-2">Today's Prompt:</div>
              <div className="text-sm font-medium text-gray-700 mb-3">"What made you smile today?"</div>
              <div className="text-sm text-gray-600 italic">Start writing your thoughts...</div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Write Entry
            </button>
          </div>
        </Link>

        {/* Panic Feature */}
        <Link href="/panic">
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">🌬️</div>
              <h3 className="text-xl font-semibold text-gray-800">Panic Relief</h3>
            </div>
            <p className="text-gray-600 mb-4">Immediate breathing exercises and grounding techniques</p>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center animate-breathe">
                <div className="text-2xl">🫁</div>
              </div>
            </div>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Quick Relief
            </button>
          </div>
        </Link>

        {/* Games Feature */}
        <Link href="/games">
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">🎮</div>
              <h3 className="text-xl font-semibold text-gray-800">Mindful Games</h3>
            </div>
            <p className="text-gray-600 mb-4">Memory games and puzzles to help focus your mind</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="aspect-square bg-purple-200 rounded-lg flex items-center justify-center text-purple-600">
                <i className="fas fa-heart"></i>
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="aspect-square bg-blue-200 rounded-lg flex items-center justify-center text-blue-600">
                <i className="fas fa-star"></i>
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Play Memory Match
            </button>
          </div>
        </Link>

        {/* Creativity Feature */}
        <Link href="/creativity">
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">🎨</div>
              <h3 className="text-xl font-semibold text-gray-800">Creative Tools</h3>
            </div>
            <p className="text-gray-600 mb-4">Express yourself with drawing tools and creative prompts</p>
            <div className="bg-white rounded-lg h-24 mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-gray-400 text-sm">Drawing Canvas</div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                Draw
              </button>
              <button className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                Prompts
              </button>
            </div>
          </div>
        </Link>
        
      </section>
    </div>
  );
};

export default Home;
