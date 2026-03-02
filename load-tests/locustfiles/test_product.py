from locust import HttpUser, between, task
from locustfiles import product_util
from locustfiles import util


class ProductTasks(HttpUser):
    wait_time = between(1, 5)
    host = "http://localhost:8080/api/v1"

    def on_start(self):
        token = util.get_auth_token(self.client, "manager", "pera")
        self.client.headers.update({
            "Authorization": f"Bearer {token}"
        })

    @task
    def search_products(self):
        params = product_util.build_product_search_params()
        self.client.get("/products/search", params=params)
    
    @task
    def get_product(self):
        product_id = product_util.random_product_id()
        self.client.get(f"/products/{product_id}")

    @task
    def get_available_products(self):
        self.client.get("/products/available?page=0&size=10",
                        name="/api/products/available"
        )