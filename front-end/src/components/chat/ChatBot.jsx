import { useState } from 'react';
import { MessageCircle, X, Bot, Send, User } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your financial assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isBot: false }]);

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "I'm a demo chatbot. In a real application, I would provide intelligent responses to your financial questions.",
        isBot: true
      }]);
    }, 1000);

    setInput('');
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-gray-800 rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Financial Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${message.isBot ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isBot ? 'bg-blue-600' : 'bg-green-600'
                  }`}
                >
                  {message.isBot ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.isBot
                      ? 'bg-gray-700 text-white'
                      : 'bg-blue-600 text-white ml-auto'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;