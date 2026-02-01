import random
from locust import HttpUser, between, task

from locustfiles import util

class CompanyTasks(HttpUser):
    wait_time = between(1, 5)
    host = "http://localhost:8080/api/v1"
    
    def on_start(self):
        token = util.get_auth_token(self.client, "manager", "pera")
        self.client.headers.update({
            "Authorization": f"Bearer {token}"
        })

    @task
    def review_company(self):
        company_id = random.randint(util.MIN_COMPANY_PENDING, util.MAX_COMPANY_PENDING)
        status = random.choice(["APPROVED", "REJECTED"])

        payload = {
            "status": status,
            "rejectionReason": None if status == "APPROVED" else "Does not meet compliance requirements"
        }

        with self.client.patch(
            f"/companies/{company_id}",
            json=payload,
            headers={"Content-Type": "application/json"},
            catch_response=True
        ) as r:
            if r.status_code in (400, 409):
                r.success()
        
    @task
    def get_pending_companies(self):
        self.client.get(f"/companies/pending")