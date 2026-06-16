'use client';

import React, { useState, useEffect } from 'react';
import { RepositoryOverviewCard } from '@/components/repository/RepositoryOverviewCard';
import { LanguageCard } from '@/components/repository/LanguageCard';
import { ActivityCard } from '@/components/repository/ActivityCard';
import { RepositoryHealthCard } from '@/components/repository/RepositoryHealthCard';
import { MaintainerActivityCard } from '@/components/repository/MaintainerActivityCard';
import { ContributorStatsCard } from '@/components/repository/ContributorStatsCard';
import { api } from '@/services/api';

interface RepositoryData {
  success: boolean;
  repository?: {
    basic_info: any;
    languages: any[];
    activity: any;
    health: any;
    maintainers: any;
    contributors: any;
    insights: any;
  };
}

export default function RepositoryPage() {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [data, setData] = useState<RepositoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!owner.trim() || !repo.trim()) {
      setError('Please enter both owner and repository name');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const result = await api.getRepository(owner, repo);
      setData(result);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repository');
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Repository Analysis
          </h1>
          <p className="text-gray-600 mb-6">
            Enter a GitHub repository to analyze its health and activity
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Owner (e.g., openvinotoolkit)"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Repository (e.g., openvino)"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {submitted && data && data.success && data.repository && (
          <div className="space-y-8">
            {/* Overview */}
            <RepositoryOverviewCard info={data.repository.basic_info} />

            {/* Insights */}
            {data.repository.insights?.insights && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Key Insights</h2>
                <ul className="space-y-2">
                  {data.repository.insights.insights.map(
                    (insight: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-green-600 font-bold mt-1">✓</span>
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    )
                  )}
                </ul>
                <p className="mt-4 text-sm text-gray-600 italic">
                  {data.repository.insights.recommendation}
                </p>
              </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Health */}
              <RepositoryHealthCard health={data.repository.health} />

              {/* Activity */}
              <ActivityCard activity={data.repository.activity} />
            </div>

            {/* Languages */}
            <LanguageCard languages={data.repository.languages} />

            {/* Maintainer and Contributors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MaintainerActivityCard data={data.repository.maintainers} />
              <ContributorStatsCard data={data.repository.contributors} />
            </div>
          </div>
        )}

        {/* No Data State */}
        {submitted && (!data || !data.success) && !loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Unable to load repository data</p>
          </div>
        )}

        {/* Initial State */}
        {!submitted && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">
              Enter a repository to get started with analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
