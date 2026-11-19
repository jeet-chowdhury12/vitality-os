# Vitality-OS AI Backend Service (Python / FastAPI)

## Overview
This Python microservice provides machine learning prediction algorithms for:
1. **AI Appointment Scheduler & No-Show Predictor**: Sigmoid-calibrated multi-variable classification evaluating commute distances, lead times, historical cancellations, and weather impact.
2. **Pre-Hospital Clinic Sense Triage**: Algorithmic pre-evaluation routing to cut ER overcrowding.

## Setup & Running Locally

1. Create a Python virtual environment:
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI dev server:
```bash
uvicorn main:app --reload --port 8000
```

4. Interactive Swagger API Documentation:
Open browser at: `http://localhost:8000/docs`
