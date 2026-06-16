'use client';

import React from 'react';

interface Commit {
  date: string;
  author: string;
}

interface Review {
  reviewed_at: string;
  pr_title: string;
}

interface MaintainerData {
  maintainer: string;
  recent_commits: Commit[];
  recent_reviews: Review[];
  merged_prs_count: number;
}

interface MaintainerActivityCardProps {
  data: MaintainerData;
}

export const MaintainerActivityCard: React.FC<MaintainerActivityCardProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'today';
    if (diffDays === 2) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Maintainer Activity</h2>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Maintainer: <span className="text-blue-600">{data.maintainer}</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-gray-200 rounded p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Recent Commits</p>
          <p className="text-3xl font-bold text-gray-900">
            {data.recent_commits.length}
          </p>
        </div>

        <div className="border border-gray-200 rounded p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">PR Reviews</p>
          <p className="text-3xl font-bold text-gray-900">
            {data.recent_reviews.length}
          </p>
        </div>

        <div className="border border-gray-200 rounded p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Merged PRs</p>
          <p className="text-3xl font-bold text-gray-900">
            {data.merged_prs_count}
          </p>
        </div>
      </div>

      {data.recent_commits.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Recent Commits
          </h4>
          <ul className="space-y-2">
            {data.recent_commits.slice(0, 5).map((commit, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
              >
                {formatDate(commit.date)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.recent_reviews.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Recent Reviews
          </h4>
          <ul className="space-y-2">
            {data.recent_reviews.slice(0, 5).map((review, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-600 bg-gray-50 p-2 rounded truncate"
                title={review.pr_title}
              >
                {review.pr_title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
