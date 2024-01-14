package com.tfgkyc.kycid.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgkyc.kycid.repository.AsnefRepository;
import com.tfgkyc.kycid.service.AsnefService;
import com.tfgkyc.kycid.service.dto.AsnefDTO;

import java.util.List;
import java.util.stream.StreamSupport;

@Service
public class AsnefServiceImpl implements AsnefService{
    
    @Autowired
    private AsnefRepository asnefRepository;
    
    @Override
    public List<AsnefDTO> getAsnefUsuarios(){
        return StreamSupport.stream(asnefRepository.findAll().spliterator(),false)
                .map(obj -> new AsnefDTO(
                    obj.getId(),
                    obj.getDni()))
                .toList();
    }

}
