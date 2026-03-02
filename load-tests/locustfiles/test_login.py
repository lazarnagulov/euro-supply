import random
from locust import HttpUser, between, task


class LoginTasks(HttpUser):
    wait_time = between(1, 3)
    host = "http://localhost:8080/api/v1"

    @task(2)
    def login_customer_valid(self):
        # Always valid - within the existing range 1 - 2,000,000.
        username = f"customer_{random.randint(1, 2000000)}"
        with self.client.post(
            "/auth/login",
            json={"username": username, "password": "pera"},
            catch_response=True,
            name=f"/auth/login/ [CUSTOMER - VALID]"
        ) as response:
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "expiresIn" in data:
                    response.success()
                else:
                    response.failure("Response missing token or expiresIn")
            else:
                response.failure(f"Expected 200, got {response.status_code}")

    @task(1)
    def login_customer_invalid(self):
        # Always invalid - outside the existing range.
        username = f"customer_{random.randint(2000001, 3000000)}"
        with self.client.post(
            "/auth/login",
            json={"username": username, "password": "pera"},
            catch_response=True,
            name=f"/auth/login/[CUSTOMER - INVALID]"
        ) as response:
            if response.status_code == 401:
                response.success()
            else:
                response.failure(f"Expected 401, got {response.status_code}")

    @task(2)
    def login_manager_valid(self):
        # Always valid - within the existing range 1 - 1,000,000.
        username = f"manager_{random.randint(1, 1000000)}"
        with self.client.post(
            "/auth/login",
            json={"username": username, "password": "pera"},
            catch_response=True,
            name=f"/auth/login/ [MANAGER - VALID]"
        ) as response:
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "expiresIn" in data:
                    response.success()
                else:
                    response.failure("Response missing token or expiresIn")
            else:
                response.failure(f"Expected 200, got {response.status_code}")

    @task(1)
    def login_manager_invalid(self):
        # Always invalid - outside the existing range.
        username = f"manager_{random.randint(1000001, 1500000)}"
        with self.client.post(
            "/auth/login",
            json={"username": username, "password": "pera"},
            catch_response=True,
            name=f"/auth/login/ [MANAGER - INVALID]"
        ) as response:
            if response.status_code == 401:
                response.success()
            else:
                response.failure(f"Expected 401, got {response.status_code}")