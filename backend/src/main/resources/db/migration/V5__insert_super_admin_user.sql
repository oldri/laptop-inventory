INSERT INTO users (
    username, password, email, first_name, last_name, phone_number, role, department, is_active
) VALUES 
(
    'super_admin',
    '$2a$12$XNPquJWBL1qr7FfGfq7L7.SXz1w7gVshgwYjfUlFQtxpfcQlL.gnO',
    'super_admin@example.com',
    'Super',
    'Admin',
    '+1234567890',
    'ROLE_SUPER_ADMIN',
    'MANAGEMENT',
    TRUE
),
(
    'admin_user',
    '$2a$12$XNPquJWBL1qr7FfGfq7L7.SXz1w7gVshgwYjfUlFQtxpfcQlL.gnO',
    'admin@example.com',
    'Admin',
    'User',
    '+1234567891',
    'ROLE_ADMIN',
    'ADMINISTRATION',
    TRUE
),
(
    'employee_user',
    '$2a$12$XNPquJWBL1qr7FfGfq7L7.SXz1w7gVshgwYjfUlFQtxpfcQlL.gnO',
    'employee@example.com',
    'Employee',
    'User',
    '+1234567892',
    'ROLE_EMPLOYEE',
    'OPERATIONS',
    TRUE
);
