package com.tfgkyc.kycid.service;

import java.util.List;

import com.tfgkyc.kycid.model.OrganizacionTable;
import com.tfgkyc.kycid.service.dto.OrganizacionDTO;

public interface OrganizacionService {
    
    // All data from Organizaciones table
    List<OrganizacionDTO> getOrganizaciones();

    // Borrar Org
    void deleteOrg(Long id);

    // Actualizar Org
    OrganizacionTable updateOrg(Long id,OrganizacionTable org);

    // Insertar Org
    OrganizacionTable insertOrg(OrganizacionTable org);
}
