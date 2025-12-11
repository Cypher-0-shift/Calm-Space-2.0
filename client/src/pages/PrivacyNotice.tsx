import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ParticlesBackground from '@/components/ParticlesBackground';

const PrivacyNotice = () => {
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [allowPersonalization, setAllowPersonalization] = useState(true);
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    if (!acceptPrivacy) return;

    localStorage.setItem('allowPersonalization', allowPersonalization.toString());
    setLocation('/profile-setup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <ParticlesBackground />
      
      <div className="glass rounded-3xl p-8 md:p-12 max-w-3xl mx-4 animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Privacy & Data Notice
          </h1>
          <p className="text-lg text-gray-600">
            Your privacy is our top priority
          </p>
        </div>

        <div className="space-y-6 text-gray-700">
          <div className="bg-white/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-green-700">✓ What we do:</h3>
            <ul className="space-y-2 text-sm">
              <li>• Store all your data locally on your device</li>
              <li>• Use end-to-end encryption for AI conversations</li>
              <li>• Allow you to export or delete your data anytime</li>
              <li>• Provide complete transparency about data usage</li>
            </ul>
          </div>

          <div className="bg-white/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-red-700">✗ What we don't do:</h3>
            <ul className="space-y-2 text-sm">
              <li>• Sell your personal data to third parties</li>
              <li>• Track your location or personal activities</li>
              <li>• Store sensitive information on our servers</li>
              <li>• Share your mood or journal data with anyone</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy-accept"
                checked={acceptPrivacy}
                onCheckedChange={(checked) => setAcceptPrivacy(!!checked)}
              />
              <label htmlFor="privacy-accept" className="text-sm leading-relaxed">
                I understand and accept that my data will be stored locally on my device, 
                and I consent to the privacy practices outlined above.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="personalization"
                checked={allowPersonalization}
                onCheckedChange={(checked) => setAllowPersonalization(!!checked)}
              />
              <label htmlFor="personalization" className="text-sm leading-relaxed">
                Allow personalization features (mood-based themes, recommendations, etc.)
                This can be changed later in settings.
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => setLocation('/onboarding')}
            className="px-6 py-3"
          >
            Back
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={!acceptPrivacy}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;
