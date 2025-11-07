import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import Header from './components/common/Header';
import ChatbotPage from './components/ChatbotPage';

const App: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'chatbot'>('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'chatbot' && <ChatbotPage />}
      </main>
    </div>
  );
};

export default App;