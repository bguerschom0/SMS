import React from 'react';
import Card from '../common/Card';

const StatCard = ({
  title,
  value,
  icon,
  change,
  changeText,
  changeType = 'neutral',
  iconBgColor = 'bg-primary-100',
  iconColor = 'text-primary-600',
}) => {
  // Change type colors
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500',
  };

  // Change direction icon
  const renderChangeIcon = () => {
    if (changeType === 'positive') {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-3 w-3 inline mr-1" 
          fill="none"
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 15l7-7 7 7" 
          />
        </svg>
      );
    } else if (changeType === 'negative') {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-3 w-3 inline mr-1" 
          fill="none"
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
        
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="text-xl font-semibold text-gray-900 mt-1">{value}</div>
          
          {(change || changeText) && (
            <div className={`text-xs mt-1 ${changeColors[changeType]}`}>
              {renderChangeIcon()}
              {change && <span className="font-medium">{change}</span>}
              {changeText && <span> {changeText}</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
