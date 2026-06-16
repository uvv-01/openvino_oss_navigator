from typing import Dict, Any, List
from datetime import datetime
from .github_client import GitHubClient
from . import graphql_queries


class RepositoryClient:
    """Responsible for fetching repository data from GitHub API"""
    
    def __init__(self):
        self.client = GitHubClient()
    
    def get_repository_basic_info(self, owner: str, repo: str) -> Dict[str, Any]:
        """
        Fetch basic repository information
        
        Returns:
            - name
            - description
            - stars
            - forks
            - created_date
            - default_branch
            - url
        """
        data = self.client.execute_query(
            graphql_queries.REPOSITORY_BASIC_INFO,
            {"owner": owner, "repo": repo}
        )
        
        repo_data = data.get("repository", {})
        
        return {
            "name": repo_data.get("name"),
            "description": repo_data.get("description"),
            "stars": repo_data.get("stargazerCount", 0),
            "forks": repo_data.get("forkCount", 0),
            "created_date": repo_data.get("createdAt"),
            "default_branch": repo_data.get("defaultBranchRef", {}).get("name"),
            "url": repo_data.get("url")
        }
    
    def get_repository_languages(self, owner: str, repo: str) -> List[Dict[str, Any]]:
        """
        Fetch programming languages used in repository
        
        Returns:
            List of languages with percentages
            Example: [{"name": "Python", "percentage": 65.5, "color": "#3572A5"}]
        """
        data = self.client.execute_query(
            graphql_queries.REPOSITORY_LANGUAGES,
            {"owner": owner, "repo": repo}
        )
        
        languages_data = data.get("repository", {}).get("languages", {})
        edges = languages_data.get("edges", [])
        total_size = languages_data.get("totalSize", 1)
        
        languages = []
        for edge in edges:
            node = edge.get("node", {})
            size = edge.get("size", 0)
            percentage = (size / total_size * 100) if total_size > 0 else 0
            
            languages.append({
                "name": node.get("name"),
                "percentage": round(percentage, 2),
                "color": node.get("color"),
                "bytes": size
            })
        
        return sorted(languages, key=lambda x: x["percentage"], reverse=True)
    
    def get_repository_activity(self, owner: str, repo: str) -> Dict[str, Any]:
        """
        Fetch repository activity data
        
        Returns:
            - last_commit_date
            - recent_commits (list of recent commits)
            - merged_prs (count)
            - recent_prs (list)
            - open_issues (count)
            - recent_issues (list)
        """
        data = self.client.execute_query(
            graphql_queries.REPOSITORY_ACTIVITY,
            {"owner": owner, "repo": repo}
        )
        
        repo_data = data.get("repository", {})
        
        # Get last commit
        default_branch = repo_data.get("defaultBranchRef", {})
        target = default_branch.get("target", {})
        last_commit_date = target.get("committedDate")
        
        # Get recent commits
        recent_commits_data = repo_data.get("recent_commits", {})
        recent_commits_target = recent_commits_data.get("target", {})
        recent_commits_history = recent_commits_target.get("history", {}).get("edges", [])
        
        recent_commits = [
            {
                "date": commit.get("node", {}).get("committedDate"),
                "message": commit.get("node", {}).get("messageHeadline"),
                "author": commit.get("node", {}).get("author", {}).get("user", {}).get("login")
            }
            for commit in recent_commits_history[:10]
        ]
        
        # Get PRs
        prs_data = repo_data.get("pullRequests", {})
        prs = prs_data.get("edges", [])
        recent_prs = [
            {
                "title": pr.get("node", {}).get("title"),
                "merged_at": pr.get("node", {}).get("mergedAt"),
                "author": pr.get("node", {}).get("author", {}).get("login")
            }
            for pr in prs[:10]
        ]
        
        # Get issues
        issues_data = repo_data.get("issues", {})
        issues = issues_data.get("edges", [])
        recent_issues = [
            {
                "title": issue.get("node", {}).get("title"),
                "created_at": issue.get("node", {}).get("createdAt"),
                "author": issue.get("node", {}).get("author", {}).get("login")
            }
            for issue in issues[:10]
        ]
        
        return {
            "last_commit_date": last_commit_date,
            "recent_commits": recent_commits,
            "merged_prs_count": prs_data.get("totalCount", 0),
            "recent_prs": recent_prs,
            "open_issues_count": issues_data.get("totalCount", 0),
            "recent_issues": recent_issues
        }
    
    def get_maintainer_activity(self, owner: str, repo: str) -> Dict[str, Any]:
        """
        Fetch maintainer activity data
        
        Returns:
            - maintainer_commits (list)
            - maintainer_reviews (list)
            - maintainer_pr_merges (count)
        """
        data = self.client.execute_query(
            graphql_queries.REPOSITORY_MAINTAINER_ACTIVITY,
            {"owner": owner, "repo": repo}
        )
        
        repo_data = data.get("repository", {})
        repo_owner = repo_data.get("owner", {}).get("login")
        
        # Get maintainer commits
        default_branch = repo_data.get("defaultBranchRef", {})
        target = default_branch.get("target", {})
        history = target.get("history", {}).get("edges", [])
        
        maintainer_commits = [
            {
                "date": commit.get("node", {}).get("committedDate"),
                "author": commit.get("node", {}).get("author", {}).get("user", {}).get("login")
            }
            for commit in history
            if commit.get("node", {}).get("author", {}).get("user", {}).get("login") == repo_owner
        ][:10]
        
        # Get maintainer PR reviews
        prs = repo_data.get("pullRequests", {}).get("edges", [])
        maintainer_reviews = []
        
        for pr in prs:
            reviews = pr.get("node", {}).get("reviews", {}).get("edges", [])
            for review in reviews:
                if review.get("node", {}).get("author", {}).get("login") == repo_owner:
                    maintainer_reviews.append({
                        "reviewed_at": review.get("node", {}).get("submittedAt"),
                        "pr_title": pr.get("node", {}).get("title")
                    })
        
        maintainer_reviews = maintainer_reviews[:10]
        
        # Count maintainer merged PRs
        maintainer_merged_prs = sum(
            1 for pr in prs
            if pr.get("node", {}).get("author", {}).get("login") == repo_owner
            and pr.get("node", {}).get("mergedAt")
        )
        
        return {
            "maintainer": repo_owner,
            "recent_commits": maintainer_commits,
            "recent_reviews": maintainer_reviews,
            "merged_prs_count": maintainer_merged_prs
        }
    
    def get_contributors(self, owner: str, repo: str) -> Dict[str, Any]:
        """
        Fetch contributor statistics
        
        Returns:
            - total_contributors
            - recent_contributors (list)
            - active_contributors (list)
        """
        data = self.client.execute_query(
            graphql_queries.REPOSITORY_CONTRIBUTORS,
            {"owner": owner, "repo": repo}
        )
        
        repo_data = data.get("repository", {})
        
        # Get total contributors
        total_contributors = repo_data.get("mentionableUsers", {}).get("totalCount", 0)
        
        # Get recent contributors from commit history
        default_branch = repo_data.get("defaultBranchRef", {})
        target = default_branch.get("target", {})
        history = target.get("history", {}).get("edges", [])
        
        contributor_map = {}
        for commit in history:
            author = commit.get("node", {}).get("author", {}).get("user", {}).get("login")
            if author:
                if author not in contributor_map:
                    contributor_map[author] = {"commits": 0, "last_commit": None}
                contributor_map[author]["commits"] += 1
                committed_date = commit.get("node", {}).get("committedDate")
                if not contributor_map[author]["last_commit"] or committed_date > contributor_map[author]["last_commit"]:
                    contributor_map[author]["last_commit"] = committed_date
        
        active_contributors = sorted(
            [{"name": name, **data} for name, data in contributor_map.items()],
            key=lambda x: x["commits"],
            reverse=True
        )[:10]
        
        recent_contributors = sorted(active_contributors, key=lambda x: x["last_commit"], reverse=True)[:10]
        
        return {
            "total_count": total_contributors,
            "active_contributors": active_contributors,
            "recent_contributors": recent_contributors
        }
