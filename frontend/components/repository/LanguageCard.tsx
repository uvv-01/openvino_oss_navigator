'use client';

import React from 'react';

interface Language {
  name: string;
  percentage: number;
  color: string | null;
  bytes: number;
}

interface LanguageCardProps {
  languages: Language[];
}

export const LanguageCard: React.FC<LanguageCardProps> = ({ languages }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Languages</h2>
      
      <div className="space-y-4">
        {languages.length === 0 ? (
          <p className="text-gray-500">No language data available</p>
        ) : (
          languages.slice(0, 10).map((language, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                {language.color && (
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: language.color }}
                  />
                )}
                <span className="text-sm font-medium text-gray-700 min-w-24">
                  {language.name}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${language.percentage}%` }}
                  />
                </div>
              </div>
              
              <span className="text-sm font-semibold text-gray-700 min-w-12 text-right">
                {language.percentage.toFixed(1)}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
