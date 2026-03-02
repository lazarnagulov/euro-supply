# locustfiles/manager_tasks.py
from locust import HttpUser, between, task
from locustfiles import manager_util
from locustfiles import util


class ManagerTasks(HttpUser):
    wait_time = between(1, 5)
    host = "http://localhost:8080/api/v1"

    def on_start(self):
        token = util.get_auth_token(self.client, "admin", "pera")
        self.client.headers.update({
            "Authorization": f"Bearer {token}"
        })

    @task
    def search_managers(self):
        params = manager_util.build_manager_search_params()
        self.client.get("/users/managers", params=params)