
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { COMPANIES } from '../../constants';

interface HeaderProps {
    currentView: 'dashboard' | 'chatbot';
    setCurrentView: (view: 'dashboard' | 'chatbot') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
    const { user, logout } = useAuth();
    const companyName = user ? COMPANIES.find(c => c.id === user.companyId)?.name : 'Odoo';

    return (
        <header className="bg-white shadow-md dark:bg-gray-800">
            <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2">
                           <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            <span className="text-xl font-bold text-gray-800 dark:text-white">{companyName}</span>
                        </div>
                        <nav className="hidden md:flex md:space-x-4">
                            <button
                                onClick={() => setCurrentView('dashboard')}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${currentView === 'dashboard' ? 'text-white bg-blue-600' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setCurrentView('chatbot')}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${currentView === 'chatbot' ? 'text-white bg-blue-600' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                AI Assistant
                            </button>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hidden text-sm text-gray-600 sm:block dark:text-gray-300">Welcome, {user?.username}</span>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
