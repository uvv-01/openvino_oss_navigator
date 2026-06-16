from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import repository

# Create FastAPI app
app = FastAPI(
    title="OSS Navigator API",
    description="API for analyzing and navigating open source projects",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(repository.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "OSS Navigator API",
        "version": "1.0.0",
        "endpoints": {
            "repository": "/repository/{owner}/{repo}"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}
