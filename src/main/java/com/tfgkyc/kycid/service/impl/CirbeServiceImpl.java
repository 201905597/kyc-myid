package com.tfgkyc.kycid.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgkyc.kycid.repository.CirbeRepository;
import com.tfgkyc.kycid.service.CirbeService;
import com.tfgkyc.kycid.service.dto.CirbeDTO;

import java.util.List;
import java.util.stream.StreamSupport;

@Service
public class CirbeServiceImpl implements CirbeService {

    @Autowired
    private CirbeRepository cirbeRepository;
    
    @Override
    public List<CirbeDTO> getCirbeUsuarios(){
        return StreamSupport.stream(cirbeRepository.findAll().spliterator(), false)
            .map(obj -> new CirbeDTO(
                obj.getId(),
                obj.getDni(),
                obj.getDeuda()))
            .toList();    
    }

}
