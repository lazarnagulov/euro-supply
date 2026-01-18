INSERT INTO files (path, filename, content_type, type, created_at) VALUES
('vehicle/1', 'vehicle_1.jpg', 'image/jpeg', 'IMAGE', '2025-12-08 16:42:07.714908+01'),
('vehicle/2', 'vehicle_2.jpg', 'image/jpeg', 'IMAGE', '2025-12-08 16:44:19.99891+01'),
('vehicle/3', 'vehicle_3.jpg', 'image/jpeg', 'IMAGE', '2025-12-08 16:45:28.130303+01'),
('vehicle/4', 'vehicle_4.jpg', 'image/jpeg', 'IMAGE', '2025-12-08 16:39:02.306783+01'),
('product/1', 'product_1.jpg', 'image/jpeg', 'IMAGE', '2025-12-08 16:39:02.306783+01'),
('product/2', 'product_2.jpg', 'image/jpeg', 'IMAGE', '2025-12-08 16:39:02.306783+01'),
('product/3', 'product_3.jpg', 'image/jpeg', 'IMAGE', '2025-12-08 16:39:02.306783+01'),
('factory/1', 'factory_1.jpg', 'image/jpeg', 'IMAGE', '2025-12-08 16:39:02.306783+01'),
('factory/2', 'factory_2.png', 'image/png', 'IMAGE', '2025-12-08 16:39:02.306783+01'),
('factory/3', 'factory_3.jpg', 'image/jpeg', 'IMAGE', '2025-12-08 16:39:02.306783+01'),
('warehouse/1', 'warehouse_1.jpg', 'image/jpeg', 'IMAGE', '2025-12-08 16:39:02.306783+01'),
('warehouse/2', 'warehouse_2.jpg', 'image/jpeg', 'IMAGE', '2025-12-08 16:39:02.306783+01');

INSERT INTO countries (id, name) VALUES
    (1,'Albania'),
    (2,'Andorra'),
    (3,'Armenia'),
    (4,'Austria'),
    (5,'Azerbaijan'),
    (6,'Belarus'),
    (7,'Belgium'),
    (8,'Bosnia and Herzegovina'),
    (9,'Bulgaria'),
    (10,'Croatia'),
    (11,'Cyprus'),
    (12,'Czech Republic'),
    (13,'Denmark'),
    (14,'Estonia'),
    (15,'Finland'),
    (16,'France'),
    (17,'Georgia'),
    (18,'Germany'),
    (19,'Greece'),
    (20,'Hungary'),
    (21,'Iceland'),
    (22,'Ireland'),
    (23,'Italy'),
    (24,'Latvia'),
    (25,'Liechtenstein'),
    (26,'Lithuania'),
    (27,'Luxembourg'),
    (28,'Malta'),
    (29,'Moldova'),
    (30,'Monaco'),
    (31,'Montenegro'),
    (32,'Netherlands'),
    (33,'North Macedonia'),
    (34,'Norway'),
    (35,'Poland'),
    (36,'Portugal'),
    (37,'Romania'),
    (38,'Russia'),
    (39,'San Marino'),
    (40,'Serbia'),
    (41,'Slovakia'),
    (42,'Slovenia'),
    (43,'Spain'),
    (44,'Sweden'),
    (45,'Switzerland'),
    (46,'Ukraine'),
    (47,'United Kingdom');

INSERT INTO cities (id, name) VALUES
    (1001,'Tirana'),(1002,'Durrës'),(1003,'Vlorë'),
    (1004,'Andorra la Vella'),(1005,'Escaldes-Engordany'),(1006,'Encamp'),
    (1007,'Yerevan'),(1008,'Gyumri'),(1009,'Vanadzor'),
    (1010,'Vienna'),(1011,'Graz'),(1012,'Linz'),
    (1013,'Baku'),(1014,'Ganja'),(1015,'Sumqayit'),
    (1016,'Minsk'),(1017,'Gomel'),(1018,'Mogilev'),
    (1019,'Brussels'),(1020,'Antwerp'),(1021,'Ghent'),
    (1022,'Sarajevo'),(1023,'Banja Luka'),(1024,'Tuzla'),
    (1025,'Sofia'),(1026,'Plovdiv'),(1027,'Varna'),
    (1028,'Zagreb'),(1029,'Split'),(1030,'Rijeka'),
    (1031,'Nicosia'),(1032,'Limassol'),(1033,'Larnaca'),
    (1034,'Prague'),(1035,'Brno'),(1036,'Ostrava'),
    (1037,'Copenhagen'),(1038,'Aarhus'),(1039,'Odense'),
    (1040,'Tallinn'),(1041,'Tartu'),(1042,'Narva'),
    (1043,'Helsinki'),(1044,'Espoo'),(1045,'Tampere'),
    (1046,'Paris'),(1047,'Marseille'),(1048,'Lyon'),
    (1049,'Tbilisi'),(1050,'Kutaisi'),(1051,'Batumi'),
    (1052,'Berlin'),(1053,'Hamburg'),(1054,'Munich'),
    (1055,'Athens'),(1056,'Thessaloniki'),(1057,'Patras'),
    (1058,'Budapest'),(1059,'Debrecen'),(1060,'Szeged'),
    (1061,'Reykjavík'),(1062,'Kópavogur'),(1063,'Hafnarfjörður'),
    (1064,'Dublin'),(1065,'Cork'),(1066,'Limerick'),
    (1067,'Rome'),(1068,'Milan'),(1069,'Naples'),
    (1070,'Riga'),(1071,'Daugavpils'),(1072,'Liepāja'),
    (1073,'Vaduz'),(1074,'Schaan'),(1075,'Balzers'),
    (1076,'Vilnius'),(1077,'Kaunas'),(1078,'Klaipėda'),
    (1079,'Luxembourg City'),(1080,'Esch-sur-Alzette'),(1081,'Differdange'),
    (1082,'Valletta'),(1083,'Birkirkara'),(1084,'Mosta'),
    (1085,'Chișinău'),(1086,'Bălți'),(1087,'Tiraspol'),
    (1088,'Monaco'),(1089,'Monte Carlo'),(1090,'La Condamine'),
    (1091,'Podgorica'),(1092,'Nikšić'),(1093,'Herceg Novi'),
    (1094,'Amsterdam'),(1095,'Rotterdam'),(1096,'The Hague'),
    (1097,'Skopje'),(1098,'Bitola'),(1099,'Kumanovo'),
    (1100,'Oslo'),(1101,'Bergen'),(1102,'Stavanger'),
    (1103,'Warsaw'),(1104,'Kraków'),(1105,'Łódź'),
    (1106,'Lisbon'),(1107,'Porto'),(1108,'Vila Nova de Gaia'),
    (1109,'Bucharest'),(1110,'Cluj-Napoca'),(1111,'Timișoara'),
    (1112,'Moscow'),(1113,'Saint Petersburg'),(1114,'Nizhny Novgorod'),
    (1115,'San Marino'),(1116,'Serravalle'),(1117,'Borgo Maggiore'),
    (1118,'Belgrade'),(1119,'Novi Sad'),(1120,'Niš'),
    (1121,'Bratislava'),(1122,'Košice'),(1123,'Prešov'),
    (1124,'Ljubljana'),(1125,'Maribor'),(1126,'Celje'),
    (1127,'Madrid'),(1128,'Barcelona'),(1129,'Valencia'),
    (1130,'Stockholm'),(1131,'Gothenburg'),(1132,'Malmö'),
    (1133,'Zurich'),(1134,'Geneva'),(1135,'Basel'),
    (1136,'Kyiv'),(1137,'Kharkiv'),(1138,'Odesa'),
    (1139,'London'),(1140,'Birmingham'),(1141,'Manchester');


INSERT INTO countries_cities (country_id, cities_id) VALUES
    (1,1001),(1,1002),(1,1003),
    (2,1004),(2,1005),(2,1006),
    (3,1007),(3,1008),(3,1009),
    (4,1010),(4,1011),(4,1012),
    (5,1013),(5,1014),(5,1015),
    (6,1016),(6,1017),(6,1018),
    (7,1019),(7,1020),(7,1021),
    (8,1022),(8,1023),(8,1024),
    (9,1025),(9,1026),(9,1027),
    (10,1028),(10,1029),(10,1030),
    (11,1031),(11,1032),(11,1033),
    (12,1034),(12,1035),(12,1036),
    (13,1037),(13,1038),(13,1039),
    (14,1040),(14,1041),(14,1042),
    (15,1043),(15,1044),(15,1045),
    (16,1046),(16,1047),(16,1048),
    (17,1049),(17,1050),(17,1051),
    (18,1052),(18,1053),(18,1054),
    (19,1055),(19,1056),(19,1057),
    (20,1058),(20,1059),(20,1060),
    (21,1061),(21,1062),(21,1063),
    (22,1064),(22,1065),(22,1066),
    (23,1067),(23,1068),(23,1069),
    (24,1070),(24,1071),(24,1072),
    (25,1073),(25,1074),(25,1075),
    (26,1076),(26,1077),(26,1078),
    (27,1079),(27,1080),(27,1081),
    (28,1082),(28,1083),(28,1084),
    (29,1085),(29,1086),(29,1087),
    (30,1088),(30,1089),(30,1090),
    (31,1091),(31,1092),(31,1093),
    (32,1094),(32,1095),(32,1096),
    (33,1097),(33,1098),(33,1099),
    (34,1100),(34,1101),(34,1102),
    (35,1103),(35,1104),(35,1105),
    (36,1106),(36,1107),(36,1108),
    (37,1109),(37,1110),(37,1111),
    (38,1112),(38,1113),(38,1114),
    (39,1115),(39,1116),(39,1117),
    (40,1118),(40,1119),(40,1120),
    (41,1121),(41,1122),(41,1123),
    (42,1124),(42,1125),(42,1126),
    (43,1127),(43,1128),(43,1129),
    (44,1130),(44,1131),(44,1132),
    (45,1133),(45,1134),(45,1135),
    (46,1136),(46,1137),(46,1138),
    (47,1139),(47,1140),(47,1141);

INSERT INTO categories (id, name) VALUES
                                      (1, 'Electronics'),
                                      (2, 'Computers & Laptops'),
                                      (3, 'Smartphones & Accessories'),
                                      (4, 'Home Appliances'),
                                      (5, 'Furniture'),
                                      (6, 'Books'),
                                      (7, 'Clothing & Apparel'),
                                      (8, 'Shoes & Footwear'),
                                      (9, 'Sports & Outdoors'),
                                      (10, 'Toys & Games'),
                                      (11, 'Beauty & Personal Care'),
                                      (12, 'Health & Fitness'),
                                      (13, 'Automotive'),
                                      (14, 'Garden & Outdoor'),
                                      (15, 'Pet Supplies'),
                                      (16, 'Office Supplies'),
                                      (17, 'Jewelry & Watches'),
                                      (18, 'Music & Instruments'),
                                      (19, 'Baby Products'),
                                      (20, 'Groceries & Gourmet Food'),
                                      (21, 'Tools & Home Improvement'),
                                      (22, 'Arts & Crafts'),
                                      (23, 'Travel & Luggage'),
                                      (24, 'Video Games & Consoles'),
                                      (25, 'Photography & Cameras');


INSERT INTO vehicle_brands (id, name) VALUES
    (1, 'Toyota'),
    (2, 'Honda'),
    (3, 'Ford'),
    (4, 'Chevrolet'),
    (5, 'BMW'),
    (6, 'Mercedes-Benz'),
    (7, 'Audi'),
    (8, 'Volkswagen'),
    (9, 'Hyundai'),
    (10, 'Kia'),
    (11, 'Nissan'),
    (12, 'Mazda'),
    (13, 'Subaru'),
    (14, 'Renault'),
    (15, 'Peugeot'),
    (16, 'Volvo'),
    (17, 'Jaguar'),
    (18, 'Land Rover'),
    (19, 'Fiat'),
    (20, 'Skoda');


INSERT INTO vehicle_models (id, name) VALUES
    (1, 'Corolla'), (2, 'Camry'), (3, 'RAV4'),
    (4, 'Civic'), (5, 'Accord'), (6, 'CR-V'),
    (7, 'F-150'), (8, 'Mustang'), (9, 'Explorer'),
    (10, 'Silverado'), (11, 'Malibu'), (12, 'Equinox'),
    (13, '3 Series'), (14, '5 Series'), (15, 'X5'),
    (16, 'C-Class'), (17, 'E-Class'), (18, 'GLC'),
    (19, 'A4'), (20, 'A6'), (21, 'Q5'),
    (22, 'Golf'), (23, 'Passat'), (24, 'Tiguan'),
    (25, 'Elantra'), (26, 'Sonata'), (27, 'Tucson'),
    (28, 'Sportage'), (29, 'Sorento'), (30, 'Optima'),
    (31, 'Altima'), (32, 'Sentra'), (33, 'Rogue'),
    (34, 'Mazda3'), (35, 'CX-5'), (36, 'Mazda6'),
    (37, 'Impreza'), (38, 'Forester'), (39, 'Outback'),
    (40, 'Clio'), (41, 'Megane'), (42, 'Captur'),
    (43, '208'), (44, '308'), (45, '3008'),
    (46, 'XC40'), (47, 'XC60'), (48, 'S60'),
    (49, 'XE'), (50, 'XF'), (51, 'F-Pace'),
    (52, 'Range Rover'), (53, 'Discovery'), (54, 'Defender'),
    (55, 'Panda'), (56, '500'), (57, 'Tipo'),
    (58, 'Octavia'), (59, 'Superb'), (60, 'Kodiaq');

INSERT INTO vehicle_brands_models (vehicle_brand_id, models_id) VALUES
    (1, 1), (1, 2), (1, 3),
    (2, 4), (2, 5), (2, 6),
    (3, 7), (3, 8), (3, 9),
    (4, 10), (4, 11), (4, 12),
    (5, 13), (5, 14), (5, 15),
    (6, 16), (6, 17), (6, 18),
    (7, 19), (7, 20), (7, 21),
    (8, 22), (8, 23), (8, 24),
    (9, 25), (9, 26), (9, 27),
    (10, 28), (10, 29), (10, 30),
    (11, 31), (11, 32), (11, 33),
    (12, 34), (12, 35), (12, 36),
    (13, 37), (13, 38), (13, 39),
    (14, 40), (14, 41), (14, 42),
    (15, 43), (15, 44), (15, 45),
    (16, 46), (16, 47), (16, 48),
    (17, 49), (17, 50), (17, 51),
    (18, 52), (18, 53), (18, 54),
    (19, 55), (19, 56), (19, 57),
    (20, 58), (20, 59), (20, 60);


INSERT INTO vehicles (
    max_load_kg,
    brand_id, created_at,
    model_id, updated_at, registration_number, version
) VALUES
      (
    20000,
          16, '2025-12-08 16:42:07.714908+01',
          48, '2025-12-08 16:42:07.714908+01', 'BG-123-AB', 0
      ),
      (
        19000,
          14, '2025-12-08 16:44:19.99891+01',
          41, '2025-12-08 16:42:07.714908+01', 'NS-456-CD', 0
      ),
      (
        18500,
          3, '2025-12-08 16:45:28.130303+01',
          8, '2025-12-08 16:42:07.714908+01', 'BG-789-EF', 0
      ),
      (
        18000,
          6, '2025-12-08 16:39:02.306783+01',
          17, '2025-12-08 16:42:07.714908+01', 'NS-012-GH', 0
      );

WITH brand_models AS (
    SELECT
        vbm.vehicle_brand_id AS brand_id,
        vbm.models_id AS model_id,
        ROW_NUMBER() OVER () AS rn
    FROM vehicle_brands_models vbm
),
     series AS (
         SELECT
             generate_series(1, 100000) AS seq,
             (generate_series(1, 100000) - 1)
    % (SELECT COUNT(*) FROM brand_models) + 1 AS bm_index
    )
INSERT INTO vehicles (
    max_load_kg,
    brand_id,
    model_id,
    registration_number,
    created_at,
    updated_at,
    version
)
SELECT
    (7000 + floor(random() * 25000))::int AS max_load_kg,
    bm.brand_id,
    bm.model_id,
    CONCAT(
            chr(65 + (random() * 26)::int),
            chr(65 + (random() * 26)::int),
            '-',
            lpad(s.seq::text, 6, '0')
    ) AS registration_number,
    NOW() - (random() * INTERVAL '24 months') AS created_at,
    NOW() - (random() * INTERVAL '24 months') AS updated_at,
    0 AS version
FROM series s
         JOIN brand_models bm
              ON bm.rn = s.bm_index
ORDER BY random();

INSERT INTO vehicle_status (vehicle_id, is_online, last_heartbeat_at)
VALUES
    (1, true, NOW() - INTERVAL '2 minutes'),
    (2, false, NOW() - INTERVAL '15 minutes'),
    (3, true, NOW() - INTERVAL '1 minute'),
    (4, false, NOW() - INTERVAL '1 hour');

INSERT INTO vehicle_status (vehicle_id, is_online, last_heartbeat_at)
SELECT
    id,
    random() > 0.3,
    NOW() - (random() * INTERVAL '30 minutes')
FROM vehicles
WHERE id > 4;

INSERT INTO vehicle_locations (vehicle_id, latitude, longitude, updated_at)
VALUES
    (1, 44.816410, 20.460150, NOW() - INTERVAL '2 minutes'),
    (2, 45.255820, 19.845420, NOW() - INTERVAL '15 minutes'),
    (3, 44.803280, 20.426940, NOW() - INTERVAL '1 minute'),
    (4, 45.267136, 19.833549, NOW() - INTERVAL '1 hour');

INSERT INTO vehicle_locations (
    vehicle_id,
    latitude,
    longitude,
    updated_at
)
SELECT
    id,
    44.75 + random() * 0.6,   -- Serbia latitude range
    19.6  + random() * 1.2,   -- Serbia longitude range
    NOW() - (random() * INTERVAL '30 minutes')
FROM vehicles
WHERE id > 4;

INSERT INTO factories (
    name, address,
    city_id, country_id,
    latitude, longitude,
    created_at, updated_at,
    last_heartbeat, version,
    is_online
)
VALUES
('EuroSteel Plant',
 'Industrijska zona 1',
 1118, 40,
 44.8167, 20.4667,
 now(), now(),
 now(), 0, false),

('NordChem Factory',
 'Chemical Park 12',
 1005, 2,
 52.5200, 13.4050,
 now(), now(),
 now(), 0, false),

('Adriatic Food Processing',
 'Port Area bb',
 1008, 3,
 43.5081, 16.4402,
 now(), now(),
 now(), 0, false);


INSERT INTO products
(name, description,
 price, weight, on_sale,
 category_id, created_at,
 updated_at, version, image_id)
VALUES
    (
        'Steel Beam S235',
        'Structural steel beam for construction and industrial use',
        120.50,
        18.75,
        false,
        3,
        now(),
        now(),
        0,
     5
    ),
    (
        'Industrial Lubricant XL',
        'High-performance lubricant for heavy machinery',
        45.90,
        5.20,
        true,
        12,
        now(),
        now(),
        0,
     6
    ),
    (
        'Electronic Control Unit',
        'Automotive-grade electronic control unit for industrial systems',
        320.00,
        1.35,
        false,
        21,
        now(),
        now(),
        0,
     7
    );


insert into product_factory (product_id, factory_id) values
 (1, 1), (1, 2), (1, 3),
 (2, 1), (2, 2), (2, 3),
 (3, 1), (3, 2), (3, 3);


INSERT INTO vehicles_images (images_id, vehicle_id) VALUES
    (1,1),
    (2,2),
    (3,3),
    (4,4);

INSERT INTO warehouses (name, address, country_id, city_id, latitude, longitude) VALUES
     ('Central Warehouse', 'Kralja Milana 6, Beograd', 40, 1118, 16020, 454545),
     ('Belgrade Warehouse', 'Lamartinova 52, Vracar', 40, 1118, 16520, 454545);

INSERT INTO warehouses_images (images_id, warehouse_id) VALUES
                                                        (11, 1),
                                                        (12, 2);

INSERT INTO factories_images (images_id, factory_id) VALUES
    (8,1),
    (9,2),
    (10,3);
