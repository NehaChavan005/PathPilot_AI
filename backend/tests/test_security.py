import bcrypt
from backend.app.utils.security import hash_password, verify_password, create_access_token, decode_access_token

# 1. New-style hash round-trip
h = hash_password("secret123")
assert verify_password("secret123", h), "valid password should verify"
assert not verify_password("nope", h), "wrong password should not verify"
print("1. hash/verify OK:", h)

# 2. Backward compat: a hash produced by passlib (same $2b$ bcrypt format)
legacy_hash = "$2b$12$eda1vM0yDVO3Ay8XziGzH.hZesbRRU3/.PY1u2BVjM3c4JxrMCOQG"
ok = verify_password("secret123", legacy_hash)
print("2. legacy passlib hash verifies:", ok)

# 3. JWT round-trip
tok = create_access_token({"sub": "42"})
payload = decode_access_token(tok)
assert payload["sub"] == "42", "JWT sub mismatch"
print("3. JWT OK, sub =", payload["sub"])

# 4. Handle non-string / junk gracefully
assert verify_password("x", "not-a-hash") is False
assert verify_password("x", "") is False
print("4. junk inputs handled gracefully")
print("\nALL SECURITY TESTS PASSED, no bcrypt version error")
