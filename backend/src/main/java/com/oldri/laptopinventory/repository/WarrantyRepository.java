package com.oldri.laptopinventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oldri.laptopinventory.model.Device;
import com.oldri.laptopinventory.model.Warranty;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    List<Warranty> findByDevice(Device device);

    boolean existsByWarrantyId(String warrantyId);
}