import React, { useState } from 'react';
import { 
  X, MessageSquare, Send, Phone, AlertTriangle, CheckCircle2, 
  Clock, ShieldCheck, Heart, Sparkles, User, UserCheck
} from 'lucide-react';

interface AdvocateGptCaregiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  caregiverName?: string;
}

interface ChatMessage {
  id: string;
  sender: 'caregiver' | 'ai';
  text: string;
  timestamp: string;
  isEscalation?: boolean;
}

export function AdvocateGptCaregiverModal({
  isOpen,
  onClose,
  patientName = 'Kazi Mohammad Tareq (Father)',
  caregiverName = 'Nusrat (Daughter & Primary Caregiver)'
}: AdvocateGptCaregiverModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'caregiver',
      text: 'Salam doctor, Abba felt slightly dizzy around 7 PM and his sugar was 104 mg/dL. He skipped his evening insulin (Lantus). Should I give it now before bed?',
      timestamp: '08:42 PM'
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: `Wa Alaykum As-Salam Nusrat. Let's handle this carefully:

1. Sugar Assessment: 104 mg/dL is near-normal/euglycemic. If he felt dizzy, check for symptoms of hypoglycemia (cold sweating, shakiness, or confusion).
2. Insulin Lantus (Glargine): Because Lantus is a long-acting 24-hour basal insulin (not a rapid mealtime insulin), do NOT double the dose tomorrow. If he is feeling stable now and has had a small complex carbohydrate snack (like 2 whole-wheat biscuits or a glass of warm milk), he can take his regular basal dose, or reduce by 2 units tonight if you are concerned.
3. Morning Action: Check his fasting blood sugar tomorrow at 7:00 AM. If it remains below 90 or above 180, we will adjust the daytime regimen.

If dizziness worsens or he feels drowsy/confused, tap "Call On-Duty Registrar" below immediately.`,
      timestamp: '08:43 PM',
      isEscalation: false
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'caregiver',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "Thank you for the update. Keep monitoring closely. Ensure he stays hydrated with sips of water. If any red flag symptoms occur, please do not hesitate to contact our emergency desk.";
      
      const lower = userMsg.text.toLowerCase();
      if (lower.includes('fever') || lower.includes('temperature')) {
        aiReply = "For mild fever (under 101°F), 1 tablet of Paracetamol 500mg is safe with his current cardiac medications. Avoid any Ibuprofen, Naproxen, or Aspirin, as they can cause severe stomach bleeding with his blood thinners. Re-check temperature in 2 hours.";
      } else if (lower.includes('missed') || lower.includes('forgot') || lower.includes('double')) {
        aiReply = "RULE OF THUMB FOR BLOOD PRESSURE MEDICINES: Never take a double dose to make up for a missed tablet! If it is within 4 hours of his scheduled time, he can take it now. If it is already close to the next scheduled dose, skip the missed one and continue tomorrow morning normally.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0b141a] border border-teal-500/40 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* WhatsApp-Style Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#202c33] border-b border-[#2a3942]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                AG
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#202c33] absolute bottom-0 right-0" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">AdvocateGPT™ Caregiver Companion</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
                  WhatsApp Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Patient: <strong className="text-teal-300">{patientName}</strong> • Ingestion for {caregiverName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Dialing Duty Registrar Hotline: +880 1700-112233')}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Emergency Call"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Doctor</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a] bg-opacity-95">
          <div className="text-center my-2">
            <span className="px-3 py-1 rounded-lg bg-[#182229] text-[10px] font-medium text-slate-400 border border-[#222e35]">
              🔒 End-to-end encrypted clinical caregiver stream • Vitality-OS AI
            </span>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'caregiver';
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-md text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#005c4b] text-white rounded-tr-none'
                      : 'bg-[#202c33] text-slate-200 rounded-tl-none border border-[#2a3942]'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {isUser && <span className="text-cyan-400 font-bold">✓✓</span>}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] text-slate-400 text-xs px-4 py-2 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span>AdvocateGPT is typing</span>
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 bg-[#111b21] border-t border-[#222e35] flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0 font-medium">Quick Prompts:</span>
          <button
            onClick={() => setInputText('He has a 100.2F fever. Can I give Paracetamol with his blood thinner?')}
            className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-teal-300 shrink-0 border border-[#2a3942]"
          >
            Fever + Blood Thinner?
          </button>
          <button
            onClick={() => setInputText('He forgot his morning blood pressure tablet. Should he take a double dose?')}
            className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-teal-300 shrink-0 border border-[#2a3942]"
          >
            Missed Blood Pressure Pill?
          </button>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-[#202c33] border-t border-[#2a3942] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type WhatsApp caregiver inquiry for AdvocateGPT..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-[#2a3942] text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-2.5 rounded-full bg-[#00a884] hover:bg-[#02906f] text-white shadow transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
