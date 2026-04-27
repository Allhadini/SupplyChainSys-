from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import math

app = FastAPI()

class Location(BaseModel):
    lat: float
    long: float

class RiskRequest(BaseModel):
    location: Location
    route: Optional[List[Any]] = []
    conditions: Optional[Dict[str, Any]] = {}

@app.post("/api/risk-score")
def compute_risk_score(req: RiskRequest):
    # Simulated Mock AI Engine
    seed = abs(math.sin(req.location.lat * 12.9898 + req.location.long * 78.233) * 43758.5453)
    base_risk = seed - math.floor(seed)
    
    route_complexity = min(len(req.route) * 0.03, 0.15)
    risk_score = round(min(base_risk + route_complexity, 1.0), 2)
    
    reasons = [
        'Weather disruption + congestion detected',
        'Port congestion at destination hub',
        'Geopolitical risk in transit corridor',
        'Seasonal demand surge causing delays',
        'Carrier capacity constraints observed',
        'Low risk — smooth transit expected',
    ]
    
    if risk_score > 0.8: return {"riskScore": risk_score, "reason": reasons[0]}
    elif risk_score > 0.7: return {"riskScore": risk_score, "reason": reasons[1]}
    elif risk_score > 0.5: return {"riskScore": risk_score, "reason": reasons[2]}
    elif risk_score > 0.3: return {"riskScore": risk_score, "reason": reasons[3]}
    elif risk_score > 0.15: return {"riskScore": risk_score, "reason": reasons[4]}
    else: return {"riskScore": risk_score, "reason": reasons[5]}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
