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
import com.oldri.laptopinventory.dto.device.DeviceStatusCountProjection;
import com.oldri.laptopinventory.dto.device.DeviceConditionCountProjection;
import com.oldri.laptopinventory.dto.device.DeviceLocationCountProjection;
import com.oldri.laptopinventory.dto.device.DeviceLocationStatusCountProjection;
import com.oldri.laptopinventory.dto.device.DeviceStatusConditionCountProjection;
import com.oldri.laptopinventory.model.Device;
import com.oldri.laptopinventory.model.User;
import com.oldri.laptopinventory.model.enums.DeviceStatus;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long>, JpaSpecificationExecutor<Device> {

        Optional<Device> findBySerialNumber(String serialNumber);

        List<Device> findByAssignedUser(User user);

        Page<Device> findAllByStatus(DeviceStatus status, Pageable pageable);

        boolean existsBySerialNumber(String serialNumber);

        @Query("SELECT d FROM Device d LEFT JOIN FETCH d.warranties WHERE d.id = :id")
        Optional<Device> findByIdWithWarranties(@Param("id") Long id);

        @Query("SELECT d.status AS status, COUNT(d) AS count FROM Device d GROUP BY d.status")
        List<DeviceStatusCountProjection> countByStatus();

        @Query("SELECT d.condition AS condition, COUNT(d) AS count FROM Device d GROUP BY d.condition")
        List<DeviceConditionCountProjection> countByCondition();

        @Query("SELECT d.location AS location, COUNT(d) AS count FROM Device d GROUP BY d.location")
        List<DeviceLocationCountProjection> countByLocation();

        @Query("SELECT d.location AS location, d.status AS status, COUNT(d) AS count FROM Device d GROUP BY d.location, d.status")
        List<DeviceLocationStatusCountProjection> countByLocationAndStatus();

        @Query("SELECT d.status AS status, d.condition AS condition, COUNT(d) AS count FROM Device d GROUP BY d.status, d.condition")
        List<DeviceStatusConditionCountProjection> countByStatusAndCondition();
}
