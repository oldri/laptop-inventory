package com.oldri.laptopinventory.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oldri.laptopinventory.model.Device;
import com.oldri.laptopinventory.model.DeviceRequest;
import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.model.enums.RequestPriority;
import com.oldri.laptopinventory.model.enums.RequestStatus;
import com.oldri.laptopinventory.model.enums.RequestType;

@Repository
public interface DeviceRequestRepository
                extends JpaRepository<DeviceRequest, Long>, JpaSpecificationExecutor<DeviceRequest> {

        // Fetch all requests by requester (Admin/Super Admin)
        Page<DeviceRequest> findByRequester(User requester, Pageable pageable);

        // Fetch all requests by status
        Page<DeviceRequest> findByStatus(RequestStatus status, Pageable pageable);

        // Fetch all requests by type
        Page<DeviceRequest> findByType(RequestType type, Pageable pageable);

        // Check if a request exists for a specific device (for DEVICE_ASSIGNMENT
        // requests)
        boolean existsByDeviceAndStatus(Device device, RequestStatus status);

        // Custom query to fetch requests with filters
        @Query("SELECT dr FROM DeviceRequest dr WHERE (:type IS NULL OR dr.type = :type) " +
                        "AND (:status IS NULL OR dr.status = :status) " +
                        "AND (:priority IS NULL OR dr.priority = :priority)")
        Page<DeviceRequest> findAllByFilters(@Param("type") RequestType type,
                        @Param("status") RequestStatus status,
                        @Param("priority") RequestPriority priority,
                        Pageable pageable);
}
