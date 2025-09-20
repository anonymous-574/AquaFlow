# gen_key.py
import secrets

# Generate SECRET_KEY
print("SECRET_KEY:", secrets.token_hex(32))

# Generate JWT_SECRET_KEY
print("JWT_SECRET_KEY:", secrets.token_hex(32))