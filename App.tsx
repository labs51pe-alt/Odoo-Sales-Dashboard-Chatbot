import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ChatbotPage from './components/ChatbotPage';
import Header from './components/common/Header';

type Page = 'dashboard' | 'chatbot';

const App: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setCurrentPage('dashboard')}
                        className={`${
                            currentPage === 'dashboard'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setCurrentPage('chatbot')}
                        className={`${
                            currentPage === 'chatbot'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        AI Assistant
                    </button>
                </nav>
            </div>

            <div className="mt-8">
                {currentPage === 'dashboard' && <DashboardPage />}
                {currentPage === 'chatbot' && <ChatbotPage />}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
