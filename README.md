# OpenVINO OSS Navigator

OpenVINO OSS Navigator is a web application built to explore, compare, and analyze OpenVINO benchmark results. Instead of manually looking through benchmark reports, the application organizes everything into an interactive dashboard where users can compare models, OpenVINO versions, hardware, and performance metrics.

The project uses a FastAPI backend for data processing and a Next.js frontend for visualization.

---

## Features

### Dashboard
- View overall benchmark statistics
- Total benchmarks, models, versions, and hardware
- Quick overview of the highest-performing benchmarks

### Benchmark Explorer
- Browse benchmarks by model
- Select OpenVINO version and hardware
- View FPS and latency for any benchmark

### Model Comparison
- Compare two different models
- View their best FPS and latency
- Identify the better-performing model

### Version Comparison
- Compare benchmark results between two OpenVINO releases
- View FPS improvements and latency differences
- Percentage-based performance comparison

### Leaderboard
- Displays the best benchmark available for each model
- Ranked by FPS

### Performance Trends
- Visualize FPS trends across OpenVINO releases
- Interactive charts using Recharts

### Recommendations
- Suggests the best OpenVINO version for a selected model based on benchmark performance

### Export
- Export benchmark data in JSON format

---

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Recharts

### Backend
- FastAPI
- SQLAlchemy
- SQLite

---

## Project Structure

```
OpenVINO_OSS_Navigator
│
├── backend
│   ├── app
│   ├── parser
│   └── database
│
├── frontend
│   ├── app
│   ├── components
│   ├── libs
│   └── public
│
└── README.md
```

---

## Running the Project

### Clone the repository

```bash
git clone https://github.com/uvv-01/openvino_oss_navigator.git
cd openvino_oss_navigator
```

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## Main API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/benchmark/stats` | Dashboard statistics |
| `/benchmark/models` | List available models |
| `/benchmark/details` | Benchmark details |
| `/benchmark/version-compare` | Compare OpenVINO versions |
| `/benchmark/models-comparison` | Compare models |
| `/benchmark/trends/{model}` | Performance trends |
| `/benchmark/recommend/{model}` | Best version recommendation |
| `/benchmark/model-leaderboard` | Model leaderboard |
| `/benchmark/export` | Export benchmark data |

---

## Screenshots

Screenshots of the dashboard and different modules will be added after deployment.

---

## Future Improvements

Some ideas for future development:

- CSV/Excel export
- Search and filtering
- User authentication
- More detailed analytics
- Cloud deployment

---

## Author

**Yuvraj Singh**

B.Tech Ece  Student

GitHub: https://github.com/uvv-01

---

This project was built as a learning project to gain hands-on experience with FastAPI, Next.js, REST APIs, SQLAlchemy, and data visualization while working with OpenVINO benchmark data.
