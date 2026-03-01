import random

from locustfiles.util import PAGE_SIZE, random_page

COUNTRY_CITIES = {
    1:  [1001, 1002, 1003],   # Albania
    2:  [1004, 1005, 1006],   # Andorra
    3:  [1007, 1008, 1009],   # Armenia
    4:  [1010, 1011, 1012],   # Austria
    5:  [1013, 1014, 1015],   # Azerbaijan
    6:  [1016, 1017, 1018],   # Belarus
    7:  [1019, 1020, 1021],   # Belgium
    8:  [1022, 1023, 1024],   # Bosnia and Herzegovina
    9:  [1025, 1026, 1027],   # Bulgaria
    10: [1028, 1029, 1030],   # Croatia
    11: [1031, 1032, 1033],   # Cyprus
    12: [1034, 1035, 1036],   # Czech Republic
    13: [1037, 1038, 1039],   # Denmark
    14: [1040, 1041, 1042],   # Estonia
    15: [1043, 1044, 1045],   # Finland
    16: [1046, 1047, 1048],   # France
    17: [1049, 1050, 1051],   # Georgia
    18: [1052, 1053, 1054],   # Germany
    19: [1055, 1056, 1057],   # Greece
    20: [1058, 1059, 1060],   # Hungary
    21: [1061, 1062, 1063],   # Iceland
    22: [1064, 1065, 1066],   # Ireland
    23: [1067, 1068, 1069],   # Italy
    24: [1070, 1071, 1072],   # Latvia
    25: [1073, 1074, 1075],   # Liechtenstein
    26: [1076, 1077, 1078],   # Lithuania
    27: [1079, 1080, 1081],   # Luxembourg
    28: [1082, 1083, 1084],   # Malta
    29: [1085, 1086, 1087],   # Moldova
    30: [1088, 1089, 1090],   # Monaco
    31: [1091, 1092, 1093],   # Montenegro
    32: [1094, 1095, 1096],   # Netherlands
    33: [1097, 1098, 1099],   # North Macedonia
    34: [1100, 1101, 1102],   # Norway
    35: [1103, 1104, 1105],   # Poland
    36: [1106, 1107, 1108],   # Portugal
    37: [1109, 1110, 1111],   # Romania
    38: [1112, 1113, 1114],   # Russia
    39: [1115, 1116, 1117],   # San Marino
    40: [1118, 1119, 1120],   # Serbia
    41: [1121, 1122, 1123],   # Slovakia
    42: [1124, 1125, 1126],   # Slovenia
    43: [1127, 1128, 1129],   # Spain
    44: [1130, 1131, 1132],   # Sweden
    45: [1133, 1134, 1135],   # Switzerland
    46: [1136, 1137, 1138],   # Ukraine
    47: [1139, 1140, 1141],   # United Kingdom
}

FACTORY_NAMED = [
    ("EuroSteel Plant", "Industrijska zona 1"),
    ("NordChem Factory", "Chemical Park 12"),
    ("Adriatic Food Processing", "Port Area bb"),
]


def random_factory_name() -> str:
    if random.random() < 0.05:
        return random.choice(FACTORY_NAMED)[0]
    return f"Factory {random.randint(4, 20003)}"


def random_factory_address() -> str:
    if random.random() < 0.05:
        return random.choice(FACTORY_NAMED)[1]
    return f"Industrial Street {random.randint(4, 20003)}"


def build_factory_search_params():
    params = {}

    if random.random() < 0.8:
        country_id = random.choice(list(COUNTRY_CITIES.keys()))
        params["countryId"] = country_id

        if random.random() < 0.85:
            params["cityId"] = random.choice(COUNTRY_CITIES[country_id])

    if random.random() < 0.3:
        params["name"] = random_factory_name()

    if random.random() < 0.15:
        params["address"] = random_factory_address()

    params["page"] = random_page()
    params["size"] = PAGE_SIZE

    return params

def random_factory_id() -> int:
    return random.randint(1, 20003)


# Factory production
PERIODS = ["7d", "30d", "90d", "180d", None]  # None = default 365d
PERIOD_WEIGHTS = [0.35, 0.30, 0.20, 0.10, 0.05]

def build_production_params() -> dict:
    period = random.choices(PERIODS, weights=PERIOD_WEIGHTS, k=1)[0]
    if period is not None:
        return {"period": period}
    return {}  # default 365d