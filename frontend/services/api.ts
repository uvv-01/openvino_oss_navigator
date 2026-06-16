const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  getRepository: async (owner: string, repo: string) => {
    const response = await fetch(`${API_BASE_URL}/repository/${owner}/${repo}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repository: ${response.statusText}`);
    }
    
    return response.json();
  },

  getRepositoryBasicInfo: async (owner: string, repo: string) => {
    const data = await api.getRepository(owner, repo);
    return data.repository?.basic_info;
  },

  getRepositoryLanguages: async (owner: string, repo: string) => {
    const data = await api.getRepository(owner, repo);
    return data.repository?.languages;
  },

  getRepositoryActivity: async (owner: string, repo: string) => {
    const data = await api.getRepository(owner, repo);
    return data.repository?.activity;
  },

  getRepositoryHealth: async (owner: string, repo: string) => {
    const data = await api.getRepository(owner, repo);
    return data.repository?.health;
  },

  getMaintainerActivity: async (owner: string, repo: string) => {
    const data = await api.getRepository(owner, repo);
    return data.repository?.maintainers;
  },

  getContributors: async (owner: string, repo: string) => {
    const data = await api.getRepository(owner, repo);
    return data.repository?.contributors;
  },
};
