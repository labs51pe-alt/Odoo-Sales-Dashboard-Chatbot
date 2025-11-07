import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ChatbotPage from './components/ChatbotPage';
import DebugPage from './components/DebugPage';
import { Header } from './components/common/Header';

type Page = 'dashboard' | 'chatbot' | 'debug';

const App: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'chatbot':
        return <ChatbotPage />;
      case 'debug':
        return <DebugPage />;
      default:
        return <DashboardPage />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <nav className="bg-white shadow-md dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center">
              <div className="flex items-baseline space-x-4">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`${
                    currentPage === 'dashboard'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('chatbot')}
                  className={`${
                    currentPage === 'chatbot'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  AI Assistant
                </button>
                <button
                  onClick={() => setCurrentPage('debug')}
                  className={`${
                    currentPage === 'debug'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Debug
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
