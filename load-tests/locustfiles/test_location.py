import random
from locust import HttpUser, between, task

from locustfiles import util


class LocationTasks(HttpUser):
    wait_time = between(1, 5)
    host = "http://localhost:8080/api/v1"
    
    def on_start(self):
        token = util.get_auth_token(self.client, "manager", "pera")
        self.client.headers.update({
            "Authorization": f"Bearer {token}"
        })
    
    @task
    def get_counties(self):
        self.client.get("/countries")
    
    @task
    def get_cities(self):
        self.client.get(f"/countries/{ random.randint(1, util.MAX_COUNTRY_ID) }/cities")