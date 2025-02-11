CREATE TABLE device_requests (
    id BIGSERIAL PRIMARY KEY,
    requester_id BIGINT NOT NULL REFERENCES users(id), -- Changed to BIGINT
    processed_by_id BIGINT REFERENCES users(id), -- Changed to BIGINT
    requested_date DATE NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    device_id BIGINT REFERENCES devices(id), -- Changed to BIGINT
    quantity INT,
    notes TEXT,
    reason_for_rejection TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
