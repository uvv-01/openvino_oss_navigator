def compare_benchmarks(old_data, new_data):

    old_fps = old_data["fps"]
    new_fps = new_data["fps"]

    old_latency = old_data["latency"]
    new_latency = new_data["latency"]

    if old_fps == 0:
        fps_change = 0
    else:
        fps_change = (
            (new_fps - old_fps) / old_fps * 100
        )

    if old_latency == 0:
        latency_change = 0
    else:
        latency_change = (
            (new_latency - old_latency)
            / old_latency
            * 100
        )

    if fps_change > 0 and latency_change < 0:
        status = "Improved"

    elif fps_change < 0 and latency_change > 0:
        status = "Regressed"

    else:
        status = "Mixed"

    return {
        "fps_change": round(fps_change, 2),
        "latency_change": round(latency_change, 2),
        "status": status
    }