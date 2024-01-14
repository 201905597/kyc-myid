package com.tfgkyc.kycid.service.impl;

import java.util.List;

import com.tfgkyc.kycid.repository.AebRepository;
import com.tfgkyc.kycid.service.AebService;
import com.tfgkyc.kycid.service.dto.AebDTO;

import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AebServiceImpl implements AebService{

    @Autowired
    private AebRepository aebRepository;

    @Override
    public List<AebDTO> getOrgCodes() {
        return StreamSupport.stream(aebRepository.findAll().spliterator(),false)
                .map(obj -> new AebDTO(
                    obj.getId(),
                    obj.getOrgName(),
                    obj.getOrgCode()))
                .toList();
    }
    
}
