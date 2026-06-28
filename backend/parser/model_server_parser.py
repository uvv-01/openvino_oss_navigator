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


def parse_model_server(db):

    df = pd.read_excel(
        EXCEL_FILE,
        sheet_name="OpenVINO Model Server. Perf. Ta",
        header=None
    ).fillna("")

    current_model = ""
    current_precision = ""

    for i in range(len(df)):

        row = df.iloc[i]

        # Detect model header
        if str(row[1]).startswith("Model:"):

            text = str(row[1])

            try:
                current_model = (
                    text.split("Model:")[1]
                    .split(",")[0]
                    .strip()
                )
            except:
                current_model = ""

            try:
                current_precision = (
                    text.split("Precision:")[1]
                    .strip()
                )
            except:
                current_precision = ""

            continue

        # Skip header row
        if str(row[0]).startswith("Server Platform"):
            continue

        hardware = str(row[0]).strip()

        if hardware == "":
            continue

        if hardware.startswith("Test date"):
            continue

        if hardware.startswith("Model:"):
            continue

        fps = to_float(row[1])

        benchmark = Benchmark(
            openvino_version="2024.6",
            model=current_model,
            hardware=hardware,
            precision=current_precision,
            fps=fps,
            latency=None
        )

        db.add(benchmark)

    print("✅ Model Server parser finished")