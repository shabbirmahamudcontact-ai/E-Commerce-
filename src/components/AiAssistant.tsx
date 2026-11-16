import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  ShoppingBag, 
  Truck, 
  HelpCircle, 
  CreditCard, 
  RefreshCcw,
  Zap,
  MapPin
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  action?: {
    type: 'cyclone' | 'rider' | 'orders' | 'catalog';
    label: string;
  };
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'ai',
    text: 'স্বাগতম ফকিরের বাজারে (Fokirer Bajar)! 👋 আমি আপনার পার্সোনাল এআই শপিং অ্যাসিস্ট্যান্ট। সাইক্লোন মেগা অফার, পণ্য বাছাই, কলেজ রোড গাইবান্ধায় ২-ঘণ্টা এক্সপ্রেস ডেলিভারি বা লাইভ রাইডার ট্র্যাকিং সংক্রান্ত যেকোনো প্রশ্ন করতে পারেন!',
    timestamp: 'Just now'
  }
];

export const AiAssistant: React.FC = () => {
  const { 
    isAiChatOpen, 
    setIsAiChatOpen, 
    setSelectedCategory, 
    orders, 
    openRiderTracking, 
    setIsUserPanelOpen,
    storeInfo
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiChatOpen) {
      scrollToBottom();
    }
  }, [messages, isAiChatOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();

      let action: ChatMessage['action'] = undefined;
      const q = text.toLowerCase();
      if (q.includes('cyclone') || q.includes('offer') || q.includes('অফার') || q.includes('ছাড়')) {
        action = { type: 'cyclone', label: 'View Cyclone Deals ⚡' };
      } else if (q.includes('rider') || q.includes('রাইডার') || q.includes('track') || q.includes('ট্র্যাক')) {
        action = { type: 'rider', label: 'Follow Rider Live 🛵' };
      } else if (q.includes('order') || q.includes('অর্ডার')) {
        action = { type: 'orders', label: 'Check Order Status 📦' };
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'দুঃখিত, উত্তর পেতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'ai',
          text: 'ফকিরের বাজার সার্ভারের সাথে সংযোগ বিঘ্নিত হয়েছে। তবে আমাদের হটলাইন 09638-FOKIR সর্বদা চালু রয়েছে!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['action']>) => {
    if (action.type === 'cyclone') {
      setSelectedCategory('all');
      const el = document.getElementById('products-section');
      el?.scrollIntoView({ behavior: 'smooth' });
      setIsAiChatOpen(false);
    } else if (action.type === 'rider' && orders.length > 0) {
      openRiderTracking(orders[0]);
    } else if (action.type === 'orders') {
      setIsUserPanelOpen(true);
      setIsAiChatOpen(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button on Bottom Right */}
      <button
        onClick={() => setIsAiChatOpen(!isAiChatOpen)}
        className="fixed bottom-20 md:bottom-6 right-5 z-40 bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2 group border-2 border-white/80"
        title="Fokir AI Customer Assistant"
      >
        <div className="relative">
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
        </div>
        <span className="hidden sm:inline font-bold text-xs pr-1">
          Fokir AI
        </span>
      </button>

      {/* Expandable Chat Window */}
      {isAiChatOpen && (
        <div className="fixed bottom-20 md:bottom-20 right-4 z-50 w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm">Fokir AI Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[10px] text-slate-300">
                  ফকিরের বাজার • College Road, Gaibandha
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAiChatOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-rose-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional Action Button inside AI message */}
                {msg.action && (
                  <button
                    onClick={() => handleActionClick(msg.action!)}
                    className="mt-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>{msg.action.label}</span>
                  </button>
                )}

                <span className="text-[9px] text-slate-400 px-1 mt-0.5">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit text-slate-500 text-xs">
                <Sparkles className="w-4 h-4 text-rose-600 animate-spin" />
                <span>Fokir AI চিন্তা করছে...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[10px] whitespace-nowrap scrollbar-none">
            <button
              onClick={() => handleSendMessage('আজকের সাইক্লোন মেগা অফার কী?')}
              className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 border border-rose-200 cursor-pointer"
            >
              ⚡ সাইক্লোন অফার
            </button>
            <button
              onClick={() => handleSendMessage('ডেলিভারি রাইডার কীভাবে ট্র্যাক করব?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
            >
              🛵 রাইডার ট্র্যাকিং
            </button>
            <button
              onClick={() => handleSendMessage('বিকাশে ওটিপি পেমেন্ট কীভাবে কাজ করে?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
            >
              💳 ওটিপি পেমেন্ট
            </button>
            <button
              onClick={() => handleSendMessage('গাইবান্ধা কলেজ রোডে অফিস কোথায়?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
            >
              📍 কলেজ রোড হাব
            </button>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Fokir AI কে কিছু জিজ্ঞেস করুন..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-rose-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white p-2 rounded-xl transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
