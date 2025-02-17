-- Insert dummy data into device_requests table
INSERT INTO device_requests (
    requester_id, processed_by_id, requested_date, type, status, device_id, quantity, notes, priority
) VALUES
    -- Request for a new device
    (1, NULL, '2025-02-15', 'NEW_DEVICE', 'PENDING', NULL, 5, 'Need new laptops for the upcoming project.', 'HIGH'),

    -- Request for assigning an available device
    (1, NULL, '2025-02-16', 'DEVICE_ASSIGNMENT', 'PENDING', 1, NULL, 'Assign MacBook Pro to a new employee.', 'MEDIUM'),

    -- Request for assigning another available device
    (1, NULL, '2025-02-17', 'DEVICE_ASSIGNMENT', 'PENDING', 3, NULL, 'Assign EliteBook 840 to the new developer.', 'LOW'),

    -- Request for a new device with urgent priority
    (1, NULL, '2025-02-18', 'NEW_DEVICE', 'PENDING', NULL, 10, 'Urgent need for new devices for the expansion.', 'URGENT'),

    -- Request for assigning a device that is already assigned (should be rejected)
    (1, NULL, '2025-02-19', 'DEVICE_ASSIGNMENT', 'REJECTED', 2, NULL, 'Attempt to reassign Dell XPS 15.', 'MEDIUM'),

    -- Approved request for assigning a device
    (1, 1, '2025-02-20', 'DEVICE_ASSIGNMENT', 'APPROVED', 6, NULL, 'Approved assignment of ROG Zephyrus G14.', 'MEDIUM'),

    -- Request for a new device with medium priority
    (1, NULL, '2025-02-21', 'NEW_DEVICE', 'PENDING', NULL, 3, 'Need additional laptops for the training session.', 'MEDIUM'),

    -- Request for assigning a device in maintenance (should be rejected)
    (1, NULL, '2025-02-22', 'DEVICE_ASSIGNMENT', 'REJECTED', 4, NULL, 'Attempt to assign ThinkPad X1 Carbon in maintenance.', 'LOW'),

    -- Request for assigning an available device
    (1, NULL, '2025-02-23', 'DEVICE_ASSIGNMENT', 'PENDING', 7, NULL, 'Assign Galaxy Book Pro to the marketing team.', 'HIGH'),

    -- Request for a new device with low priority
    (1, NULL, '2025-02-24', 'NEW_DEVICE', 'PENDING', NULL, 2, 'Need new devices for the interns.', 'LOW');
