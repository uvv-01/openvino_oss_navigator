from pydantic import BaseModel

class BenchmarkUploadRequest(BaseModel):
    report: str