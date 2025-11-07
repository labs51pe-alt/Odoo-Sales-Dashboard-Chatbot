
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ChatbotPage from './components/ChatbotPage';
import DebugPage from './components/DebugPage';
import Header from './components/common/Header';

export type View = 'dashboard' | 'chatbot' | 'debug';

const App: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage setCurrentView={setCurrentView} />;
      case 'chatbot':
        return <ChatbotPage />;
      case 'debug':
        return <DebugPage />;
      default:
        return <DashboardPage setCurrentView={setCurrentView} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
