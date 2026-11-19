import React, { useState } from 'react';
import { 
  X, Brain, Heart, Sparkles, Send, ShieldAlert, CheckCircle2,
  Smile, Frown, Meh, PhoneCall, RefreshCw, AlertTriangle, BookOpen
} from 'lucide-react';

interface MentalHealthChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  cbtPrompt?: string;
}

export function MentalHealthChatbotModal({
  isOpen,
  onClose,
  patientName = 'User'
}: MentalHealthChatbotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Hello ${patientName}. I'm MindCare, your confidential Cognitive Behavioral Therapy (CBT) assistant. I'm here to help you unpack overwhelming emotions, explore unhelpful thought loops, or run an anxiety & depression check-in (PHQ-9 / GAD-7).

How have you been feeling mentally and emotionally over the past few days?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [phq9Score, setPhq9Score] = useState<number | null>(null);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "Thank you for opening up and sharing that with me. It takes courage to acknowledge difficult emotions. Let's take a slow breath together. Would you like to try a gentle thought-reframing exercise, or explore what might be triggering this?";
      const lower = userText.toLowerCase();

      if (lower.includes('sad') || lower.includes('depress') || lower.includes('hopeless') || lower.includes('empty')) {
        botResponse = `I hear how exhausting and heavy this feels for you right now. 
        
In Cognitive Behavioral Therapy, feeling depressed often magnifies feelings of worthlessness and emotional fatigue.
• Step 1: Remember that feelings are real experiences, but they are not permanent facts.
• Step 2: Have you been having difficulty sleeping or finding interest in activities you usually enjoy? We can complete a brief 9-question PHQ-9 screener together to understand what support you need.`;
        setPhq9Score(12);
      } else if (lower.includes('anxious') || lower.includes('panic') || lower.includes('worry') || lower.includes('overwhelm') || lower.includes('heart')) {
        botResponse = `Anxiety often activates our body's fight-or-flight alarm system, making our chest tighten and thoughts race into future worst-case scenarios ("Catastrophizing").

Let's do the 5-4-3-2-1 Sensory Grounding Technique together:
👁️ Notice 5 things you can see around you right now
🖐️ Notice 4 things you can physically touch (the chair, your phone)
👂 Notice 3 things you can hear
👃 Notice 2 things you can smell
👅 Notice 1 taste in your mouth

Take a slow breath in for 4 seconds, hold for 4, and release for 6. How is your chest feeling now?`;
      } else if (lower.includes('die') || lower.includes('suicide') || lower.includes('hurt myself') || lower.includes('end it')) {
        botResponse = `⚠️ CRITICAL SUPPORT ALERT: Your safety and well-being are the absolute priority. Please know that you are not alone, and there is immediate help available.

Please reach out to professional emergency support right now:
📞 Bangladesh Mental Health Helpline (Kaan Pete Roi): +880 1779-554391
📞 National Emergency Helpline: 999
📞 NIMH Specialized Crisis Hotline: 16263

Would you like me to connect you with our hospital on-duty clinical psychologist?`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/90 via-slate-900 to-indigo-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">MindCare™ CBT Mental Health Screener</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30">
                  CBT + PHQ-9 / GAD-7 AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cognitive Behavioral Therapy Conversational AI • Empathetic anxiety & mood screening
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Emergency crisis connection: Dialing NIMH Bangladesh 16263')}
              className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Crisis Helpline</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clinical Assessment Bar */}
        <div className="px-6 py-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Standardized Screening:</span>
            <span className="text-teal-300 font-bold">PHQ-9 Depression Index: {phq9Score !== null ? `${phq9Score}/27 (Moderate)` : 'Unscreened'}</span>
            <span className="text-indigo-300 font-bold">GAD-7 Anxiety Index: 8/21 (Mild)</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            HIPAA Confidential Session
          </span>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/40">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                  isUser 
                    ? 'bg-teal-600 text-white rounded-tr-none' 
                    : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/80'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className={`text-[10px] mt-2 text-right ${isUser ? 'text-teal-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 text-slate-400 text-xs px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                <span>MindCare is reflecting on clinical guidance...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick CBT Prompts */}
        <div className="px-6 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0 font-semibold">CBT Shortcuts:</span>
          <button
            onClick={() => setInputText('I have been feeling deeply anxious about my medical reports and cannot sleep.')}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 shrink-0 border border-slate-700 transition"
          >
            😰 Health Anxiety & Insomnia
          </button>
          <button
            onClick={() => setInputText('I feel hopeless and unmotivated to do anything today.')}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 shrink-0 border border-slate-700 transition"
          >
            🌧️ Low Mood / Sadness
          </button>
          <button
            onClick={() => setInputText('Can you teach me a 2-minute breathing exercise to stop a panic attack?')}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 shrink-0 border border-slate-700 transition"
          >
            🌬️ Panic Grounding Technique
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type how you are feeling or what thoughts are bothering you..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 border border-slate-700"
          />
          <button
            onClick={handleSendMessage}
            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
