import random
from locustfiles.util import PAGE_SIZE, random_page

CATEGORY_IDS = list(range(1, 26))

PRODUCT_NAMED = [
    ("Steel Beam S235", "Structural steel beam for construction and industrial use"),
    ("Industrial Lubricant XL", "High-performance lubricant for heavy machinery"),
    ("Electronic Control Unit", "Automotive-grade electronic control unit for industrial systems"),
]


def random_product_name() -> str:
    if random.random() < 0.05:
        return random.choice(PRODUCT_NAMED)[0]
    return f"Product {random.randint(4, 503)}"


def random_product_description() -> str:
    if random.random() < 0.05:
        return random.choice(PRODUCT_NAMED)[1]
    return f"Description for product {random.randint(4, 503)}"


def build_product_search_params():
    params = {}

    if random.random() < 0.3:
        params["name"] = random_product_name()

    if random.random() < 0.15:
        params["description"] = random_product_description()

    if random.random() < 0.5:
        min_price = round(random.uniform(5, 900), 2)
        params["minPrice"] = min_price
        if random.random() < 0.7:
            params["maxPrice"] = round(min_price + random.uniform(50, 500), 2)

    if random.random() < 0.3:
        min_weight = round(random.uniform(0.1, 40), 2)
        params["minWeight"] = min_weight
        if random.random() < 0.7:
            params["maxWeight"] = round(min_weight + random.uniform(1, 10), 2)

    if random.random() < 0.2:
        params["onSale"] = random.choice([True, False])

    if random.random() < 0.6:
        params["categoryId"] = random.choice(CATEGORY_IDS)

    params["page"] = random_page()
    params["size"] = PAGE_SIZE

    return params

def random_product_id() -> int:
    return random.randint(1, 503)