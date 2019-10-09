# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

"""
Trait types for html widgets.
"""

import traitlets
import datetime as dt


try:
    utc_tzinfo = dt.timezone.utc
except AttributeError:
    ZERO = dt.timedelta(0)

    # A UTC class.

    class UTC(dt.tzinfo):
        """UTC"""

        def utcoffset(self, dt):
            return ZERO

        def tzname(self, dt):
            return "UTC"

        def dst(self, dt):
            return ZERO

    utc_tzinfo = UTC()


class Time(traitlets.TraitType):
    """A trait type holding a Python date object"""

    klass = dt.date
    default_value = dt.time()


def time_to_json(pyt, manager):
    """Serialize a Python time object to json."""
    if pyt is None:
        return None
    else:
        return dict(
            hours=pyt.hour,  # Hours, Minutes, Seconds and Milliseconds
            minutes=pyt.minute,  # are plural in JS
            seconds=pyt.second,
            milliseconds=pyt.microsecond / 1000,
        )


def time_from_json(js, manager):
    """Deserialize a Python time object from json."""
    if js is None:
        return None
    else:
        return dt.time(
            js["hours"], js["minutes"], js["seconds"], js["milliseconds"] * 1000
        )


time_serialization = {"from_json": time_from_json, "to_json": time_to_json}


def datetime_to_json(pydt, manager):
    """Serialize a Python datetime object to json.

    Instantiating a JavaScript Date object with a string assumes that the
    string is a UTC string, while instantiating it with constructor arguments
    assumes that it's in local time:

    >>> cdate = new Date('2015-05-12')
    Mon May 11 2015 20:00:00 GMT-0400 (Eastern Daylight Time)
    >>> cdate = new Date(2015, 4, 12) // Months are 0-based indices in JS
    Tue May 12 2015 00:00:00 GMT-0400 (Eastern Daylight Time)

    Attributes of this dictionary are to be passed to the JavaScript Date
    constructor.
    """
    if pydt is None:
        return None
    else:
        try:
            utcdt = pydt.astimezone(utc_tzinfo)
        except (ValueError, OSError):
            # If year is outside valid range for conversion,
            # use it as-is
            utcdt = pydt
        return dict(
            year=utcdt.year,
            month=utcdt.month - 1,  # Months are 0-based indices in JS
            date=utcdt.day,
            hours=utcdt.hour,  # Hours, Minutes, Seconds and Milliseconds
            minutes=utcdt.minute,  # are plural in JS
            seconds=utcdt.second,
            milliseconds=utcdt.microsecond / 1000,
        )


def datetime_from_json(js, manager):
    """Deserialize a Python datetime object from json."""
    if js is None:
        return None
    else:
        try:
            return dt.datetime(
                js["year"],
                js["month"] + 1,  # Months are 1-based in Python
                js["date"],
                js["hours"],
                js["minutes"],
                js["seconds"],
                js["milliseconds"] * 1000,
                utc_tzinfo,
            ).astimezone()
        except (ValueError, OSError):
            # If year is outside valid range for conversion,
            # return naive datetime
            return dt.datetime(
                js["year"],
                js["month"] + 1,  # Months are 1-based in Python
                js["date"],
                js["hours"],
                js["minutes"],
                js["seconds"],
                js["milliseconds"] * 1000,
                utc_tzinfo,
            )


datetime_serialization = {"from_json": datetime_from_json, "to_json": datetime_to_json}
