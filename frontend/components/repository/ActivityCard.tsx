'use client';

import React from 'react';

interface Commit {
  date: string;
  message: string;
  author: string;
}

interface PullRequest {
  title: string;
  merged_at: string;
  author: string;
}

interface Issue {
  title: string;
  created_at: string;
  author: string;
}

interface ActivityData {
  last_commit: {
    date: string;
    days_ago: number | null;
  };
  recent_activity: {
    commits_last_30_days: number;
    merged_prs: number;
    open_issues: number;
  };
  activity_trend: string;
}

interface ActivityCardProps {
  activity: ActivityData;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTrendEmoji = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '📈';
      case 'decreasing':
        return '📉';
      default:
        return '➡️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Activity</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded p-4">
          <p className="text-sm text-gray-600 mb-1">Last Commit</p>
          <p className="text-lg font-semibold text-gray-900">
            {activity.last_commit.days_ago !== null
              ? `${activity.last_commit.days_ago} days ago`
              : 'No commits'}
          </p>
          {activity.last_commit.date && (
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(activity.last_commit.date)}
            </p>
          )}
        </div>

        <div className="bg-green-50 rounded p-4">
          <p className="text-sm text-gray-600 mb-1">Activity Trend</p>
          <p className="text-lg font-semibold text-gray-900">
            {getTrendEmoji(activity.activity_trend)} {activity.activity_trend}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="border border-gray-200 rounded p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Commits (30d)</p>
          <p className="text-2xl font-bold text-gray-900">
            {activity.recent_activity.commits_last_30_days}
          </p>
        </div>

        <div className="border border-gray-200 rounded p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Merged PRs</p>
          <p className="text-2xl font-bold text-gray-900">
            {activity.recent_activity.merged_prs}
          </p>
        </div>

        <div className="border border-gray-200 rounded p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Open Issues</p>
          <p className="text-2xl font-bold text-gray-900">
            {activity.recent_activity.open_issues}
          </p>
        </div>
      </div>
    </div>
  );
};
