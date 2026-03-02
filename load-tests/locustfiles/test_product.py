from random import choice

from locust import HttpUser, between, task
from locustfiles import product_util
from locustfiles import util


KEYWORDS = ["laptop", "phone", "headphones", "shoes", "shirt", "book", "camera", "watch", "tablet", ""]


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

class OnSaleProductTasks(HttpUser):
    wait_time = between(1, 5)
    host = "http://localhost:8080/api/v1"

    def on_start(self):
        token = util.get_auth_token(self.client, "customer", "pera")
        self.client.headers.update({
            "Authorization": f"Bearer {token}"
        })

    @task(1)
    def search_paginated(self):
        keyword = choice(KEYWORDS)
        page = choice([0, 1, 2, 3])
        size = choice([5, 10, 20])
        print(f"[PAGINATED] keyword='{keyword}' page={page} size={size}")
        response = self.client.get(
            "/products/on-sale/search",
            params={
                "keyword": keyword,
                "page": page,
                "size": size,
            },
            name="/products/on-sale/search [paginated]"
        )
        print(f"[PAGINATED] status={response.status_code} | url={response.url}")
  

    @task(1)
    def search_empty_keyword(self):
        print("[NO KEYWORD] page=0 size=10")
        response = self.client.get(
            "/products/on-sale/search",
            params={"page": 0, "size": 10},
            name="/products/on-sale/search [no keyword]"
        )
        print(f"[NO KEYWORD] status={response.status_code} | url={response.url}")