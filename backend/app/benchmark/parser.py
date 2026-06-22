import re


def parse_report(report: str):
    fps_match = re.search(
        r"Throughput:\s*([\d.]+)\s*FPS",
        report,
        re.IGNORECASE
    )

    latency_match = re.search(
        r"Average latency:\s*([\d.]+)\s*ms",
        report,
        re.IGNORECASE
    )

    return {
        "fps": float(fps_match.group(1))
        if fps_match else None,

        "latency": float(latency_match.group(1))
        if latency_match else None
    }