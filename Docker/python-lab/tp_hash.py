
import hashlib, bcrypt

# SHA256
hash_sha256 = hashlib.sha256(b'password123').hexdigest()
print("SHA256:", hash_sha256)

# bcrypt
salt = bcrypt.gensalt()
hash_bcrypt = bcrypt.hashpw(b'password123', salt)
print("bcrypt:", hash_bcrypt)
