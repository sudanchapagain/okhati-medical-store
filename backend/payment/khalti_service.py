import os

import requests

KHALTI_SECRET_KEY = os.getenv("KHALTI_SECRET_KEY")
KHALTI_BASE_URL = os.getenv("KHALTI_BASE_URL")


class KhaltiService:
    @staticmethod
    def initiate_payment(payload: dict) -> dict:
        url = f"{KHALTI_BASE_URL}/epayment/initiate/"
        headers = {
            "Authorization": f"key {KHALTI_SECRET_KEY}",
            "Content-Type": "application/json",
        }
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def lookup_payment(pidx: str) -> dict:
        url = f"{KHALTI_BASE_URL}/epayment/lookup/"
        headers = {
            "Authorization": f"key {KHALTI_SECRET_KEY}",
            "Content-Type": "application/json",
        }
        response = requests.post(url, json={"pidx": pidx}, headers=headers, timeout=15)
        response.raise_for_status()
        return response.json()
