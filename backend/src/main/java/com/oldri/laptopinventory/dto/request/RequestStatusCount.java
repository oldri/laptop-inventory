package com.oldri.laptopinventory.dto.request;

import com.oldri.laptopinventory.model.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestStatusCount {
    private RequestStatus status;
    private Long count;
}