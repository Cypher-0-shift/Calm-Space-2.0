import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ParticlesBackground from '@/components/ParticlesBackground';

const ProfileSetup = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    goals: '',
    experience: '',
  });
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setLocation('/mood-check');
  };

  const handleSkip = () => {
    setLocation('/mood-check');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <ParticlesBackground />
      
      <div className="glass rounded-3xl p-8 md:p-12 max-w-2xl mx-4 animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Let's Get to Know You
          </h1>
          <p className="text-lg text-gray-600">
            Help us personalize your Calm Space experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-gray-700">
              What should we call you? (Optional)
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name or nickname"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="age" className="text-gray-700">
              Age Range (Optional)
            </Label>
            <select
              id="age"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select your age range</option>
              <option value="under-18">Under 18</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-50">36-50</option>
              <option value="over-50">Over 50</option>
            </select>
          </div>

          <div>
            <Label htmlFor="goals" className="text-gray-700">
              What brings you to Calm Space? (Optional)
            </Label>
            <Textarea
              id="goals"
              placeholder="e.g., Managing anxiety, improving mood, building healthy habits..."
              value={profile.goals}
              onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
              className="mt-2"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="experience" className="text-gray-700">
              Experience with mental wellness apps? (Optional)
            </Label>
            <select
              id="experience"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select your experience level</option>
              <option value="first-time">First time using apps like this</option>
              <option value="some-experience">Some experience</option>
              <option value="experienced">Very experienced</option>
            </select>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="px-6 py-3"
            >
              Skip for Now
            </Button>
            
            <Button
              type="submit"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700"
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
