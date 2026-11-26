"""
Canonical timestamp normalization and timezone conversion.
Converts UTC timestamps to America/Los_Angeles local time to derive
accurate calendar attributes, local hour, and day-of-week dimensions.
"""

from datetime import datetime, timezone
import zoneinfo
from typing import Tuple, Dict, Any

LA_TZ = zoneinfo.ZoneInfo("America/Los_Angeles")


def parse_timestamp_utc(ts_input: Any) -> datetime:
    """Parse various timestamp representations into a canonical UTC datetime."""
    if isinstance(ts_input, datetime):
        if ts_input.tzinfo is None:
            return ts_input.replace(tzinfo=timezone.utc)
        return ts_input.astimezone(timezone.utc)
    
    if isinstance(ts_input, (int, float)):
        # If timestamp is in milliseconds (typical if > 1e11)
        if ts_input > 1e11:
            ts_input = ts_input / 1000.0
        return datetime.fromtimestamp(ts_input, tz=timezone.utc)
    
    if isinstance(ts_input, str):
        # Clean potential ISO formatting
        clean_str = ts_input.replace("Z", "+00:00")
        try:
            dt = datetime.fromisoformat(clean_str)
            if dt.tzinfo is None:
                return dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc)
        except ValueError:
            # Fallback for standard SQL datetime format YYYY-MM-DD HH:MM:SS
            dt = datetime.strptime(clean_str[:19], "%Y-%m-%d %H:%M:%S")
            return dt.replace(tzinfo=timezone.utc)
            
    raise ValueError(f"Unable to parse timestamp: {ts_input}")


def to_la_local_time(dt_utc: datetime) -> datetime:
    """Convert UTC datetime to America/Los_Angeles local datetime."""
    return dt_utc.astimezone(LA_TZ)


def extract_temporal_dimensions(dt_utc: datetime) -> Dict[str, Any]:
    """
    Extract canonical local calendar dimensions:
    - local_iso: ISO 8601 string in LA timezone
    - utc_iso: ISO 8601 string in UTC
    - date_str: YYYY-MM-DD in LA local time
    - hour: 0-23 in LA local time
    - day_of_week: 0=Monday, ..., 6=Sunday in Python convention
    - day_type: 'weekday' (Mon-Fri) or 'weekend' (Sat-Sun)
    """
    dt_la = to_la_local_time(dt_utc)
    dow = dt_la.weekday() # 0 = Monday, 6 = Sunday
    is_weekend = dow >= 5 # 5 = Saturday, 6 = Sunday
    
    return {
        "utc_iso": dt_utc.isoformat(),
        "local_iso": dt_la.isoformat(),
        "date_str": dt_la.strftime("%Y-%m-%d"),
        "hour": dt_la.hour,
        "day_of_week": dow,
        "day_name": dt_la.strftime("%A"),
        "day_type": "weekend" if is_weekend else "weekday",
    }
