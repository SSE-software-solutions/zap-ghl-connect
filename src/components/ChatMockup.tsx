import { useEffect, useState } from 'react';

interface Message {
  text: string;
  type: 'sent' | 'received';
  delay: number;
}

const messages: Message[] = [
  { text: '¡Hola! Me interesa su producto', type: 'received', delay: 0 },
  { text: '¡Perfecto! Te ayudo ahora mismo 😊', type: 'sent', delay: 1000 },
  { text: '¿Cuáles son los precios?', type: 'received', delay: 2000 },
  { text: 'Te envío toda la información completa...', type: 'sent', delay: 3000 },
];

const ChatMockup = () => {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);

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
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full mx-auto">
      {/* Chat Header */}
      <div className="bg-gradient-whatsapp p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-lg">
          👤
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm">Cliente Potencial</h4>
          <p className="text-white/80 text-xs">en línea</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-whatsapp-chat p-5 min-h-[300px] flex flex-col gap-3">
        {messages.slice(0, visibleMessages).map((message, index) => (
          <div
            key={index}
            className={`animate-message max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
              message.type === 'sent'
                ? 'bg-whatsapp-sent self-end rounded-br-sm text-gray-700'
                : 'bg-whatsapp-received self-start rounded-bl-sm text-gray-700'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {message.text}
            <div className="text-xs text-gray-500 mt-1 text-right">
              {new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {visibleMessages < messages.length && visibleMessages > 0 && (
          <div className="bg-whatsapp-received self-start rounded-2xl rounded-bl-sm p-3 max-w-[80%]">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMockup;