import random
import json
from locust import HttpUser, between, task


class RegistrationTasks(HttpUser):
    wait_time = between(1, 3)
    host = "http://localhost:8080/api/v1"

    def _build_dto(self, user_id, email=None, password=None, password_confirmation=None):
        email = email or f"user{user_id}@example.com"
        password = password or "pera1234"
        password_confirmation = password_confirmation or password
        return {
            "email": email,
            "username": f"user_{user_id}",
            "password": password,
            "passwordConfirmation": password_confirmation,
            "person": {
                "firstname": "Test",
                "lastname": "User",
                "phoneNumber": f"+38160{random.randint(1000000, 9999999)}"
            }
        }

    @task(7)
    def register_valid(self):
        user_id = random.randint(1, 9999999)
        with self.client.post(
            "/users/registration",
            json=self._build_dto(user_id),
            catch_response=True,
            name=f"/users/registration [VALID]"
        ) as response:
            if response.status_code == 201:
                data = response.json()
                if "id" in data:
                    response.success()
                else:
                    response.failure("Response missing required fields")
            else:
                response.failure(f"Expected 201, got {response.status_code}")

    @task(2)
    def register_duplicate(self):
        email_prefix, username_prefix = "customer", "customer_"

        user_id = random.randint(1, 2000000)

        dto = {
            "email": f"{email_prefix}{user_id}@example.com",
            "username": f"{username_prefix}{user_id}",
            "password": "ValidPassword123!",
            "passwordConfirmation": "ValidPassword123!",
            "person": {
                "firstname": "Test",
                "lastname": "User",
                "phoneNumber": f"+38160{random.randint(1000000, 9999999)}"
            }
        }

        with self.client.post(
            "/users/registration",
            json=dto,
            catch_response=True,
            name=f"/users/registration [DUPLICATE]"
        ) as response:
            if response.status_code in [201, 409]:
                response.success()
            else:
                response.failure(f"Expected 201/409, got {response.status_code}")

    @task(1)
    def register_invalid_email(self):
        user_id = random.randint(1, 9999999)
        invalid_emails = [
            f"invalid-email-{user_id}",
            "@example.com",
            f"user{user_id}@"
        ]

        with self.client.post(
            "/users/registration",
            json=self._build_dto(user_id, email=random.choice(invalid_emails)),
            catch_response=True,
            name=f"/users/registration [INVALID-EMAIL]"
        ) as response:
            if response.status_code == 400:
                response.success()
            else:
                response.failure(f"Expected 400, got {response.status_code}")

    @task(1)
    def register_invalid_password(self):
        user_id = random.randint(1, 9999999)
        weak_password = random.choice(["Short", "Pass1", "abc12", "1234"])
        with self.client.post(
            "/users/registration",
            json=self._build_dto(user_id, password=weak_password, password_confirmation=weak_password),
            catch_response=True,
            name=f"/users/registration [INVALID-PASSWORD]"
        ) as response:
            if response.status_code == 400:
                response.success()
            else:
                response.failure(f"Expected 400, got {response.status_code}")

    @task(1)
    def register_password_mismatch(self):
        user_id = random.randint(1, 9999999)
        with self.client.post(
            "/users/registration",
            json=self._build_dto(
                user_id,
                password="ValidPassword123!",
                password_confirmation="DifferentPassword456!"
            ),
            catch_response=True,
            name="/users/registration [PASSWORD-MISMATCH]"
        ) as response:
            if response.status_code == 400:
                response.success()
            else:
                response.failure(f"Expected 400, got {response.status_code}")