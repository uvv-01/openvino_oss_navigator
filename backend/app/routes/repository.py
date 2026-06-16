from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from ..github.repository_client import RepositoryClient
from ..analyzers.repository_analyzer import RepositoryAnalyzer

router = APIRouter(prefix="/repository", tags=["repository"])

repository_client = RepositoryClient()
repository_analyzer = RepositoryAnalyzer()


@router.get("/{owner}/{repo}")
async def get_repository_info(owner: str, repo: str) -> Dict[str, Any]:
    """
    Get complete repository information and analysis
    
    Flow:
    1. Receive Request
    2. Call Client to fetch data
    3. Call Analyzer to process data
    4. Return Result
    """
    try:
        # Step 1: Fetch basic info
        basic_info = repository_client.get_repository_basic_info(owner, repo)
        
        # Step 2: Fetch languages
        languages = repository_client.get_repository_languages(owner, repo)
        
        # Step 3: Fetch activity
        activity_data = repository_client.get_repository_activity(owner, repo)
        
        # Step 4: Fetch maintainer activity
        maintainer_data = repository_client.get_maintainer_activity(owner, repo)
        
        # Step 5: Fetch contributors
        contributors_data = repository_client.get_contributors(owner, repo)
        
        # Step 6: Analyze data
        health_score = repository_analyzer.calculate_health_score(
            activity_data,
            maintainer_data,
            contributors_data
        )
        
        activity_score = repository_analyzer.calculate_activity_score(activity_data)
        
        insights = repository_analyzer.calculate_insights(
            basic_info,
            activity_data,
            maintainer_data,
            contributors_data
        )
        
        # Step 7: Compile response
        return {
            "success": True,
            "repository": {
                "basic_info": basic_info,
                "languages": languages,
                "activity": activity_score,
                "health": health_score,
                "maintainers": maintainer_data,
                "contributors": contributors_data,
                "insights": insights
            }
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to fetch repository info: {str(e)}"
        )
