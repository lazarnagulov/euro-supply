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
    def get_warehouse(self):
        self.client.get(f"/warehouses/{ random.randint(1, warehouse_util.MAX_WAREHOUSE_ID) }")

    @task
    def get_warehouse_status(self):
        warehouse_id = warehouse_util.random_warehouse_id()
        self.client.get(f"/warehouses/{warehouse_id}/status")
