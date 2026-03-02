from locust import HttpUser, between, task

import util

class CategoryTasks(HttpUser):
    wait_time = between(1, 5)
    host = "http://localhost:8080/api/v1"

    def on_start(self):
        token = util.get_auth_token(self.client, "manager", "pera")
        self.client.headers.update({
            "Authorization": f"Bearer {token}"
        })

    @task
    def get_categories(self):
        self.client.get("/categories")