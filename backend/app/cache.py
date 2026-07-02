import time
from functools import wraps
from typing import Any, Callable, Optional


class TTLCache:
    """Simple in-memory TTL cache — one entry per composite key."""

    def __init__(self, default_ttl: int = 300):
        self._store: dict[str, tuple[float, Any]] = {}
        self.default_ttl = default_ttl

    def _key(self, *args, **kwargs) -> str:
        return f"{args}:{sorted(kwargs.items())}"

    def get(self, key: str) -> Optional[Any]:
        expires_at, value = self._store.get(key, (0, None))
        if time.time() < expires_at:
            return value
        if key in self._store:
            del self._store[key]
        return None

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        self._store[key] = (time.time() + (ttl or self.default_ttl), value)

    def invalidate(self, pattern: Optional[str] = None) -> None:
        if pattern is None:
            self._store.clear()
        else:
            self._store = {k: v for k, v in self._store.items() if pattern not in k}

    def cached(self, ttl: Optional[int] = None) -> Callable:
        """Decorator: cache the return value of a sync function."""
        def decorator(fn: Callable) -> Callable:
            @wraps(fn)
            def wrapper(*args, **kwargs):
                key = self._key(fn.__name__, *args, **kwargs)
                hit = self.get(key)
                if hit is not None:
                    return hit
                result = fn(*args, **kwargs)
                self.set(key, result, ttl)
                return result
            return wrapper
        return decorator


course_cache = TTLCache(default_ttl=300)
program_cache = TTLCache(default_ttl=600)
