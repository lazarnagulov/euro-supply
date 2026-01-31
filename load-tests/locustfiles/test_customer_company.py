import random
from locust import HttpUser, between, task

from locustfiles import util


class CustomerCompanyTasks(HttpUser):
    wait_time = between(1, 5)
    host = "http://localhost:8080/api/v1"
    
    def on_start(self):
        token = util.get_auth_token(self.client, "customer", "pera")
        self.client.headers.update({
            "Authorization": f"Bearer {token}"
        })
    
    @task
    def get_my_companies(self):
        self.client.patch(f"/companies/my")