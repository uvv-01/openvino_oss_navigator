from typing import Dict, Any
from datetime import datetime, timedelta


class RepositoryAnalyzer:
    """Responsible for repository analysis and insight generation"""
    
    def calculate_health_score(self, activity_data: Dict[str, Any], 
                               maintainer_data: Dict[str, Any],
                               contributors_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate repository health score based on multiple metrics
        
        Inputs:
            - Last Commit
            - Merged PRs
            - Issue Activity
            - Contributor Activity
            
        Output:
            - Health Score (Highly Active, Active, Low Activity, Inactive)
        """
        last_commit_date = activity_data.get("last_commit_date")
        merged_prs = activity_data.get("merged_prs_count", 0)
        open_issues = activity_data.get("open_issues_count", 0)
        active_contributors = len(contributors_data.get("active_contributors", []))
        
        # Calculate days since last commit
        days_since_commit = self._days_since(last_commit_date) if last_commit_date else float('inf')
        
        # Scoring logic
        score = 0
        max_score = 100
        
        # Recent commit activity (0-30 points)
        if days_since_commit <= 7:
            score += 30
        elif days_since_commit <= 30:
            score += 20
        elif days_since_commit <= 90:
            score += 10
        
        # PR activity (0-30 points)
        if merged_prs >= 50:
            score += 30
        elif merged_prs >= 20:
            score += 20
        elif merged_prs >= 5:
            score += 10
        
        # Issue activity (0-20 points)
        if open_issues >= 30:
            score += 15
        elif open_issues >= 10:
            score += 10
        elif open_issues >= 1:
            score += 5
        
        # Contributor activity (0-20 points)
        if active_contributors >= 20:
            score += 20
        elif active_contributors >= 10:
            score += 15
        elif active_contributors >= 3:
            score += 10
        
        # Determine health status
        if score >= 80:
            status = "Highly Active"
        elif score >= 60:
            status = "Active"
        elif score >= 30:
            status = "Low Activity"
        else:
            status = "Inactive"
        
        return {
            "score": score,
            "max_score": max_score,
            "percentage": round((score / max_score) * 100, 2),
            "status": status,
            "breakdown": {
                "commit_activity": min(30, score),
                "pr_activity": min(30, max(0, score - 30)),
                "issue_activity": min(20, max(0, score - 60)),
                "contributor_activity": min(20, max(0, score - 80))
            }
        }
    
    def calculate_activity_score(self, activity_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate activity metrics for the repository
        """
        last_commit_date = activity_data.get("last_commit_date")
        recent_commits = activity_data.get("recent_commits", [])
        merged_prs = activity_data.get("merged_prs_count", 0)
        open_issues = activity_data.get("open_issues_count", 0)
        
        days_since_commit = self._days_since(last_commit_date) if last_commit_date else None
        
        return {
            "last_commit": {
                "date": last_commit_date,
                "days_ago": days_since_commit
            },
            "recent_activity": {
                "commits_last_30_days": len([
                    c for c in recent_commits 
                    if self._days_since(c.get("date")) <= 30
                ]),
                "merged_prs": merged_prs,
                "open_issues": open_issues
            },
            "activity_trend": "increasing" if merged_prs > 10 else "decreasing" if merged_prs < 5 else "stable"
        }
    
    def calculate_insights(self, basic_info: Dict[str, Any],
                          activity_data: Dict[str, Any],
                          maintainer_data: Dict[str, Any],
                          contributors_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate insights about the repository
        """
        insights = []
        
        # Popularity insight
        stars = basic_info.get("stars", 0)
        if stars > 10000:
            insights.append("Very popular project - high community interest")
        elif stars > 1000:
            insights.append("Popular project - good community engagement")
        
        # Maintenance insight
        last_commit_date = activity_data.get("last_commit_date")
        days_since_commit = self._days_since(last_commit_date) if last_commit_date else None
        
        if days_since_commit and days_since_commit <= 7:
            insights.append("Actively maintained - recent commits")
        elif days_since_commit and days_since_commit > 90:
            insights.append("Low maintenance - no recent commits")
        
        # Contributor insight
        active_contributors = len(contributors_data.get("active_contributors", []))
        if active_contributors >= 20:
            insights.append("Strong contributor base - healthy ecosystem")
        elif active_contributors < 3:
            insights.append("Limited contributors - consider learning opportunities")
        
        # Maintainer responsiveness
        maintainer_commits = len(maintainer_data.get("recent_commits", []))
        maintainer_reviews = len(maintainer_data.get("recent_reviews", []))
        
        if maintainer_commits > 0 or maintainer_reviews > 5:
            insights.append("Responsive maintainers - good for contributions")
        else:
            insights.append("Limited maintainer activity")
        
        return {
            "insights": insights,
            "recommendation": "Good project for contribution" if len(insights) >= 3 else "Research further before contributing"
        }
    
    def _days_since(self, date_string: str) -> int:
        """Calculate days since a given date"""
        if not date_string:
            return None
        try:
            date = datetime.fromisoformat(date_string.replace("Z", "+00:00"))
            delta = datetime.now(date.tzinfo) - date
            return delta.days
        except:
            return None
