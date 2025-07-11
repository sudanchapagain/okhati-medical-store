#!/usr/bin/env python3
import asyncio
import os

import httpx
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
BUCKET_NAME = "uploads"


async def create_bucket():
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        print("missing configuration in .env file")
        print("set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
        return False

    url = f"{SUPABASE_URL}/storage/v1/bucket"
    headers = {
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "id": BUCKET_NAME,
        "name": BUCKET_NAME,
        "public": True,
        "file_size_limit": 5242880,
        "allowed_mime_types": [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ],
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers)

            if response.status_code == 200:
                print(f"successfully created bucket '{BUCKET_NAME}'")
                return True
            elif response.status_code == 409:
                print(f"bucket '{BUCKET_NAME}' already exists")
                return True
            else:
                print(f"failed to create bucket: {response.status_code}")
                print(f"response: {response.text}")
                return False

        except Exception as e:
            print(f"error creating bucket: {str(e)}")
            return False


async def main():
    success = await create_bucket()

    if success:
        print("\nSetup complete!")
        print(f"your uploads will be stored in the '{BUCKET_NAME}' bucket")
        print(
            f"public URL format: {SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{{filename}}"
        )
    else:
        print("\nsetup failed. please check your configuration.")


if __name__ == "__main__":
    asyncio.run(main())
