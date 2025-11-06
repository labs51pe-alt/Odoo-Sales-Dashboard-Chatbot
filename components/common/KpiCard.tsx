
import React from 'react';

interface KpiCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, changeType }) => {
    const isIncrease = changeType === 'increase';
    const changeColor = isIncrease ? 'text-green-500' : 'text-red-500';
    const changeIcon = isIncrease ? '▲' : '▼';
    
    return (
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
                </div>
                {/* Placeholder for icon */}
            </div>
            <div className={`flex items-center mt-2 text-sm ${changeColor}`}>
                <span>{changeIcon} {change}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
        </div>
    );
};
