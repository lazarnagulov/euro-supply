import random
import string


MAX_COUNTRY_ID = 47
MAX_VEHICLE_ID = 100_000
MAX_VEHICLE_BRAND_ID = 20

PAGE_SIZE = 10
MIN_COMPANY_PENDING = 2
MAX_COMPANY_PENDING = 201

BRAND_MODELS = {
    1: [1, 2, 3],
    2: [4, 5, 6],
    3: [7, 8, 9],
    4: [10, 11, 12],
    5: [13, 14, 15],
    6: [16, 17, 18],
    7: [19, 20, 21],
    8: [22, 23, 24],
    9: [25, 26, 27],
    10: [28, 29, 30],
    11: [31, 32, 33],
    12: [34, 35, 36],
    13: [37, 38, 39],
    14: [40, 41, 42],
    15: [43, 44, 45],
    16: [46, 47, 48],
    17: [49, 50, 51],
    18: [52, 53, 54],
    19: [55, 56, 57],
    20: [58, 59, 60],
}

LOAD_RANGES = [
    (500.0, 1000.0),
    (1000.0, 3000.0),
    (3000.0, 7000.0),
    (7000.0, None),
]

def random_page(max_page=10):
    r = random.random()
    if r < 0.35:
        return 0
    elif r < 0.6:
        return random.randint(1, 2)
    elif r < 0.8:
        return random.randint(3, 6)
    else:
        return random.randint(7, max_page)

def random_size():
    return random.choices(
        population=[10, 20, 50],
        weights=[2, 6, 2],
    )[0]

def random_registration():
    return (
        random.choice(["BG", "NS", "NI", "KG"])
        + "-"
        + str(random.randint(100, 999))
        + "-"
        + "".join(random.choices(string.ascii_uppercase, k=2))
    )


def build_vehicle_search_params():
    params = {}

    if random.random() < 0.7:
        brand_id = random.choice(list(BRAND_MODELS.keys()))
        params["brandId"] = brand_id

        if random.random() < 0.8:
            params["modelId"] = random.choice(BRAND_MODELS[brand_id])

    if random.random() < 0.4:
        min_load, max_load = random.choice(LOAD_RANGES)
        params["minLoad"] = min_load
        if max_load:
            params["maxLoad"] = max_load

    if random.random() < 0.2:
        params["registration"] = random_registration()

    params["page"] = random_page()
    params["size"] = PAGE_SIZE

    return params

def get_auth_token(client, username, password):
    response = client.post(
        "/auth/login",
        json={
            "username": username,
            "password": password
        }
    )
    return response.json()["token"]
