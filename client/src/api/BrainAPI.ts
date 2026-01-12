import { UIState, INITIAL_UI_STATE, Recommendation } from '../types/ui';

// Types for Chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

// Helper to simulate "Brain" memory
const STORAGE_KEYS = {
  NAME: 'calm_user_name',
  GOAL: 'calm_user_goal',
  ONBOARDING: 'hasSeenOnboarding', 
  PRIVACY: 'calm_privacy_accepted',
  PREF_SENSORY: 'calm_pref_sensory',
  PREF_PACE: 'calm_pref_pace',
  INTERACTION_COUNT: 'calm_interaction_count'
};

export const BrainAPI = {
  // 1. GET STATE (The Brain's Voice)
  getUIState: async (): Promise<UIState> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // --- BRAIN LOGIC ---
        const hasOnboarded = localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
        const interactions = parseInt(localStorage.getItem(STORAGE_KEYS.INTERACTION_COUNT) || '0');
        
        let presence: 'cold' | 'warming' | 'active' = 'cold';
        let suggestions: Recommendation[] = [];

        // Determine Presence
        if (!hasOnboarded) {
          presence = 'cold';
        } else if (interactions < 5) {
          presence = 'warming';
        } else {
          presence = 'active';
        }

        // Generate Recommendations based on Presence
        if (presence === 'cold') {
          // Cold: Minimal, non-intrusive
          suggestions = [
            { id: 'onboard', label: 'Begin', sublabel: 'Set up your space', priority: 1, type: 'route', actionData: '/onboarding' }
          ];
        } else if (presence === 'warming') {
          // Warming: Gentle guidance based on initial preferences
          const prefSensory = localStorage.getItem(STORAGE_KEYS.PREF_SENSORY);
          
          suggestions = [
            { id: 'journal', label: 'Clear your mind', priority: 2, type: 'route', actionData: '/journal' },
          ];

          if (prefSensory === 'sound') {
            suggestions.unshift({ id: 'music', label: 'Soundscapes', priority: 1, type: 'route', actionData: '/music' });
          } else {
            suggestions.push({ id: 'breathe', label: 'Breathe', priority: 1, type: 'route', actionData: '/panic' });
          }
        } else {
          // Active: Full features
          suggestions = [
            { id: 'daily-quote', label: 'Daily Wisdom', priority: 2, type: 'route', actionData: '/inspiration' },
            { id: 'chat', label: 'Chat', sublabel: 'I am here', priority: 1, type: 'route', actionData: '/aichat' },
            { id: 'mix', label: 'Focus Mix', priority: 3, type: 'route', actionData: '/music' }
          ];
        }

        resolve({
          ...INITIAL_UI_STATE,
          tone: 'calm',
          brainPresence: presence,
          suggestions
        });
      }, 50); // Fast simulation
    });
  },

  // 2. ACTION HANDLER (The User's Input)
  notifyAction: async (actionId: string, payload?: any) => {
    console.log(`[BrainAPI] Action Received: ${actionId}`, payload);

    // Increment interaction count for "Warming" -> "Active" transition
    if (actionId !== 'ONBOARDING_COMPLETE') {
        const count = parseInt(localStorage.getItem(STORAGE_KEYS.INTERACTION_COUNT) || '0');
        localStorage.setItem(STORAGE_KEYS.INTERACTION_COUNT, (count + 1).toString());
    }

    switch (actionId) {
      case 'ONBOARDING_COMPLETE':
        localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
        break;
        
      case 'PRIVACY_ACCEPTED':
        localStorage.setItem(STORAGE_KEYS.PRIVACY, 'true');
        if (payload?.personalization) {
          localStorage.setItem('calm_personalization_enabled', 'true');
        }
        break;

      case 'SET_PROFILE_NAME':
        if (payload?.name) {
          localStorage.setItem(STORAGE_KEYS.NAME, payload.name);
        }
        break;

      case 'SET_GOAL':
        if (payload?.goal) {
          localStorage.setItem(STORAGE_KEYS.GOAL, payload.goal);
        }
        break;
        
      case 'SET_PREFERENCE':
        if (payload?.key && payload?.value) {
          localStorage.setItem(payload.key, payload.value);
        }
        break;

      case 'CARD_CLICKED':
        console.log(`[Learning] User prefers: ${payload.cardId}`);
        break;
    }

    return new Promise(resolve => setTimeout(resolve, 500));
  },

  // 3. CHAT CAPABILITY (New)
  sendChatMessage: async (text: string): Promise<ChatMessage> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: Date.now().toString(),
      role: 'assistant',
      text: "I hear you. It sounds like a lot to carry right now. We can take it slow.",
      timestamp: Date.now()
    };
  }
};