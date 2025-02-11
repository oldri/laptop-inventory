INSERT INTO users (
    username, password, email, first_name, last_name, phone_number, role, department, is_active
) VALUES (
    'super_admin',
    '$2a$12$XNPquJWBL1qr7FfGfq7L7.SXz1w7gVshgwYjfUlFQtxpfcQlL.gnO',
    'super_admin@example.com',
    'Super',
    'Admin',
    '+1234567890',
    'SUPER_ADMIN',
    'MANAGEMENT',
    TRUE
);