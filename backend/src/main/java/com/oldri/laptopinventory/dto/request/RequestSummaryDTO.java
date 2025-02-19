package com.oldri.laptopinventory.dto.request;

import java.time.LocalDateTime;
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
public class RequestSummaryDTO {
    private Long id;
    private RequestType type;
    private RequestStatus status;
    private String requesterEmail;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
