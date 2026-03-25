# backend/app/core/errors.py

class RideNotFoundError(Exception):
    pass

class RidePermissionError(Exception):
    pass

class RideFullError(Exception):
    pass

class RideAlreadyJoinedError(Exception):
    pass

class RideMatchCriteriaError(Exception):
    pass