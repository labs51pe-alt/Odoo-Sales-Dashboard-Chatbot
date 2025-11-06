
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ChatbotPage from './components/ChatbotPage';
import Header from './components/common/Header';

type View = 'dashboard' | 'chatbot';

const App: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="p-4 sm:p-6 lg:p-8">
        {currentView === 'dashboard' && <DashboardPage />}
        {currentView === 'chatbot' && <ChatbotPage />}
      </main>
    </div>
  );
};

export default App;
