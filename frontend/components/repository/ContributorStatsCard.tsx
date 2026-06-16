'use client';

import React from 'react';

interface Contributor {
  name: string;
  commits: number;
  last_commit: string;
}

interface ContributorData {
  total_count: number;
  active_contributors: Contributor[];
  recent_contributors: Contributor[];
}

interface ContributorStatsCardProps {
  data: ContributorData;
}

export const ContributorStatsCard: React.FC<ContributorStatsCardProps> = ({
  data,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'today';
    if (diffDays === 2) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;

    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Contributor Statistics</h2>

      <div className="mb-6 border-b pb-4">
        <p className="text-3xl font-bold text-blue-600 mb-1">
          {data.total_count}
        </p>
        <p className="text-sm text-gray-600">Total Contributors</p>
      </div>

      <div className="space-y-6">
        {data.active_contributors.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Top Active Contributors
            </h3>
            <ul className="space-y-2">
              {data.active_contributors.slice(0, 5).map((contributor, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-medium">
                    {idx + 1}. {contributor.name}
                  </span>
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {contributor.commits} commits
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.recent_contributors.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Recent Contributors
            </h3>
            <ul className="space-y-2">
              {data.recent_contributors.slice(0, 5).map((contributor, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-medium">
                    {contributor.name}
                  </span>
                  <span className="text-gray-600 text-xs bg-blue-50 px-2 py-1 rounded">
                    {formatDate(contributor.last_commit)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
