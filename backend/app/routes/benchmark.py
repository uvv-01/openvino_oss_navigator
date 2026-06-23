from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel

from app.schemas.benchmark import BenchmarkResult
from app.database.session import SessionLocal
from app.database.benchmark_model import Benchmark

from ..benchmark.parser import parse_report
from ..benchmark.comparator import compare_benchmarks

router = APIRouter(
    prefix="/benchmark",
    tags=["benchmark"]
)


class BenchmarkRequest(BaseModel):
    old_report: str
    new_report: str


class VersionCompareRequest(BaseModel):
    model: str
    hardware: str
    old_version: str
    new_version: str


@router.post("/compare")
async def compare(request: BenchmarkRequest):

    old_data = parse_report(request.old_report)
    new_data = parse_report(request.new_report)

    result = compare_benchmarks(
        old_data,
        new_data
    )

    return {
        "success": True,
        "old": old_data,
        "new": new_data,
        "comparison": result
    }


@router.post("/save")
async def save_benchmark(benchmark: BenchmarkResult):

    db = SessionLocal()

    existing = db.query(Benchmark).filter(
        Benchmark.openvino_version == benchmark.openvino_version,
        Benchmark.model == benchmark.model,
        Benchmark.hardware == benchmark.hardware
    ).first()

    if existing:
        db.close()

        return {
            "success": False,
            "message": "Benchmark already exists"
        }

    new_benchmark = Benchmark(
        openvino_version=benchmark.openvino_version,
        model=benchmark.model,
        hardware=benchmark.hardware,
        fps=benchmark.fps,
        latency=benchmark.latency
    )

    db.add(new_benchmark)
    db.commit()

    total = db.query(Benchmark).count()

    db.close()

    return {
        "success": True,
        "message": "Benchmark saved",
        "total": total
    }


@router.get("/list")
async def list_benchmarks():

    db = SessionLocal()

    benchmarks = db.query(Benchmark).all()

    result = []

    for item in benchmarks:
        result.append({
            "id": item.id,
            "openvino_version": item.openvino_version,
            "model": item.model,
            "hardware": item.hardware,
            "fps": item.fps,
            "latency": item.latency
        })

    db.close()

    return {
        "count": len(result),
        "benchmarks": result
    }


@router.post("/version-compare")
async def version_compare(request: VersionCompareRequest):

    db = SessionLocal()

    old_benchmark = db.query(Benchmark).filter(
        Benchmark.model == request.model,
        Benchmark.hardware == request.hardware,
        Benchmark.openvino_version == request.old_version
    ).first()

    new_benchmark = db.query(Benchmark).filter(
        Benchmark.model == request.model,
        Benchmark.hardware == request.hardware,
        Benchmark.openvino_version == request.new_version
    ).first()

    if old_benchmark is None:
        db.close()

        return {
            "success": False,
            "message": f"No benchmark found for version {request.old_version}"
        }

    if new_benchmark is None:
        db.close()

        return {
            "success": False,
            "message": f"No benchmark found for version {request.new_version}"
        }

    comparison = compare_benchmarks(
        {
            "fps": old_benchmark.fps,
            "latency": old_benchmark.latency
        },
        {
            "fps": new_benchmark.fps,
            "latency": new_benchmark.latency
        }
    )

    db.close()

    return {
        "success": True,
        "old": {
            "id": old_benchmark.id,
            "openvino_version": old_benchmark.openvino_version,
            "model": old_benchmark.model,
            "hardware": old_benchmark.hardware,
            "fps": old_benchmark.fps,
            "latency": old_benchmark.latency
        },
        "new": {
            "id": new_benchmark.id,
            "openvino_version": new_benchmark.openvino_version,
            "model": new_benchmark.model,
            "hardware": new_benchmark.hardware,
            "fps": new_benchmark.fps,
            "latency": new_benchmark.latency
        },
        "comparison": comparison
    }


@router.post("/upload-report")
async def upload_report(
    file: UploadFile = File(...),
    model: str = Form(...),
    hardware: str = Form(...),
    openvino_version: str = Form(...)
):

    content = await file.read()

    report_text = content.decode("utf-8")

    parsed = parse_report(report_text)

    db = SessionLocal()

    existing = db.query(Benchmark).filter(
        Benchmark.openvino_version == openvino_version,
        Benchmark.model == model,
        Benchmark.hardware == hardware
    ).first()

    if existing:
        db.close()

        return {
            "success": False,
            "message": "Benchmark already exists"
        }

    new_benchmark = Benchmark(
        openvino_version=openvino_version,
        model=model,
        hardware=hardware,
        fps=parsed["fps"],
        latency=parsed["latency"]
    )

    db.add(new_benchmark)
    db.commit()

    db.close()

    return {
        "success": True,
        "message": "Benchmark uploaded and saved",
        "parsed": parsed
    }