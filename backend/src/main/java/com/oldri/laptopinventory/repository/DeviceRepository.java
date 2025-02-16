package com.oldri.laptopinventory.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oldri.laptopinventory.model.Device;
import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.model.enums.DeviceStatus;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long>, JpaSpecificationExecutor<Device> {
    Optional<Device> findBySerialNumber(String serialNumber);

    List<Device> findByAssignedUser(User user);

    Page<Device> findAllByStatus(DeviceStatus status, Pageable pageable);

    boolean existsBySerialNumber(String serialNumber);

    // Custom query to fetch device with warranties
    @Query("SELECT d FROM Device d LEFT JOIN FETCH d.warranties WHERE d.id = :id")
    Optional<Device> findByIdWithWarranties(@Param("id") Long id);
}