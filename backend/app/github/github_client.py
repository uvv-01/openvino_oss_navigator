import os
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class GitHubClient:
    """Responsible for GitHub Authentication and GraphQL Requests"""
    
    def __init__(self):
        self.token = os.getenv("GITHUB_TOKEN")
        self.api_url = os.getenv("GITHUB_API_URL", "https://api.github.com/graphql")
        
        if not self.token:
            raise ValueError("GITHUB_TOKEN environment variable is not set")
        
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
    
    def execute_query(self, query: str, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Execute a GraphQL query against GitHub API
        
        Args:
            query: GraphQL query string
            variables: Optional variables for the query
            
        Returns:
            Response data from GitHub API
            
        Raises:
            Exception: If the API request fails
        """
        payload = {
            "query": query,
            "variables": variables or {}
        }
        
        response = requests.post(
            self.api_url,
            json=payload,
            headers=self.headers,
            timeout=30
        )
        
        if response.status_code != 200:
            raise Exception(f"GitHub API Error: {response.status_code} - {response.text}")
        
        data = response.json()
        
        if "errors" in data:
            raise Exception(f"GraphQL Error: {data['errors']}")
        
        return data.get("data", {})
