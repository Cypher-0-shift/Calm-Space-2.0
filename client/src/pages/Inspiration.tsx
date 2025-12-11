import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { Heart, Star, BookOpen, UserPlus, Quote } from 'lucide-react';

interface Quote {
  text: string;
  author: string;
  category: string;
}

interface Story {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  readTime: string;
  author: string;
  isUserStory?: boolean;
  likes?: number;
}

interface UserStory {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  consent: boolean;
  approved: boolean;
}

interface Affirmation {
  text: string;
  category: string;
}

const Inspiration = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'quotes' | 'stories' | 'famous' | 'share'>('quotes');
  const [favoriteQuotes, setFavoriteQuotes] = useLocalStorage<Quote[]>('favoriteQuotes', []);
  const [readStories, setReadStories] = useLocalStorage<string[]>('readStories', []);
  const [userStories, setUserStories] = useLocalStorage<UserStory[]>('userStories', []);
  const [likedStories, setLikedStories] = useLocalStorage<string[]>('likedStories', []);
  const { toast } = useToast();

  const quotes: Quote[] = [
    {
      text: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.",
      author: "Dr. A.P.J. Abdul Kalam",
      category: "dreams"
    },
    {
      text: "You have to dream before your dreams can come true.",
      author: "Dr. A.P.J. Abdul Kalam", 
      category: "inspiration"
    },
    {
      text: "If you want to shine like a sun, first burn like a sun.",
      author: "Dr. A.P.J. Abdul Kalam",
      category: "motivation"
    },
    {
      text: "Don't take rest after your first victory because if you fail in second, more lips are waiting to say that your first victory was just luck.",
      author: "Dr. A.P.J. Abdul Kalam",
      category: "perseverance"
    },
    {
      text: "The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.",
      author: "William James",
      category: "mindset"
    },
    {
      text: "You are not your thoughts. You are the observer of your thoughts.",
      author: "Eckhart Tolle",
      category: "mindfulness"
    },
    {
      text: "The present moment is the only time over which we have dominion.",
      author: "Thích Nhất Hạnh",
      category: "presence"
    },
    {
      text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
      author: "Ralph Waldo Emerson",
      category: "strength"
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
      category: "hope"
    },
    {
      text: "The only way out is through.",
      author: "Robert Frost",
      category: "courage"
    }
  ];

  const affirmations: Affirmation[] = [
    { text: "I am worthy of love and respect", category: "self-worth" },
    { text: "I choose peace over worry", category: "anxiety" },
    { text: "My feelings are valid and temporary", category: "emotions" },
    { text: "I am stronger than my challenges", category: "strength" },
    { text: "I deserve happiness and joy", category: "happiness" },
    { text: "I am in control of my thoughts", category: "control" },
    { text: "I am healing and growing every day", category: "healing" },
    { text: "I trust in my ability to overcome difficulties", category: "resilience" },
    { text: "I am enough, just as I am", category: "acceptance" },
    { text: "I choose to focus on what I can control", category: "focus" }
  ];

  const userStoryExamples: Story[] = [
    {
      id: "user1",
      title: "From Anxiety to Advocacy",
      author: "Sarah M.",
      summary: "How I transformed my social anxiety into a mission to help others find their voice",
      content: "Three years ago, I couldn't order pizza over the phone without having a panic attack. The thought of speaking in public made my heart race and my palms sweat. I was trapped in my own mind, convinced that everyone was judging me.\n\nThe turning point came when I missed my best friend's wedding because I was too anxious to attend. That night, I realized my anxiety wasn't just affecting me - it was hurting the people I loved.\n\nI started small. I began with online therapy sessions, where I could hide behind a screen. My therapist taught me breathing techniques and helped me challenge my negative thoughts. The first time I successfully ordered takeout without rehearsing the conversation ten times, I cried with relief.\n\nGradually, I pushed my comfort zone. I joined a local book club, then volunteered at a animal shelter where talking to the animals helped me practice speaking without judgment. Each small victory built my confidence.\n\nToday, I run workshops for people with social anxiety. I share my story not because I'm 'cured' - anxiety is still part of my life - but because I've learned to work with it instead of against it. My greatest weakness became my greatest strength.\n\nTo anyone reading this who struggles with anxiety: you are not broken. You are not alone. And you are braver than you believe. Take it one small step at a time.",
      category: "Mental Health Recovery",
      readTime: "4 min",
      isUserStory: true,
      likes: 47
    },
    {
      id: "user2", 
      title: "The Power of Small Habits",
      author: "Marcus T.",
      summary: "How daily 5-minute actions helped me overcome depression and build a life I love",
      content: "Depression hit me like a freight train after I lost my job during the pandemic. Days blended together in a haze of Netflix and regret. I stopped showering regularly, barely ate, and felt like I was watching my life through a foggy window.\n\nMy sister noticed I was struggling and suggested I start with just five minutes a day - five minutes of anything that felt like self-care. It seemed impossibly small, but that's exactly why it worked.\n\nDay 1: I set a timer for 5 minutes and organized my desk. Just my desk. Nothing else.\nDay 2: 5 minutes of stretching in my living room.\nDay 3: 5 minutes writing in a journal - even if it was just 'I feel terrible today.'\n\nSomething magical happened around week 3. Those 5 minutes became 10, then 15. I started looking forward to my 'self-care time.' I began experimenting: 5 minutes of cooking, 5 minutes of calling a friend, 5 minutes of walking outside.\n\nThe compound effect was real. Small actions led to small wins. Small wins led to momentum. Momentum led to hope. Hope led to bigger actions.\n\nSix months later, I had a new job, a daily exercise routine, and had reconnected with friends I'd pushed away. I still have difficult days, but now I have tools and trust in my ability to take care of myself.\n\nThe best part? I still use the 5-minute rule. It's become my superpower for starting anything that feels overwhelming.",
      category: "Depression Recovery",
      readTime: "3 min",
      isUserStory: true,
      likes: 63
    },
    {
      id: "user3",
      title: "Gratitude in Grief",
      author: "Elena R.",
      summary: "Finding light in darkness after losing my mother to cancer",
      content: "When my mother was diagnosed with stage 4 cancer, I thought my world was ending. The doctors gave her three months; she fought for eight. Those eight months taught me more about life, love, and gratitude than the previous 28 years combined.\n\nMom had always been a positive person, but facing death with grace seemed impossible. Yet she surprised me every day. Instead of dwelling on what she was losing, she celebrated what she still had. 'I have today,' she would say. 'That's enough.'\n\nShe started what she called 'gratitude rounds' during our visits. We'd each share three things we were grateful for that day. At first, I struggled. How could I be grateful when my mother was dying?\n\nBut Mom's gratitude was infectious. She was grateful for the nurse who made her laugh, for the taste of her favorite soup, for my father's terrible jokes. She found joy in the smallest moments and taught me to see them too.\n\nAfter she passed, I was drowning in grief. But I remembered our gratitude rounds. I started a journal, writing three things I was grateful for each day, no matter how dark I felt. Some days it was as simple as 'I'm grateful for coffee' or 'I'm grateful I got out of bed.'\n\nGratitude didn't cure my grief, but it gave me a lifeline. It helped me find moments of light in the darkness. It taught me that we can hold pain and joy simultaneously, that being grateful doesn't mean ignoring our struggles.\n\nMom's been gone for two years now. I still write in my gratitude journal every day. I still miss her terribly. But I also carry her wisdom: we have today. That's enough.\n\nHer legacy isn't just in my memories - it's in how I choose to live each day with an open heart, finding reasons to be grateful even in the midst of loss.",
      category: "Grief & Loss",
      readTime: "4 min",
      isUserStory: true,
      likes: 92
    }
  ];

  const famousStories: Story[] = [
    {
      id: "kalam1",
      title: "The Rocket Man's Journey",
      author: "Dr. A.P.J. Abdul Kalam",
      summary: "From selling newspapers to becoming India's Missile Man",
      content: "Born into a poor Tamil family in Rameswaram, Abdul Kalam's early life was marked by hardship. His father was a boat owner and imam of a local mosque, and to support his family's income, young Kalam sold newspapers at the Rameswaram railway station.\n\nDespite financial constraints, Kalam was an average student but had a deep desire to learn. He was fascinated by mathematics and physics, often spending hours understanding concepts that seemed difficult to others. His determination caught the attention of his teachers, who encouraged his scientific curiosity.\n\nAfter completing his engineering degree, Kalam joined the Defence Research and Development Organisation (DRDO) in 1958. His breakthrough came when he was transferred to the Indian Space Research Organisation (ISRO) in 1969, where he served as the project director of India's first Satellite Launch Vehicle (SLV-III).\n\nThe path wasn't smooth. The first satellite launch in 1979 was a failure, and Kalam faced harsh criticism. Many questioned his capabilities and suggested he step down. Instead of giving up, Kalam and his team analyzed every aspect of the failure, working tirelessly to understand what went wrong.\n\nTheir persistence paid off. In 1980, the SLV-III successfully deployed the Rohini satellite in near-earth orbit, making India the sixth country to have satellite launch capability. This success marked the beginning of Kalam's legendary career in space and missile technology.\n\nKalam's story teaches us that failure is not the opposite of success, but a stepping stone to it. His journey from a newspaper seller to India's Missile Man proves that with determination, hard work, and an unwavering belief in one's dreams, anything is possible.\n\n'I was willing to accept any challenge that could possibly fall in my way,' Kalam once said. His life exemplified this philosophy, inspiring millions to pursue their dreams regardless of their circumstances.",
      category: "Scientific Achievement",
      readTime: "5 min",
      isUserStory: false,
      likes: 156
    },
    {
      id: "oprah1",
      title: "Oprah's Rise from Poverty",
      author: "Oprah Winfrey",
      summary: "Overcoming abuse and poverty to become a media mogul",
      content: "Born into poverty in rural Mississippi to a teenage single mother, Oprah Winfrey's childhood was marked by hardship, abuse, and neglect. She was raised primarily by her grandmother on a farm without running water or electricity, wearing dresses made from potato sacks.\n\nAt age 6, Oprah moved to Milwaukee to live with her mother, where she faced sexual abuse from male relatives and family friends. By age 14, she was pregnant and later lost the baby. These traumatic experiences could have defined her life, but Oprah found solace in education and speaking.\n\nA turning point came when she moved to Nashville to live with her father, Vernon Winfrey, who emphasized education and discipline. Under his guidance, Oprah excelled in school and discovered her talent for public speaking. She won a scholarship to Tennessee State University and began working in radio and television.\n\nHer first major break came as a co-anchor for the evening news in Baltimore, but she was deemed 'too emotional' for hard news. Instead of seeing this as a setback, Oprah embraced her empathetic nature and moved into daytime talk shows.\n\nIn 1986, 'The Oprah Winfrey Show' went national and became the highest-rated television program of its kind. But Oprah's true genius lay in transforming television from mere entertainment to a platform for education, inspiration, and healing.\n\nThroughout her success, Oprah never forgot her roots. She used her platform to address difficult topics like abuse, addiction, and mental health, helping millions feel less alone in their struggles. Her openness about her own trauma helped break stigmas and encouraged others to seek help.\n\nOprah's story demonstrates that our past doesn't have to determine our future. Through education, hard work, and the courage to be vulnerable, we can transform our pain into purpose and our struggles into strength.\n\nAs she famously said, 'The greatest discovery of all time is that a person can change his future by merely changing his attitude.'",
      category: "Overcoming Adversity",
      readTime: "5 min",
      isUserStory: false,
      likes: 203
    },
    {
      id: "mandela1",
      title: "27 Years to Freedom",
      author: "Nelson Mandela",
      summary: "How imprisonment became preparation for leadership",
      content: "When Nelson Mandela walked into Robben Island prison in 1964, he was a 46-year-old activist sentenced to life imprisonment for fighting apartheid. When he walked out 27 years later, he emerged as one of history's greatest leaders, ready to heal a nation.\n\nThe conditions on Robben Island were brutal. Political prisoners were housed in tiny cells, forced to do hard labor in limestone quarries, and subjected to psychological torture. Mandela spent 18 of his 27 years in a cell barely larger than a parking space, with only a straw mat to sleep on.\n\nInstead of letting bitterness consume him, Mandela made a conscious choice to use his time constructively. He studied law through correspondence courses, learning Afrikaans to better understand his oppressors. He established a routine of exercise, study, and meditation that kept his mind sharp and his spirit strong.\n\nMandela became known as the 'University's Chancellor' because he turned the prison into a place of learning. He mentored younger activists, resolved conflicts between different political factions, and even built relationships with some prison guards, slowly changing their perspectives on apartheid.\n\nPerhaps most remarkably, Mandela used his imprisonment to develop the very qualities that would make him an extraordinary leader: patience, forgiveness, and the ability to see the humanity in his enemies. He realized that hatred would poison not just himself, but the entire nation.\n\nWhen he was finally released in 1990, Mandela didn't emerge as a vengeful man seeking retribution. Instead, he became the architect of South Africa's peaceful transition to democracy. His ability to forgive his former oppressors and work alongside them to build a new nation stunned the world.\n\nMandela's story teaches us that we cannot control what happens to us, but we can control how we respond. Even in the darkest circumstances, we have the power to choose growth over bitterness, hope over despair, and love over hate.\n\n'I learned that courage was not the absence of fear, but the triumph over it,' Mandela reflected. His life proved that our greatest trials can become our greatest teachers.",
      category: "Leadership & Forgiveness",
      readTime: "5 min",
      isUserStory: false,
      likes: 178
    }
  ];

  const allStories = [...userStoryExamples, ...famousStories];

  useEffect(() => {
    if (!currentQuote) {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
    if (!currentAffirmation) {
      setCurrentAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
    }
  }, []);

  const getNewQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(newQuote);
  };

  const getNewAffirmation = () => {
    const newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    setCurrentAffirmation(newAffirmation);
  };

  const saveFavoriteQuote = (quote: Quote) => {
    if (favoriteQuotes.some(fav => fav.text === quote.text)) {
      setFavoriteQuotes(favoriteQuotes.filter(fav => fav.text !== quote.text));
      toast({ title: "Removed from favorites" });
    } else {
      setFavoriteQuotes([...favoriteQuotes, quote]);
      toast({ title: "Added to favorites" });
    }
  };

  const likeStory = (storyId: string) => {
    if (likedStories.includes(storyId)) {
      setLikedStories(likedStories.filter(id => id !== storyId));
      toast({ title: "Removed like" });
    } else {
      setLikedStories([...likedStories, storyId]);
      toast({ title: "Story liked!" });
    }
  };

  const markStoryAsRead = (storyId: string) => {
    if (!readStories.includes(storyId)) {
      setReadStories([...readStories, storyId]);
    }
  };

  const isQuoteFavorited = (quote: Quote) => {
    return favoriteQuotes.some(fav => fav.text === quote.text);
  };

  const submitUserStory = (storyData: { title: string; content: string; author: string; consent: boolean }) => {
    const newStory: UserStory = {
      id: Date.now().toString(),
      ...storyData,
      date: new Date().toISOString(),
      approved: false
    };
    
    setUserStories([...userStories, newStory]);
    setShowSubmitForm(false);
    toast({ 
      title: "Story submitted!", 
      description: "Thank you for sharing your journey. It will be reviewed before being shared." 
    });
  };

  const StorySubmissionForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      content: '',
      author: '',
      consent: false
    });

    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Share Your Inspiring Story
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Story Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="Give your story a meaningful title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Your Name (or initials)</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="How would you like to be credited?"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Your Story</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Share your journey of overcoming challenges, finding hope, or personal growth. Your story could inspire someone who needs to hear it today."
              className="min-h-32"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="consent"
              checked={formData.consent}
              onChange={(e) => setFormData({...formData, consent: e.target.checked})}
              className="mt-1"
            />
            <label htmlFor="consent" className="text-sm text-gray-600">
              I consent to share my story anonymously to help inspire others. I understand that my story may be featured in the app to provide hope and encouragement to other users.
            </label>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => submitUserStory(formData)}
              disabled={!formData.title || !formData.content || !formData.author || !formData.consent}
              className="flex-1"
            >
              Submit Story
            </Button>
            <Button 
              onClick={() => setShowSubmitForm(false)} 
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🌈 Daily Inspiration
        </h1>
        <p className="text-lg text-gray-600">
          Uplift your spirit with quotes, stories, and the wisdom of those who've overcome
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <Button
          onClick={() => setActiveTab('quotes')}
          variant={activeTab === 'quotes' ? 'default' : 'outline'}
          className="flex items-center gap-2"
        >
          <Quote className="w-4 h-4" />
          Quotes & Affirmations
        </Button>
        <Button
          onClick={() => setActiveTab('stories')}
          variant={activeTab === 'stories' ? 'default' : 'outline'}
          className="flex items-center gap-2"
        >
          <Heart className="w-4 h-4" />
          Community Stories
        </Button>
        <Button
          onClick={() => setActiveTab('famous')}
          variant={activeTab === 'famous' ? 'default' : 'outline'}
          className="flex items-center gap-2"
        >
          <Star className="w-4 h-4" />
          Famous Journeys
        </Button>
        <Button
          onClick={() => setActiveTab('share')}
          variant={activeTab === 'share' ? 'default' : 'outline'}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Share Your Story
        </Button>
      </div>

      {/* Quotes & Affirmations Tab */}
      {activeTab === 'quotes' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">💭</div>
                Daily Quote
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentQuote && (
                <div className="space-y-4">
                  <blockquote className="text-lg font-medium text-gray-700 italic leading-relaxed">
                    "{currentQuote.text}"
                  </blockquote>
                  <cite className="text-purple-600 font-semibold">— {currentQuote.author}</cite>
                  
                  <div className="flex gap-2">
                    <Button size="sm" onClick={getNewQuote} variant="outline">
                      New Quote
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => saveFavoriteQuote(currentQuote)}
                      variant={isQuoteFavorited(currentQuote) ? "default" : "outline"}
                    >
                      {isQuoteFavorited(currentQuote) ? "⭐ Favorited" : "⭐ Favorite"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">✨</div>
                Daily Affirmation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentAffirmation && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 text-center">
                    <p className="text-xl font-semibold text-gray-800">
                      {currentAffirmation.text}
                    </p>
                  </div>
                  
                  <Button onClick={getNewAffirmation} variant="outline" className="w-full">
                    New Affirmation
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Repeat this affirmation throughout your day
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="text-2xl">🌟</div>
                Quick Mood Boost
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => {
                  const positiveMessage = "Remember: You are capable, you are valuable, and you matter. This moment of difficulty will pass.";
                  toast({ title: "Positive Reminder", description: positiveMessage });
                }}
                className="w-full"
              >
                🤗 Positive Reminder
              </Button>
              
              <Button
                onClick={() => {
                  const encouragement = "You've overcome challenges before, and you can do it again. Take it one step at a time.";
                  toast({ title: "Encouragement", description: encouragement });
                }}
                variant="outline"
                className="w-full"
              >
                💪 Encouragement
              </Button>
              
              <Button
                onClick={() => {
                  const gratitude = "Take a moment to notice one thing you're grateful for right now. Even small appreciations can shift your perspective.";
                  toast({ title: "Gratitude Moment", description: gratitude });
                }}
                variant="outline"
                className="w-full"
              >
                🙏 Gratitude Reminder
              </Button>

              <div className="bg-white/50 rounded-lg p-3">
                <p className="text-sm text-gray-600 text-center">
                  Your current struggles are not your final destination
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Community Stories Tab */}
      {activeTab === 'stories' && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Community Stories of Hope
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedStory ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userStoryExamples.map((story) => (
                  <div
                    key={story.id}
                    className="bg-white/50 rounded-xl p-4 cursor-pointer hover:bg-white/80 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{story.title}</h4>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            likeStory(story.id);
                          }}
                          className={`text-sm ${likedStories.includes(story.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                        >
                          ❤️ {story.likes || 0}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">by {story.author}</p>
                    <p className="text-sm text-gray-600 mb-3">{story.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        {story.category}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedStory(story);
                          markStoryAsRead(story.id);
                        }}
                      >
                        Read Story
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedStory.title}</h3>
                    <p className="text-gray-600 mb-2">by {selectedStory.author}</p>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        {selectedStory.category}
                      </span>
                      <span className="text-sm text-gray-500">{selectedStory.readTime} read</span>
                      <button
                        onClick={() => likeStory(selectedStory.id)}
                        className={`text-sm ${likedStories.includes(selectedStory.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                      >
                        ❤️ {selectedStory.likes || 0}
                      </button>
                    </div>
                  </div>
                  <Button onClick={() => setSelectedStory(null)} variant="outline" size="sm">
                    ← Back
                  </Button>
                </div>
                
                <div className="bg-white/50 rounded-xl p-6">
                  <div className="prose prose-gray max-w-none">
                    {selectedStory.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed text-gray-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 text-center italic">
                    "Every story shared is a beacon of hope for someone who needs it. Thank you for opening your heart."
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Famous Journeys Tab */}
      {activeTab === 'famous' && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Famous Journeys of Triumph
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedStory ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {famousStories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-white/50 rounded-xl p-4 cursor-pointer hover:bg-white/80 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{story.title}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-400">
                          ⭐ {story.likes || 0}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">by {story.author}</p>
                    <p className="text-sm text-gray-600 mb-3">{story.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {story.category}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedStory(story);
                          markStoryAsRead(story.id);
                        }}
                      >
                        Read Story
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedStory.title}</h3>
                    <p className="text-gray-600 mb-2">The story of {selectedStory.author}</p>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {selectedStory.category}
                      </span>
                      <span className="text-sm text-gray-500">{selectedStory.readTime} read</span>
                      <span className="text-sm text-gray-400">
                        ⭐ {selectedStory.likes || 0} inspired
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => setSelectedStory(null)} variant="outline" size="sm">
                    ← Back
                  </Button>
                </div>
                
                <div className="bg-white/50 rounded-xl p-6">
                  <div className="prose prose-gray max-w-none">
                    {selectedStory.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed text-gray-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 text-center italic">
                    "The stories of great individuals remind us that extraordinary achievements often begin with ordinary circumstances and extraordinary determination."
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Share Your Story Tab */}
      {activeTab === 'share' && (
        <div className="space-y-6">
          {!showSubmitForm ? (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Share Your Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-xl font-semibold mb-2">Your Story Matters</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Have you overcome challenges, found hope in darkness, or discovered strength you didn't know you had? 
                  Your journey could be exactly what someone else needs to hear today. Every story of resilience lights 
                  the way for others walking similar paths.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🔒</div>
                    <h4 className="font-semibold mb-1">Anonymous & Safe</h4>
                    <p className="text-sm text-gray-600">Share as much or as little as you're comfortable with</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-2xl mb-2">❤️</div>
                    <h4 className="font-semibold mb-1">Inspire Others</h4>
                    <p className="text-sm text-gray-600">Your courage in sharing could save someone's day</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🌱</div>
                    <h4 className="font-semibold mb-1">Heal Through Sharing</h4>
                    <p className="text-sm text-gray-600">Telling your story can be part of your own healing journey</p>
                  </div>
                </div>

                <Button onClick={() => setShowSubmitForm(true)} size="lg">
                  Share My Story
                </Button>
                
                <p className="text-xs text-gray-500 mt-4">
                  All stories are reviewed before being shared to ensure they provide hope and inspiration while maintaining privacy.
                </p>
              </CardContent>
            </Card>
          ) : (
            <StorySubmissionForm />
          )}

          {userStories.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Your Submitted Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userStories.map((story) => (
                    <div key={story.id} className="bg-white/50 rounded-lg p-3">
                      <h4 className="font-semibold">{story.title}</h4>
                      <p className="text-sm text-gray-600">by {story.author}</p>
                      <p className="text-xs text-gray-500">
                        Submitted {new Date(story.date).toLocaleDateString()} • 
                        {story.approved ? ' ✅ Approved' : ' ⏳ Under Review'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Favorite Quotes Section */}
      {favoriteQuotes.length > 0 && activeTab === 'quotes' && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Your Favorite Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {favoriteQuotes.map((quote, index) => (
                <div key={index} className="bg-white/50 rounded-lg p-4">
                  <blockquote className="text-sm italic mb-2">"{quote.text}"</blockquote>
                  <cite className="text-sm text-purple-600">— {quote.author}</cite>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Inspiration;