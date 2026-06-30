import pandas as pd

EXCEL_FILE = "data/OV-2024.6-Performance-Data.xlsx"

df = pd.read_excel(
    EXCEL_FILE,
    sheet_name="Performance Tables GPU, NPU",
    header=None
).fillna("")

pd.set_option("display.max_columns", None)
pd.set_option("display.width", None)

print(df.head(40))