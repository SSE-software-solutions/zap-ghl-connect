import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  text: string;
  type: 'sent' | 'received';
  delay: number;
}

const ChatMockup = () => {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const { t } = useLanguage();

  const messages: Message[] = [
    { text: t('chat.message1'), type: 'received', delay: 0 },
    { text: t('chat.message2'), type: 'sent', delay: 1000 },
    { text: t('chat.message3'), type: 'received', delay: 2000 },
    { text: t('chat.message4'), type: 'sent', delay: 3000 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleMessages < messages.length) {
        setVisibleMessages(prev => prev + 1);
      }
    }, messages[visibleMessages]?.delay || 0);

    return () => clearTimeout(timer);
  }, [visibleMessages]);

  useEffect(() => {
    // Reset animation cycle
    const resetTimer = setTimeout(() => {
      setVisibleMessages(0);
    }, 8000);

    return () => clearTimeout(resetTimer);
  }, [visibleMessages]);

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full mx-auto border border-gray-100 transform scale-110">
      {/* Chat Header */}
      <div className="bg-gradient-whatsapp p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl backdrop-blur-sm">
          👤
        </div>
        <div>
          <h4 className="text-white font-semibold text-base">{t('chat.contact')}</h4>
          <p className="text-white/80 text-sm">{t('chat.online')}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-gray-50 p-6 min-h-[400px] flex flex-col gap-4">
        {messages.slice(0, visibleMessages).map((message, index) => (
          <div
            key={index}
            className={`animate-message max-w-[80%] p-4 rounded-2xl text-base leading-relaxed shadow-sm ${
              message.type === 'sent'
                ? 'bg-gradient-whatsapp text-white self-end rounded-br-sm'
                : 'bg-white self-start rounded-bl-sm text-gray-700 border border-gray-100'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {message.text}
            <div className={`text-sm mt-2 text-right ${
              message.type === 'sent' ? 'text-white/80' : 'text-gray-400'
            }`}>
              {new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {visibleMessages < messages.length && visibleMessages > 0 && (
          <div className="bg-white self-start rounded-2xl rounded-bl-sm p-4 max-w-[80%] border border-gray-100 shadow-sm">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMockup;