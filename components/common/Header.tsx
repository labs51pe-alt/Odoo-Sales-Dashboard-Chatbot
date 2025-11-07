import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { COMPANIES } from '../../constants';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'chatbot') => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const company = user ? COMPANIES.find(c => c.id === user.companyId) : null;

  const getLinkClass = (page: string) => {
    return `px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
      currentPage === page
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;
  };

  return (
    <header className="bg-gray-800 shadow-md dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
               <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div className="hidden md:block">
              <div className="flex items-baseline ml-10 space-x-4">
                <span onClick={() => onNavigate('dashboard')} className={getLinkClass('dashboard')}>
                  Dashboard
                </span>
                <span onClick={() => onNavigate('chatbot')} className={getLinkClass('chatbot')}>
                  AI Assistant
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
             <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-gray-400">{company?.name}</p>
              </div>
            <button
              onClick={logout}
              className="p-2 ml-4 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Logout</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;