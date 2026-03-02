import json
import logging
import random
import requests
from locust import FastHttpUser, task, between, events

base_url = "http://localhost:8080/api/v1"
token = None


def on_test_start(environment, **kwargs):
    global token

    try:
        response = requests.post(
            f"{base_url}/auth/login",
            json={"username": "customer", "password": "pera"},
            timeout=30
        )

        if response.status_code == 200:
            token = response.json().get("token")
            logging.info("Successfully fetched CUSTOMER token")
        else:
            logging.error(f"Login failed: {response.status_code}")

    except Exception as e:
        logging.error(f"Pre-authentication error: {e}")


events.test_start.add_listener(on_test_start)


class OrderCreationUser(FastHttpUser):

    host = "http://localhost:8080/api/v1"
    wait_time = between(0.1, 0.3)

    @task
    def create_order(self):

        product_id = random.randint(1, 500)
        payload = {
            "productId": product_id,
            "companyId": 1,
            "quantity": 1
        }

        with self.client.post(
            "/products/order",
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
            catch_response=True,
            name=f"POST [product-{product_id}]/products/order"
        ) as response:

            if response.status_code == 200:

                try:
                    data = response.json()

                    if "id" in data:
                        response.success()
                    else:
                        response.failure("Missing id in response")

                except json.JSONDecodeError:
                    response.failure("Invalid JSON response")

            elif response.status_code == 400:
                response.success()

            elif response.status_code == 401:
                print(f"Unauthorized response: {response.status_code} - {response.text}")
                response.failure("Unauthorized - token problem")

            else:
                response.failure(
                    f"Unexpected status: {response.status_code} | {response.text}"
                )