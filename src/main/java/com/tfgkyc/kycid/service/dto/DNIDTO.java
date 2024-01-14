package com.tfgkyc.kycid.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DNIDTO {
    private Long id;
    private String dni;
    private String dniHash;
}
