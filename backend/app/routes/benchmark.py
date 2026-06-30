from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from sqlalchemy import func
from fastapi import Query
from fastapi.responses import JSONResponse

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
@router.get("/models")
async def get_models():

    db = SessionLocal()

    models = db.query(
        Benchmark.model
    ).distinct().all()

    db.close()

    return {
        "models": [m[0] for m in models]
    }
@router.get("/versions/{model}")
async def get_versions(model: str):

    db = SessionLocal()

    versions = (
        db.query(Benchmark.openvino_version)
        .filter(Benchmark.model == model)
        .distinct()
        .all()
    )

    db.close()

    return {
        "versions": [v[0] for v in versions]
    }
@router.get("/hardware/{model}")
async def get_hardware(model: str):

    db = SessionLocal()

    hardware = (
        db.query(Benchmark.hardware)
        .filter(Benchmark.model == model)
        .distinct()
        .all()
    )

    db.close()

    return {
        "hardware": [h[0] for h in hardware]
    }
@router.get("/details")
async def get_benchmark_details(
    model: str,
    version: str,
    hardware: str
):

    db = SessionLocal()

    benchmark = db.query(Benchmark).filter(
        Benchmark.model == model,
        Benchmark.openvino_version == version,
        Benchmark.hardware == hardware
    ).first()

    db.close()

    if benchmark is None:
        return {
            "success": False,
            "message": "Benchmark not found"
        }

    return {
        "success": True,
        "benchmark": {
            "model": benchmark.model,
            "openvino_version": benchmark.openvino_version,
            "hardware": benchmark.hardware,
            "fps": benchmark.fps,
            "latency": benchmark.latency
        }
    }
@router.get("/stats")
async def get_stats():

    db = SessionLocal()

    total_benchmarks = db.query(Benchmark).count()

    total_models = db.query(
        Benchmark.model
    ).distinct().count()

    total_versions = db.query(
        Benchmark.openvino_version
    ).distinct().count()

    total_hardware = db.query(
        Benchmark.hardware
    ).distinct().count()

    db.close()

    return {
        "total_benchmarks": total_benchmarks,
        "total_models": total_models,
        "total_versions": total_versions,
        "total_hardware": total_hardware
    }
@router.get("/best-fps")
async def best_fps():

    db = SessionLocal()

    benchmark = (
        db.query(Benchmark)
        .filter(Benchmark.fps != None)
        .order_by(Benchmark.fps.desc())
        .first()
    )

    db.close()

    if benchmark is None:
        return {
            "success": False,
            "message": "No benchmarks found"
        }

    return {
        "success": True,
        "model": benchmark.model,
        "version": benchmark.openvino_version,
        "hardware": benchmark.hardware,
        "fps": benchmark.fps
    }
@router.get("/best-latency")
async def best_latency():

    db = SessionLocal()

    benchmark = (
    db.query(Benchmark)
    .filter(Benchmark.fps != None)
    .order_by(Benchmark.fps.desc())
    .first()
)

    if benchmark is None:
        return {
            "success": False,
            "message": "No benchmarks found"
        }

    return {
        "success": True,
        "model": benchmark.model,
        "version": benchmark.openvino_version,
        "hardware": benchmark.hardware,
        "latency": benchmark.latency
    }
@router.get("/model-summary/{model}")
async def model_summary(model: str):

    db = SessionLocal()

    benchmarks = (
    db.query(Benchmark)
    .filter(
        Benchmark.model == model,
        Benchmark.fps != None,
        Benchmark.latency != None
    )
    .all()
)

    if not benchmarks:
        db.close()

        return {
            "success": False,
            "message": "Model not found"
        }

    benchmark_count = len(benchmarks)

    best_fps = max(
        benchmarks,
        key=lambda x: x.fps
    )

    best_latency = min(
        benchmarks,
        key=lambda x: x.latency
    )

    db.close()

    return {
        "success": True,
        "model": model,
        "benchmark_count": benchmark_count,
        "best_fps": {
            "value": best_fps.fps,
            "version": best_fps.openvino_version,
            "hardware": best_fps.hardware
        },
        "best_latency": {
            "value": best_latency.latency,
            "version": best_latency.openvino_version,
            "hardware": best_latency.hardware
        }
    }
@router.get("/leaderboard")
async def leaderboard():

    db = SessionLocal()

    benchmarks = (
    db.query(Benchmark)
    .filter(Benchmark.fps != None)
    .order_by(Benchmark.fps.desc())
    .all()
)

    result = []

    rank = 1

    for benchmark in benchmarks:

        result.append(
            {
                "rank": rank,
                "model": benchmark.model,
                "version": benchmark.openvino_version,
                "hardware": benchmark.hardware,
                "fps": benchmark.fps,
                "latency": benchmark.latency
            }
        )

        rank += 1

    db.close()

    return {
        "count": len(result),
        "leaderboard": result
    }
@router.get("/model-leaderboard")
async def model_leaderboard():

    db = SessionLocal()

    benchmarks = (
    db.query(Benchmark)
    .filter(
        Benchmark.fps != None,
        Benchmark.latency != None
    )
    .all()
)
    best_models = {}

    for benchmark in benchmarks:

        model = benchmark.model

        if model not in best_models:
            best_models[model] = benchmark

        elif benchmark.fps > best_models[model].fps:
            best_models[model] = benchmark

    sorted_models = sorted(
        best_models.values(),
        key=lambda x: x.fps,
        reverse=True
    )

    result = []

    rank = 1

    for benchmark in sorted_models:

        result.append(
            {
                "rank": rank,
                "model": benchmark.model,
                "best_fps": benchmark.fps,
                "latency": benchmark.latency,
                "version": benchmark.openvino_version,
                "hardware": benchmark.hardware
            }
        )

        rank += 1

    db.close()

    return {
        "count": len(result),
        "leaderboard": result
    }
@router.get("/recommend/{model}")
async def recommend(model: str):

    db = SessionLocal()

    benchmarks = (
    db.query(Benchmark)
    .filter(
        Benchmark.model == model,
        Benchmark.fps != None,
        Benchmark.latency != None
    )
    .all()
)

    if not benchmarks:
        db.close()

        return {
            "success": False,
            "message": "Model not found"
        }

    best = max(
        benchmarks,
        key=lambda x: x.fps
    )

    db.close()

    return {
        "success": True,
        "model": model,
        "recommended_version": best.openvino_version,
        "recommended_hardware": best.hardware,
        "best_fps": best.fps,
        "latency": best.latency,
        "reason": "Highest FPS benchmark available"
    }
@router.get("/trends/{model}")
async def trends(model: str):

    db = SessionLocal()

    benchmarks = (
        db.query(Benchmark)
        .filter(
            Benchmark.model == model,
            Benchmark.fps != None,
            Benchmark.latency != None
        )
        .all()
    )

    if not benchmarks:
        db.close()

        return {
            "success": False,
            "message": "Model not found"
        }

    benchmarks = sorted(
        benchmarks,
        key=lambda x: x.openvino_version
    )

    trend_data = []

    for benchmark in benchmarks:

        trend_data.append(
            {
                "version": benchmark.openvino_version,
                "fps": benchmark.fps,
                "latency": benchmark.latency
            }
        )

    db.close()

    return {
        "success": True,
        "model": model,
        "trend": trend_data
    }
@router.get("/models-comparison")
async def models_comparison(
    model1: str = Query(...),
    model2: str = Query(...)
):

    db = SessionLocal()

    model1_benchmarks = (
        db.query(Benchmark)
        .filter(
            Benchmark.model == model1,
            Benchmark.fps != None,
            Benchmark.latency != None
        )
        .all()
    )

    model2_benchmarks = (
        db.query(Benchmark)
        .filter(
            Benchmark.model == model2,
            Benchmark.fps != None,
            Benchmark.latency != None
        )
        .all()
    )
    

    if not model1_benchmarks:
        db.close()

        return {
            "success": False,
            "message": f"{model1} not found"
        }

    if not model2_benchmarks:
        db.close()

        return {
            "success": False,
            "message": f"{model2} not found"
        }

    best_model1 = max(
        model1_benchmarks,
        key=lambda x: x.fps
    )

    best_model2 = max(
        model2_benchmarks,
        key=lambda x: x.fps
    )

    winner = (
        model1
        if best_model1.fps > best_model2.fps
        else model2
    )

    db.close()

    return {
        "success": True,
        "model1": {
            "name": model1,
            "best_fps": best_model1.fps,
            "latency": best_model1.latency
        },
        "model2": {
            "name": model2,
            "best_fps": best_model2.fps,
            "latency": best_model2.latency
        },
        "winner": winner
    }
@router.get("/export")
async def export_benchmarks():

    db = SessionLocal()

    benchmarks = db.query(Benchmark).all()

    result = []

    for item in benchmarks:

        result.append(
            {
                "model": item.model,
                "version": item.openvino_version,
                "hardware": item.hardware,
                "fps": item.fps,
                "latency": item.latency
            }
        )

    db.close()

    return JSONResponse(content=result)