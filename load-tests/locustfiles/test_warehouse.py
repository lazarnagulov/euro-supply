from locust import HttpUser, between, task
from locustfiles import util

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
        params = util.build_warehouse_search_params()
        self.client.get("/warehouses/search", params=params)