'use client';

import React from 'react';

interface BasicInfo {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  created_date: string;
  default_branch: string;
  url: string;
}

interface RepositoryOverviewCardProps {
  info: BasicInfo;
}

export const RepositoryOverviewCard: React.FC<RepositoryOverviewCardProps> = ({ info }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="mb-4">
        <a
          href={info.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-bold text-blue-600 hover:underline"
        >
          {info.name}
        </a>
      </div>

      {info.description && (
        <p className="text-gray-700 mb-4">{info.description}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Stars</p>
          <p className="text-2xl font-bold text-gray-900">
            {info.stars.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Forks</p>
          <p className="text-2xl font-bold text-gray-900">
            {info.forks.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Created</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatDate(info.created_date)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Default Branch</p>
          <p className="text-sm font-semibold text-gray-900">
            {info.default_branch}
          </p>
        </div>
      </div>
    </div>
  );
};
