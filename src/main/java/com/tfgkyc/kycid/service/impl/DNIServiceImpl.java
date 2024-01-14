package com.tfgkyc.kycid.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgkyc.kycid.repository.DNIRepository;
import com.tfgkyc.kycid.service.DNIService;
import com.tfgkyc.kycid.service.dto.DNIDTO;

import java.util.List;
import java.util.stream.StreamSupport;

@Service
public class DNIServiceImpl implements DNIService {

    @Autowired
    private DNIRepository dniRepository;

    @Override
    public List<DNIDTO> getDNIs(){
        return StreamSupport.stream(dniRepository.findAll().spliterator(),false)
                .map(obj -> new DNIDTO(
                    obj.getId(),
                    obj.getDni(),
                    obj.getDniHash()))
                .toList();
    }
    
}
