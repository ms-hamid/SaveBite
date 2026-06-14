"""
app/utils/haversine.py
=======================
Haversine formula implementation.
Computes the great-circle distance (km) between two GPS coordinates.

Used by the geo-query service to filter surplus listings within a radius.
"""

import math


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Return the distance in kilometres between two GPS points.

    Args:
        lat1, lon1: Latitude/longitude of point A (degrees)
        lat2, lon2: Latitude/longitude of point B (degrees)

    Returns:
        Distance in kilometres (float)
    """
    R = 6371.0  # Earth radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
