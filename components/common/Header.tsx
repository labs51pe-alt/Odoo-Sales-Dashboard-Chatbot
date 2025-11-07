import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { COMPANIES } from '../../constants';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const company = user ? COMPANIES.find(c => c.id === user.companyId) : null;

    return (
        <header className="bg-white shadow-sm dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        <h1 className="ml-3 text-xl font-bold text-gray-800 dark:text-white">
                            Odoo Sales Dashboard
                        </h1>
                        {company && (
                            <span className="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                | {company.name}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300 mr-4">
                            Welcome, {user?.username}
                        </span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
