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