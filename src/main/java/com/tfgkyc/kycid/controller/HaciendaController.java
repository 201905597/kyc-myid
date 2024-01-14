package com.tfgkyc.kycid.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tfgkyc.kycid.service.HaciendaService;
import com.tfgkyc.kycid.service.dto.HaciendaDTO;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class HaciendaController {

    @Autowired
    private HaciendaService haciendaService;

    @GetMapping("/hacienda")
    public ResponseEntity<List<HaciendaDTO>> getAllDocs(){
        List<HaciendaDTO> docs = new ArrayList<HaciendaDTO>();
        docs = haciendaService.getDocsHacienda();
        return ResponseEntity.ok().body(docs);
    }
    
}
