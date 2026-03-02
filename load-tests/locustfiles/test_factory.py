from locust import HttpUser, between, task
from locustfiles import factory_util
from locustfiles import product_util
from locustfiles import util

class FactoryTasks(HttpUser):
    wait_time = between(1, 5)
    host = "http://localhost:8080/api/v1"
    
    def on_start(self):
        token = util.get_auth_token(self.client, "manager", "pera")
        self.client.headers.update({
            "Authorization": f"Bearer {token}"
        })

    @task
    def search_factories(self):
        params = factory_util.build_factory_search_params()
        self.client.get("/factories/search", params=params)

    @task
    def get_products_by_factory(self):
        factory_id = factory_util.random_factory_id()
        page = util.random_page()
        self.client.get(f"/factories/{factory_id}/products", params={"page": page, "size": util.PAGE_SIZE})
    
    @task
    def get_factories_by_product(self):
        product_id = product_util.random_product_id()
        self.client.get(f"/factories/producing-product/{product_id}")

    @task
    def get_factory_status(self):
        factory_id = factory_util.random_factory_id()
        self.client.get(f"/factories/{factory_id}/status")

    @task
    def get_factory(self):
        factory_id = factory_util.random_factory_id()
        self.client.get(f"/factories/{factory_id}")

    @task
    def get_production(self):
        factory_id = factory_util.random_factory_id()
        product_id = product_util.random_product_id()
        params = factory_util.build_production_params()
        self.client.get(f"/factories/{factory_id}/production/{product_id}", params=params)