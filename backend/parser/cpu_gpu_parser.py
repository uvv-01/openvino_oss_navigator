import pandas as pd

from app.database.benchmark_model import Benchmark

EXCEL_FILE = "data/OV-2024.6-Performance-Data.xlsx"


def to_float(value):
    try:
        if value == "" or pd.isna(value):
            return None
        return float(value)
    except:
        return None


def parse_cpu_gpu(db):

    df = pd.read_excel(
        EXCEL_FILE,
        sheet_name="Performance Tables CPU+GPU",
        header=None
    ).fillna("")

    current_hardware = ""

    for i in range(len(df)):

        row = df.iloc[i]

        if str(row[0]) == "Model name":
            current_hardware = row[4]
            continue

        model = str(row[0]).strip()

        if model == "":
            continue

        if model == "Model name":
            continue

        if model.startswith("Test Date"):
            continue

        fp32 = to_float(row[1])
        int8 = to_float(row[2])
        latency = to_float(row[3])

        fps = int8 if int8 is not None else fp32

        benchmark = Benchmark(
            openvino_version="2024.6",
            model=model,
            hardware=current_hardware,
            fps=fps,
            latency=latency,
        )

        db.add(benchmark)

    print("✅  CPU+GPU parser finished")