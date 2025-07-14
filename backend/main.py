import os

import uvicorn
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import authrouter
from config.database import Base, engine
from order import orderrouter
from payment.paymentsrouter import router as paymentsrouter
from product import productrouter
from review import reviewrouter
from upload.uploadrouter import router as uploadrouter
from users import usersrouter

app = FastAPI()

origins = [
    "http://localhost:80" "http://localhost:3000",
    "http://localhost:5173",
    "https://okhati.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


app.include_router(authrouter.router, prefix="/api")
app.include_router(usersrouter.router, prefix="/api")
app.include_router(reviewrouter.router, prefix="/api")
app.include_router(productrouter.router, prefix="/api")
app.include_router(orderrouter.router, prefix="/api")
app.include_router(paymentsrouter, prefix="/api")
app.include_router(uploadrouter, prefix="/api")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    reload = os.getenv("ENVIRONMENT") == "development"

    uvicorn.run("main:app", port=port, reload=reload)
