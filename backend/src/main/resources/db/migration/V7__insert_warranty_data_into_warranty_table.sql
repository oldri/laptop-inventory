INSERT INTO warranties (
    device_id, warranty_id, start_date, end_date, type, description, create_time, update_time
) VALUES
    -- Warranty for device with id 1 (Apple MacBook Pro 16")
    (1, 'WARR-APPLE-12345', '2023-01-15', '2025-01-15', 'STANDARD', 'Standard 2-year warranty for Apple MacBook Pro 16"', NOW(), NOW()),

    -- Warranty for device with id 2 (Dell XPS 15)
    (2, 'WARR-DELL-67890', '2022-05-10', '2024-05-10', 'EXTENDED', 'Extended 2-year warranty for Dell XPS 15', NOW(), NOW()),

    -- Warranty for device with id 3 (HP EliteBook 840)
    (3, 'WARR-HP-54321', '2023-08-20', '2025-08-20', 'PREMIUM', 'Premium 2-year warranty for HP EliteBook 840', NOW(), NOW()),

    -- Warranty for device with id 4 (Lenovo ThinkPad X1 Carbon)
    (4, 'WARR-LENOVO-98765', '2021-11-30', '2023-11-30', 'STANDARD', 'Standard 2-year warranty for Lenovo ThinkPad X1 Carbon (expired)', NOW(), NOW()),

    -- Warranty for device with id 5 (Microsoft Surface Laptop 4)
    (5, 'WARR-MICROSOFT-11223', '2022-12-05', '2024-12-05', 'THIRD_PARTY', 'Third-party warranty for Microsoft Surface Laptop 4', NOW(), NOW()),

    -- Warranty for device with id 6 (Asus ROG Zephyrus G14)
    (6, 'WARR-ASUS-44556', '2023-07-22', '2025-07-22', 'EXTENDED', 'Extended 2-year warranty for Asus ROG Zephyrus G14', NOW(), NOW()),

    -- Warranty for device with id 7 (Samsung Galaxy Book Pro)
    (7, 'WARR-SAMSUNG-77889', '2023-03-19', '2025-03-19', 'STANDARD', 'Standard 2-year warranty for Samsung Galaxy Book Pro', NOW(), NOW()),

    -- Warranty for device with id 8 (Acer Swift 3)
    (8, 'WARR-ACER-33445', '2022-09-11', '2024-09-11', 'PREMIUM', 'Premium 2-year warranty for Acer Swift 3', NOW(), NOW()),

    -- Warranty for device with id 9 (Apple iMac 24")
    (9, 'WARR-APPLE-66778', '2023-02-14', '2025-02-14', 'STANDARD', 'Standard 2-year warranty for Apple iMac 24"', NOW(), NOW()),

    -- Warranty for device with id 10 (Dell Latitude 5420)
    (10, 'WARR-DELL-99001', '2021-08-28', '2023-08-28', 'THIRD_PARTY', 'Third-party warranty for Dell Latitude 5420 (expired)', NOW(), NOW());