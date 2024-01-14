package com.tfgkyc.kycid.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizacionDTO {
    private Long id;
    private String orgName;
    private String orgPwd;
}
