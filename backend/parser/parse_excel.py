import os
import json
import pandas as pd

# -----------------------------
# File Paths
# -----------------------------
BASE_DIR = os.path.dirname(__file__)

EXCEL_PATH = os.path.abspath(
    os.path.join(
        BASE_DIR,
        "..",
        "data",
        "OV-2024.6-Performance-Data.xlsx"
    )
)

OUTPUT_PATH = os.path.abspath(
    os.path.join(
        BASE_DIR,
        "..",
        "data",
        "benchmarks.json"
    )
)

# -----------------------------
# Read Excel
# -----------------------------
df = pd.read_excel(
    EXCEL_PATH,
    sheet_name="Performance Tables  CPU",
    header=None
)

benchmarks = []

# -----------------------------
# Find every hardware block
# -----------------------------
header_rows = []

for i in range(len(df)):
    if str(df.iloc[i, 0]).strip() == "Model name":
        header_rows.append(i)

print(f"Found {len(header_rows)} hardware sections")

# -----------------------------
# Parse every section
# -----------------------------
for idx, start in enumerate(header_rows):

    hardware = str(df.iloc[start, 4]).strip()

    # Ignore fake sections
    if hardware == "" or hardware == "nan":
        continue

    if hardware.upper() == "INT8":
        continue

    # Determine end of current block
    if idx == len(header_rows) - 1:
        end = len(df)
    else:
        end = header_rows[idx + 1]

    # Models begin after header row
    for row in range(start + 1, end):

        model = str(df.iloc[row, 0]).strip()

        if model == "" or model == "nan":
            continue

        fp32 = df.iloc[row, 1]
        int8 = df.iloc[row, 2]
        latency = df.iloc[row, 3]

        record = {
            "hardware": hardware,
            "model": model,
            "fp32": None if pd.isna(fp32) else float(fp32),
            "int8": None if pd.isna(int8) else float(int8),
            "latency": None if pd.isna(latency) else float(latency)
        }

        benchmarks.append(record)

# -----------------------------
# Save JSON
# -----------------------------
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(benchmarks, f, indent=4)

print()
print("=" * 50)
print("Parsing Complete")
print(f"Records: {len(benchmarks)}")
print(f"Saved to: {OUTPUT_PATH}")
print("=" * 50)