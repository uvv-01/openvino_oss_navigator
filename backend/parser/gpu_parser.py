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


def parse_gpu(db):

    df = pd.read_excel(
        EXCEL_FILE,
        sheet_name="Performance Tables GPU, NPU",
        header=None
    ).fillna("")

    current_hardware = ""

    for i in range(len(df)):

        row = df.iloc[i]

        # New hardware block
        if str(row[0]).strip() == "Model name:":
            current_hardware = str(row[4]).strip()
            continue

        model = str(row[0]).strip()

        if model == "":
            continue

        if model == "Model name:":
            continue

        if model.startswith("Test Date"):
            continue

        fp16 = to_float(row[1])
        int8 = to_float(row[2])
        latency = to_float(row[3])

        benchmark = Benchmark(
            openvino_version="2024.6",
            model=model,
            hardware=current_hardware,
            precision="GPU/NPU",
            fps=int8 if int8 else fp16,
            latency=latency
        )

        db.add(benchmark)

    print("GPU parser finished")