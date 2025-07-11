from passlib.context import CryptContext

pwd_cxt = CryptContext(
    schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12, bcrypt__ident="2b"
)


class Hashing:
    @staticmethod
    def bcrypt(password: str):
        return pwd_cxt.hash(password)

    @staticmethod
    def verify(hashed_password, plain_password):
        return pwd_cxt.verify(plain_password, hashed_password)
