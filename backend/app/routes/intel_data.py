from fastapi import APIRouter
import json
import os

router = APIRouter()

DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "benchmarks.json"
)

@router.get("/intel-data")
def get_intel_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    return {
        "success": True,
        "count": len(data),
        "benchmarks": data
    }