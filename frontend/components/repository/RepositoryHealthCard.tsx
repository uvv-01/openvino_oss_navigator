'use client';

import React from 'react';

interface HealthScore {
  score: number;
  max_score: number;
  percentage: number;
  status: 'Highly Active' | 'Active' | 'Low Activity' | 'Inactive';
}

interface RepositoryHealthCardProps {
  health: HealthScore;
}

export const RepositoryHealthCard: React.FC<RepositoryHealthCardProps> = ({ health }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Highly Active':
        return 'text-green-600';
      case 'Active':
        return 'text-blue-600';
      case 'Low Activity':
        return 'text-yellow-600';
      case 'Inactive':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBarColor = (status: string) => {
    switch (status) {
      case 'Highly Active':
        return 'bg-green-500';
      case 'Active':
        return 'bg-blue-500';
      case 'Low Activity':
        return 'bg-yellow-500';
      case 'Inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Repository Health</h2>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-3xl font-bold ${getStatusColor(health.status)}`}>
            {health.percentage.toFixed(1)}%
          </p>
          <p className={`text-lg font-semibold ${getStatusColor(health.status)}`}>
            {health.status}
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${getBarColor(health.status)} transition-all duration-300`}
          style={{ width: `${health.percentage}%` }}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Score: {health.score}/{health.max_score}</p>
      </div>
    </div>
  );
};
