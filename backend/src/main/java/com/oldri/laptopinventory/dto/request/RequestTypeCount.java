package com.oldri.laptopinventory.dto.request;

import com.oldri.laptopinventory.model.enums.RequestType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestTypeCount {
    private RequestType type;
    private Long count;
}
