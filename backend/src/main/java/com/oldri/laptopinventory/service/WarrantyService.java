package com.oldri.laptopinventory.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.oldri.laptopinventory.dto.warranty.WarrantyDTO;
import com.oldri.laptopinventory.dto.warranty.WarrantyDashboardDTO;
import com.oldri.laptopinventory.model.Warranty;
import com.oldri.laptopinventory.model.enums.WarrantyStatus;
import com.oldri.laptopinventory.repository.WarrantyRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WarrantyService {
    private final WarrantyRepository warrantyRepository;
    private static final String ACTIVE = "ACTIVE";
    private static final String EXPIRING = "EXPIRING";
    private static final String EXPIRED = "EXPIRED";

    @Transactional(readOnly = true)
    public WarrantyDashboardDTO getWarrantyDashboard() {
        List<Warranty> allWarranties = warrantyRepository.findAll();
        LocalDate today = LocalDate.now();

        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put(ACTIVE, 0L);
        statusCounts.put(EXPIRING, 0L);
        statusCounts.put(EXPIRED, 0L);

        List<WarrantyDTO> expiringSoon = new ArrayList<>();
        List<WarrantyDTO> recentlyExpired = new ArrayList<>();

        for (Warranty warranty : allWarranties) {
            WarrantyDTO dto = convertToDto(warranty);
            WarrantyStatus status = dto.getStatus();
            LocalDate endDate = warranty.getEndDate();

            if (status == WarrantyStatus.EXPIRED) {
                statusCounts.put(EXPIRED, statusCounts.get(EXPIRED) + 1);
                if (endDate.isAfter(today.minusDays(31))) {
                    recentlyExpired.add(dto);
                }
            } else if (status == WarrantyStatus.ACTIVE) {
                if (endDate.isBefore(today.plusDays(31))) {
                    statusCounts.put(EXPIRING, statusCounts.get(EXPIRING) + 1);
                    expiringSoon.add(dto);
                } else {
                    statusCounts.put(ACTIVE, statusCounts.get(ACTIVE) + 1);
                }
            }
        }

        expiringSoon.sort(Comparator.comparing(WarrantyDTO::getEndDate));
        recentlyExpired.sort(Comparator.comparing(WarrantyDTO::getEndDate).reversed());

        return WarrantyDashboardDTO.builder()
                .statusCounts(statusCounts)
                .expiringSoon(expiringSoon)
                .recentlyExpired(recentlyExpired)
                .totalWarranties((long) allWarranties.size())
                .build();
    }

    private WarrantyDTO convertToDto(Warranty warranty) {
        return WarrantyDTO.builder()
                .id(warranty.getId())
                .warrantyId(warranty.getWarrantyId())
                .startDate(warranty.getStartDate())
                .endDate(warranty.getEndDate())
                .type(warranty.getType())
                .description(warranty.getDescription())
                .createTime(warranty.getCreateTime())
                .updateTime(warranty.getUpdateTime())
                .build();
    }
}