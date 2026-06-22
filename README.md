# OpenVINO OSS Navigator

A tool that fetches GitHub repository data and provides insights like languages, activity, and performance benchmarking ideas for OpenVINO repositories.

## Features
- GitHub repo data fetching
- Repository analytics
- API built with FastAPI

## API Endpoint
- `/repository/{owner}/{repo}`

## How to run
```bash
uvicorn app.main:app --reload
