import base64
import os
import uuid
from pathlib import Path
from typing import Optional

import httpx
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
BUCKET_NAME = "uploads"

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024


def is_allowed_file(filename: str) -> bool:
    """check if the file extension is allowed."""
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


async def upload_to_supabase(
    file_content: bytes, filename: str, content_type: str
) -> Optional[str]:
    """upload file to supabase Storage and return the public URL."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(status_code=500, detail="supabase configuration missing")

    file_extension = Path(filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"

    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{unique_filename}"

    headers = {
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": content_type,
        "x-upsert": "true",
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, content=file_content, headers=headers)

        if response.status_code not in [200, 201]:
            print(f"supabase upload failed: {response.status_code} - {response.text}")
            return None

    public_url = (
        f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{unique_filename}"
    )
    return public_url


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a single file to Supabase Storage."""
    try:
        if not is_allowed_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}",
            )

        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {MAX_FILE_SIZE // (1024*1024)}MB",
            )

        public_url = await upload_to_supabase(
            file_content=file_content,
            filename=file.filename,
            content_type=file.content_type or "application/octet-stream",
        )

        if not public_url:
            raise HTTPException(
                status_code=500, detail="Failed to upload file to storage"
            )

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "url": public_url,
                "filename": file.filename,
                "size": len(file_content),
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.delete("/upload/{filename}")
async def delete_file(filename: str):
    """Delete a file from Supabase Storage."""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(
                status_code=500, detail="Supabase configuration missing"
            )

        url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{filename}"
        headers = {
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        }

        async with httpx.AsyncClient() as client:
            response = await client.delete(url, headers=headers)

            if response.status_code == 200:
                return {"success": True, "message": "File deleted successfully"}
            else:
                raise HTTPException(
                    status_code=404, detail="File not found or could not be deleted"
                )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")
