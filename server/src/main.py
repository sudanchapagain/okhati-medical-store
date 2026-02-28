from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import jwt, JWTError

import httpx
from datetime import datetime, timedelta

app = FastAPI()

GOOGLE_CLIENT_ID = ""
JWT_SECRET = ""
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60


class GoogleToken(BaseModel):
    id_token: str


async def verify_google_token(id_token: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get("https://www.googleapis.com/oauth2/v3/certs")
        keys = resp.json()

    try:
        unverified_header = jwt.get_unverified_header(id_token)
        key = next(k for k in keys["keys"] if k["kid"] == unverified_header["kid"])

        payload = jwt.decode(
            id_token,
            key,
            algorithms=["RS256"],
            audience=GOOGLE_CLIENT_ID,
            issuer="https://accounts.google.com",
        )
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


@app.post("/auth/google")
async def google_auth(token: GoogleToken):
    payload = await verify_google_token(token.id_token)

    user_email = payload.get("email")
    if not user_email:
        raise HTTPException(status_code=400, detail="Email not available")
    # TODO
