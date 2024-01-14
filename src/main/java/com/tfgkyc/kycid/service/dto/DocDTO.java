package com.tfgkyc.kycid.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocDTO {
    private Long id;
    private String dni;
    private String docHash;
    private byte[] documentData;
}
