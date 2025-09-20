# utils.py
from datetime import datetime, timedelta
from models import WaterReading
import math

def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two points using Haversine formula.
    """
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance

def calculate_eta(distance):
    """
    Calculate estimated time of arrival in minutes (assume 40 km/h speed).
    """
    speed = 40  # km/h
    time_hours = distance / speed
    return time_hours * 60  # minutes

def detect_leak(user_id, threshold=5.0):
    """
    Detect potential leaks based on anomalous consumption.
    """
    now = datetime.utcnow()
    last_24h = now - timedelta(hours=24)
    readings = WaterReading.query.filter(
        WaterReading.user_id == user_id,
        WaterReading.timestamp >= last_24h
    ).order_by(WaterReading.timestamp).all()
    
    if len(readings) < 2:
        return False, 'Insufficient data for leak detection', 0.0
    
    overnight_usage = 0.0
    for i in range(1, len(readings)):
        time_diff = (readings[i].timestamp - readings[i-1].timestamp).total_seconds() / 3600
        usage = readings[i].reading - readings[i-1].reading
        hour = readings[i].timestamp.hour
        if 0 <= hour < 6 and usage > threshold * time_diff:
            overnight_usage += usage
    
    if overnight_usage > threshold * 6:  # Assuming 6 hours overnight
        return True, f"Potential leak detected: High overnight usage ({overnight_usage:.2f} units)", overnight_usage
    return False, 'No leak detected', 0.0

def get_severity(loss):
    """
    Get severity and description based on loss.
    """
    if loss < 10:
        return 'minor', 'sporadic drops'
    elif loss < 50:
        return 'moderate', 'unusual flow'
    else:
        return 'severe', 'major leak'

def get_consumption_reports(user_id, period='daily'):
    """
    Generate consumption reports for specified period.
    """
    now = datetime.utcnow()
    if period == 'daily':
        start = now - timedelta(days=1)
        divisor = 1
    elif period == 'weekly':
        start = now - timedelta(weeks=1)
        divisor = 7
    elif period == 'monthly':
        start = now - timedelta(days=30)
        divisor = 30
    else:
        return {'error': 'Invalid period'}
    
    readings = WaterReading.query.filter(
        WaterReading.user_id == user_id,
        WaterReading.timestamp >= start
    ).order_by(WaterReading.timestamp).all()
    
    if not readings:
        return {'total': 0, 'average': 0}
    
    total = readings[-1].reading - readings[0].reading
    average = total / divisor
    return {'total': total, 'average': average}