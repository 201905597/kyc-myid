package com.tfgkyc.kycid.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tfgkyc.kycid.service.AebService;
import com.tfgkyc.kycid.service.dto.AebDTO;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AebController {

    @Autowired
    private AebService aebService;

    @GetMapping("/aeb")
    public ResponseEntity<List<AebDTO>> getAllDocs(){
        List<AebDTO> orgCodes = new ArrayList<AebDTO>();
        orgCodes = aebService.getOrgCodes();
        return ResponseEntity.ok().body(orgCodes);
    }
    
}
