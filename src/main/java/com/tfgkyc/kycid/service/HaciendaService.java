package com.tfgkyc.kycid.service;

import java.util.List;

import com.tfgkyc.kycid.service.dto.HaciendaDTO;

public interface HaciendaService {
    
    // All data from DOCUMENTOS TABLE
    List<HaciendaDTO> getDocsHacienda();
}
