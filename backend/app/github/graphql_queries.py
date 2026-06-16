"""GraphQL queries for GitHub API"""

REPOSITORY_BASIC_INFO = """
    query GetRepositoryBasicInfo($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
            name
            description
            stargazerCount
            forkCount
            createdAt
            defaultBranchRef {
                name
            }
            url
        }
    }
"""

REPOSITORY_LANGUAGES = """
    query GetRepositoryLanguages($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
            languages(first: 10) {
                edges {
                    size
                    node {
                        name
                        color
                    }
                }
                totalSize
            }
        }
    }
"""

REPOSITORY_ACTIVITY = """
    query GetRepositoryActivity($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
            defaultBranchRef {
                target {
                    ... on Commit {
                        committedDate
                        messageHeadline
                        author {
                            user {
                                login
                            }
                        }
                    }
                }
            }
            recent_commits: defaultBranchRef {
                target {
                    ... on Commit {
                        history(first: 20) {
                            edges {
                                node {
                                    committedDate
                                    messageHeadline
                                    author {
                                        user {
                                            login
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            pullRequests(first: 10, states: MERGED, orderBy: {field: UPDATED_AT, direction: DESC}) {
                totalCount
                edges {
                    node {
                        title
                        mergedAt
                        author {
                            login
                        }
                    }
                }
            }
            issues(first: 10, states: OPEN, orderBy: {field: UPDATED_AT, direction: DESC}) {
                totalCount
                edges {
                    node {
                        title
                        createdAt
                        author {
                            login
                        }
                    }
                }
            }
        }
    }
"""

REPOSITORY_MAINTAINER_ACTIVITY = """
    query GetMaintainerActivity($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
            owner {
                login
            }
            defaultBranchRef {
                target {
                    ... on Commit {
                        history(first: 50) {
                            edges {
                                node {
                                    committedDate
                                    author {
                                        user {
                                            login
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            pullRequests(first: 50, states: MERGED, orderBy: {field: UPDATED_AT, direction: DESC}) {
                edges {
                    node {
                        author {
                            login
                        }
                        reviews(first: 10) {
                            edges {
                                node {
                                    author {
                                        login
                                    }
                                    submittedAt
                                }
                            }
                        }
                        mergedAt
                    }
                }
            }
        }
    }
"""

REPOSITORY_CONTRIBUTORS = """
    query GetRepositoryContributors($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          
            defaultBranchRef {
                target {
                    ... on Commit {
                        history(first: 100) {
                            edges {
                                node {
                                    author {
                                        user {
                                            login
                                        }
                                    }
                                    committedDate
                                }
                            }
                        }
                    }
                }
            }
        }
    }
"""
