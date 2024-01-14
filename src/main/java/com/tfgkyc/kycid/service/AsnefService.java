package com.tfgkyc.kycid.service;

import java.util.List;

import com.tfgkyc.kycid.service.dto.AsnefDTO;

public interface AsnefService {

    // All data from ASNEF USUARIOS table
    List<AsnefDTO> getAsnefUsuarios();
    
}
