package com.tfgkyc.kycid.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tfgkyc.kycid.service.AsnefService;
import com.tfgkyc.kycid.service.dto.AsnefDTO;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AsnefController {

    @Autowired
    private AsnefService asnefService;

    @GetMapping("/asnef")
    public ResponseEntity<List<AsnefDTO>> getAllUsers(){
        List<AsnefDTO> asnefUsers = new ArrayList<AsnefDTO>();
        asnefUsers = asnefService.getAsnefUsuarios();
        return ResponseEntity.ok().body(asnefUsers);
    }
    
}
