package com.tfgkyc.kycid.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tfgkyc.kycid.service.DNIService;
import com.tfgkyc.kycid.service.dto.DNIDTO;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class DNIController {

    @Autowired
    private DNIService dniService;

    @GetMapping("/dnis")
    public ResponseEntity<List<DNIDTO>> getAllDocs(){
        List<DNIDTO> dnidocs = new ArrayList<DNIDTO>();
        dnidocs = dniService.getDNIs();
        return ResponseEntity.ok().body(dnidocs);
    }
    
}
