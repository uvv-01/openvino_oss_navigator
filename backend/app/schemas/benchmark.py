from pydantic import BaseModel


class BenchmarkResult(BaseModel):
    openvino_version: str
    model: str
    hardware: str
    fps: float
    latency: float