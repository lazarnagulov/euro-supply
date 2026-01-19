import random
from locust import HttpUser, between, task

MAX_COUNTRY_ID = 47

class HttpClient(HttpUser):
    wait_time = between(1, 5)
    host = "http://localhost:8080/api/v1"
    
    @task
    def get_counties(self):
        self.client.get("/countries")
    
    @task
    def get_cities(self):
        self.client.get(f"/countries/{ random.randint(1, MAX_COUNTRY_ID) }/cities")