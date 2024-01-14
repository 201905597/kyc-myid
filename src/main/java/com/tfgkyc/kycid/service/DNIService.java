package com.tfgkyc.kycid.service;

import java.util.List;

import com.tfgkyc.kycid.service.dto.DNIDTO;

public interface DNIService {

    // All data from DNIS TABLE
    List<DNIDTO> getDNIs();
    
}
