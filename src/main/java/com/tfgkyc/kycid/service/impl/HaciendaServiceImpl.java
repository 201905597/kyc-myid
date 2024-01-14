package com.tfgkyc.kycid.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgkyc.kycid.repository.HaciendaRepository;
import com.tfgkyc.kycid.service.HaciendaService;
import com.tfgkyc.kycid.service.dto.HaciendaDTO;

import java.util.List;
import java.util.stream.StreamSupport;

@Service
public class HaciendaServiceImpl implements HaciendaService {

    @Autowired
    private HaciendaRepository haciendaRepository;

    @Override
    public List<HaciendaDTO> getDocsHacienda(){
        return StreamSupport.stream(haciendaRepository.findAll().spliterator(),false)
                .map(obj -> new HaciendaDTO(
                    obj.getId(),
                    obj.getDni(),
                    obj.getDocHash()))
                .toList();
    }
    
}
