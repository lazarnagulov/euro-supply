from locust import HttpUser, between, task
from locustfiles import warehouse_util
import random

class WarehouseTasks(HttpUser):
    wait_time = between(1, 5)
    host = "http://localhost:8080/api/v1"
    
    def on_start(self):

        response = self.client.post(
            "/auth/login",
            json={
                "username": "manager",
                "password": "pera"
            }
        )
        print(f"Login response: {response.status_code} - {response.text}")
        token = response.json()["token"]
        self.client.headers.update({
            "Authorization": f"Bearer {token}"
        })

    @task
    def search_warehouses(self):
        params = warehouse_util.build_warehouse_search_params()
        self.client.get("/warehouses/search", params=params)


    @task
    def get_sector_stats(self):
        warehouse_id = random.choice(list(warehouse_util.WAREHOUSE_SECTORS.keys()))
        sector_id = random.choice(warehouse_util.WAREHOUSE_SECTORS[warehouse_id])

        with self.client.get(
            f"/warehouses/{warehouse_id}/sector/{sector_id}",
            name="/warehouses/[id]/sector/[sectorId]",
            catch_response=True
        ) as response:
            
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed with status {response.status_code}")