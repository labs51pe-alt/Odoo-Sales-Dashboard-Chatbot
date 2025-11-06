import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { askSalesAssistant } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { COMPANIES } from '../constants';

const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const { data: salesData, isLoading: isSalesDataLoading, error: salesDataError } = useSalesData(user?.companyId);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const company = useMemo(() => user ? COMPANIES.find(c => c.id === user.companyId) : null, [user]);

  useEffect(() => {
    if (company) {
      let initialMessage = `Hello! I am your sales assistant for ${company.name}. How can I help you analyze your sales data today?`;
      if(isSalesDataLoading) {
        initialMessage = `Hello! I am your sales assistant for ${company.name}. Please wait a moment while I load the latest sales data...`;
      } else if (salesDataError) {
        initialMessage = `I'm sorry, but I couldn't load the sales data due to an error: ${salesDataError}. Please try again later or contact support.`;
      } else if (!salesData) {
        initialMessage = `I'm sorry, but there seems to be no sales data available for ${company.name}.`;
      }
      
      setMessages([{
        sender: 'ai',
        text: initialMessage
      }]);
    }
  }, [company, isSalesDataLoading, salesData, salesDataError]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAiLoading || !company || !salesData) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsAiLoading(true);

    try {
      const aiResponseText = await askSalesAssistant(input, company, salesData);
      const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { sender: 'ai', text: 'Sorry, I am having trouble connecting. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const isChatDisabled = isSalesDataLoading || !!salesDataError || !salesData || isAiLoading;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <h1 className="p-4 text-xl font-bold text-gray-800 border-b dark:text-white dark:border-gray-700">AI Sales Assistant</h1>
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'ai' && (
                        <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                        </div>
                    )}
                    <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                    </div>
                </div>
            ))}
             {isAiLoading && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <div className="max-w-md p-3 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t dark:border-gray-700">
            <form onSubmit={handleSend} className="flex items-center gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isChatDisabled ? "Loading data..." : "Ask about sales, profit, top products..."}
                    className="flex-1 w-full px-4 py-2 text-gray-900 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    disabled={isChatDisabled}
                />
                <button
                    type="submit"
                    className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    disabled={isChatDisabled || !input.trim()}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </form>
        </div>
    </div>
  );
};

export default ChatbotPage;
