import random


MAX_WAREHOUSE_ID = 40_000
PAGE_SIZE = 10


COUNTRY_CITIES = {
    1:  [1001, 1002, 1003],
    2:  [1004, 1005, 1006],
    3:  [1007, 1008, 1009],
    4:  [1010, 1011, 1012],
    5:  [1013, 1014, 1015],
    6:  [1016, 1017, 1018],
    7:  [1019, 1020, 1021],
    8:  [1022, 1023, 1024],
    9:  [1025, 1026, 1027],
    10: [1028, 1029, 1030],
    11: [1031, 1032, 1033],
    12: [1034, 1035, 1036],
    13: [1037, 1038, 1039],
    14: [1040, 1041, 1042],
    15: [1043, 1044, 1045],
    16: [1046, 1047, 1048],
    17: [1049, 1050, 1051],
    18: [1052, 1053, 1054],
    19: [1055, 1056, 1057],
    20: [1058, 1059, 1060],
    21: [1061, 1062, 1063],
    22: [1064, 1065, 1066],
    23: [1067, 1068, 1069],
    24: [1070, 1071, 1072],
    25: [1073, 1074, 1075],
    26: [1076, 1077, 1078],
    27: [1079, 1080, 1081],
    28: [1082, 1083, 1084],
    29: [1085, 1086, 1087],
    30: [1088, 1089, 1090],
    31: [1091, 1092, 1093],
    32: [1094, 1095, 1096],
    33: [1097, 1098, 1099],
    34: [1100, 1101, 1102],
    35: [1103, 1104, 1105],
    36: [1106, 1107, 1108],
    37: [1109, 1110, 1111],
    38: [1112, 1113, 1114],
    39: [1115, 1116, 1117],
    40: [1118, 1119, 1120],
    41: [1121, 1122, 1123],
    42: [1124, 1125, 1126],
    43: [1127, 1128, 1129],
    44: [1130, 1131, 1132],
    45: [1133, 1134, 1135],
    46: [1136, 1137, 1138],
    47: [1139, 1140, 1141],
}

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


def build_warehouse_search_params():
    params = {}

    if random.random() < 0.8:
        country_id = random.choice(list(COUNTRY_CITIES.keys()))
        params["countryId"] = country_id

        if random.random() < 0.85:
            params["cityId"] = random.choice(COUNTRY_CITIES[country_id])

    if random.random() < 0.5:
        random_number = random.randint(1, 80000)
        params["name"] = f"Warehouse {random_number}"

    if random.random() < 0.5:
        street_number = random.randint(1, 9990)
        params["address"] = f"Street {street_number}"

    params["page"] = random_page()
    params["size"] = PAGE_SIZE

    return params


def random_warehouse_id() -> int:
    return random.randint(1, MAX_WAREHOUSE_ID)