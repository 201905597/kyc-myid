package com.tfgkyc.kycid.service;

import java.util.List;

import com.tfgkyc.kycid.model.DocTable;
import com.tfgkyc.kycid.service.dto.DocDTO;

public interface DocService {
    
    // All data from DOCUMENTOS TABLE
    List<DocDTO> getDocs();

    // Insert document into DOCUMENTOS
    DocTable insertDoc(DocTable docTable);
}
