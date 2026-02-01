from datetime import datetime, timedelta, timezone
import random
from locust import HttpUser, between, task
from locustfiles import util

class VehicleTasks(HttpUser):
    wait_time = between(1, 5)
    host = "http://localhost:8080/api/v1"
    
    def on_start(self):
        token = util.get_auth_token(self.client, "manager", "pera")
        self.client.headers.update({
            "Authorization": f"Bearer {token}"
        })
    
    @task
    def get_vehicle(self):
        self.client.get(f"/vehicles/{ random.randint(1, util.MAX_VEHICLE_ID) }")

    @task
    def get_vehicle(self):
        self.client.get(f"/vehicles/{ random.randint(1, util.MAX_VEHICLE_ID) }/location")
   
    @task
    def get_distances(self):
        vehicle_id = random.randint(1, 100)

        now = datetime.now(timezone.utc)

        ranges = [
            timedelta(days=7),
            timedelta(days=30),
            timedelta(days=90),
            timedelta(days=180),
            timedelta(days=365),
        ]

        delta = random.choice(ranges)
        start = now - delta

        params = {
            "start": start.isoformat(),
            "end": now.isoformat()
        }

        self.client.get(
            f"/vehicles/{vehicle_id}/distances",
            params=params
        )
    
    @task
    def get_brands(self):
        self.client.get("/vehicles/brands")

    @task
    def get_models(self):
        self.client.get(f"/vehicles/brands/{random.randint(1, util.MAX_VEHICLE_BRAND_ID)}/models")
    
    @task
    def search_vehicles(self):
        params = util.build_vehicle_search_params()
        self.client.get("/vehicles/search", params=params)