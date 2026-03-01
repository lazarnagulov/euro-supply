import random
from locustfiles.util import PAGE_SIZE, random_page

KEYWORDS_FIRSTNAME = ["Manager"]
KEYWORDS_LASTNAME = [f"User{i}" for i in range(0, 5000, 100)]
KEYWORDS_USERNAME = [f"manager_{random.randint(1, 1000000)}" for _ in range(50)]
KEYWORDS_EMAIL_PARTIAL = ["manager", "example.com", "gmail.com"]
KEYWORDS_SPECIAL = ["manager", "customer"]


def random_keyword() -> str:
    pool = (
        KEYWORDS_FIRSTNAME * 2 +       
        KEYWORDS_LASTNAME +            
        KEYWORDS_USERNAME +            
        KEYWORDS_EMAIL_PARTIAL * 3 +   
        KEYWORDS_SPECIAL              
    )
    return random.choice(pool)


def build_manager_search_params():
    params = {}

    if random.random() < 0.7:
        params["keyword"] = random_keyword()

    params["page"] = random_page()
    params["size"] = PAGE_SIZE

    return params