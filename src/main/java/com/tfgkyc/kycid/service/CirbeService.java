package com.tfgkyc.kycid.service;

import java.util.List;

import com.tfgkyc.kycid.service.dto.CirbeDTO;

public interface CirbeService {

    // All data from CIRBE USUARIOS table
    List<CirbeDTO> getCirbeUsuarios();
    
}
