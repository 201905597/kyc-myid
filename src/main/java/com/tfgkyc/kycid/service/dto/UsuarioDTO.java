package com.tfgkyc.kycid.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String userName;
    private String dni;
    private String userData;
    private String userPwd;
    private String userEmail;
}
