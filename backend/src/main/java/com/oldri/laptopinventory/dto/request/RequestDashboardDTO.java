package com.oldri.laptopinventory.dto.request;

import java.util.List;
import java.util.Map;
import com.oldri.laptopinventory.model.enums.RequestStatus;
import com.oldri.laptopinventory.model.enums.RequestType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestDashboardDTO {
    private Map<RequestType, Long> typeCounts;
    private Map<RequestStatus, Long> statusCounts;
    private List<RequestSummaryDTO> recentRequests;
    private long totalRequests;
}