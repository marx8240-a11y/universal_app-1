from pwdlib import PasswordHash

password_hash  = PasswordHash.recommended()

def hash_password(plain_pass :str ) -> str:
    return password_hash.hash(plain_pass)

def verify_passsword(plain_pass :str , hashed_pass :str) -> bool:
    return password_hash.verify(plain_pass , hashed_pass)