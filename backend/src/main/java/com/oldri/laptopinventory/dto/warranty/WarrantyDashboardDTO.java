package com.oldri.laptopinventory.dto.warranty;

import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarrantyDashboardDTO {
    private Map<String, Long> statusCounts;
    private List<WarrantyDTO> expiringSoon;
    private List<WarrantyDTO> recentlyExpired;
    private long totalWarranties;
}