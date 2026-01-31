import random
from locust import HttpUser, between, task
from locustfiles import util


class HttpClient(HttpUser):
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
    def get_distances(self):
        self.client.get(f"/vehicles/{ random.randint(1, util.MAX_VEHICLE_ID) }/distances")
    
    @task
    def search_vehicles(self):
        params = util.build_vehicle_search_params()
        self.client.get("/vehicles/search", params=params)