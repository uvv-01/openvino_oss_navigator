# OpenVINO OSS Navigator

A tool that fetches openvino models and tell you which hardware is best and also the benchmark report 

## Features
- GitHub repo data fetching
- Repository analytics
- API built with FastAPI

## API Endpoint
- `/repository/{owner}/{repo}`

## How to run
```bash
uvicorn app.main:app --reload
