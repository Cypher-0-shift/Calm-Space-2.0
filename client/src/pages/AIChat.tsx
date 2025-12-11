import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getGroqReply } from '@/utils/groqApi';

interface ChatMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
}

const AIChat = () => {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('chatHistory', []);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      isFromUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMessage].map(msg => ({
        role: msg.isFromUser ? 'user' : 'assistant',
        content: msg.content,
      }));

      // Add system message for context
      const systemMessage = {
        role: 'system',
        content: 'You are a compassionate and empathetic AI assistant specializing in mental health support. You provide emotional support, active listening, and gentle guidance. Always be caring, non-judgmental, and encouraging. If someone expresses thoughts of self-harm, gently encourage them to seek professional help.',
      };

      const response = await getGroqReply([systemMessage, ...chatHistory]);
      
      if (response.choices && response.choices[0]?.message?.content) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response.choices[0].message.content,
          isFromUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment. Remember, if you're in crisis, please reach out to a mental health professional or crisis helpline.",
        isFromUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
    }
  };

  const startingPrompts = [
    "I'm feeling anxious today",
    "Can you help me with some breathing exercises?",
    "I'm having trouble sleeping",
    "I need someone to talk to",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          💬 AI Support Chat
        </h1>
        <p className="text-lg text-gray-600">
          Your compassionate AI companion, here to listen and support you 24/7
        </p>
      </div>

      {/* Chat Container */}
      <Card className="glass min-h-[60vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              AI Assistant - Online
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              disabled={messages.length === 0}
            >
              Clear Chat
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4" style={{ maxHeight: '500px' }}>
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🤗</div>
                <h3 className="text-lg font-semibold mb-2">Welcome! I'm here to help</h3>
                <p className="text-gray-600 mb-6">
                  Feel free to share what's on your mind. I'm here to listen without judgment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {startingPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(prompt)}
                      className="text-left"
                    >
                      "{prompt}"
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`chat-bubble rounded-2xl p-4 max-w-[80%] ${
                        message.isFromUser
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-2 opacity-70 ${
                          message.isFromUser ? 'text-purple-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="chat-bubble bg-gray-100 text-gray-800 rounded-2xl p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={sendMessage} className="flex gap-2 pt-4 border-t border-gray-200">
            <Input
              type="text"
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isTyping}
              className="flex-1"
            />
            <Button type="submit" disabled={isTyping || !inputMessage.trim()}>
              {isTyping ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <div className="text-yellow-500 text-lg">⚠️</div>
            <div>
              <strong>Important:</strong> This AI assistant provides emotional support but is not a replacement for professional mental health care. If you're experiencing a mental health crisis, please contact a mental health professional, crisis helpline, or emergency services immediately.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChat;
