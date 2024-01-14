package com.tfgkyc.kycid.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CirbeDTO {
    private Long id;
    private String dni;
    private Integer deuda;
}
