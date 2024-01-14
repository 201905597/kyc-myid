package com.tfgkyc.kycid.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgkyc.kycid.model.OrganizacionTable;
import com.tfgkyc.kycid.repository.OrganizacionRepository;
import com.tfgkyc.kycid.service.OrganizacionService;
import com.tfgkyc.kycid.service.dto.OrganizacionDTO;

import java.util.List;
import java.util.stream.StreamSupport;

@Service
public class OrganizacionServiceImpl implements OrganizacionService {
    
    @Autowired
    private OrganizacionRepository organizacionRepository;

    @Override
    public List<OrganizacionDTO> getOrganizaciones(){
        return StreamSupport.stream(organizacionRepository.findAll().spliterator(),false)
                .map(obj -> new OrganizacionDTO(
                    obj.getId(),
                    obj.getOrgName(),
                    obj.getOrgPwd()))
                .toList();
    }

    @Override
    public void deleteOrg(Long id){
        organizacionRepository.deleteById(id);
    }

    @Override
    public OrganizacionTable updateOrg(Long id,OrganizacionTable org){
        if (organizacionRepository.existsById(id)){
            return organizacionRepository.save(org);
        }else{
            return null;
        }
    }

    @Override
    public OrganizacionTable insertOrg(OrganizacionTable org){
        OrganizacionTable orgTable = new OrganizacionTable();
        orgTable.setOrgName(org.getOrgName());
        orgTable.setOrgPwd(org.getOrgPwd());
        OrganizacionTable newUser = organizacionRepository.save(orgTable);
        return newUser;
    }
}
