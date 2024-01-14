package com.tfgkyc.kycid.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tfgkyc.kycid.service.CirbeService;
import com.tfgkyc.kycid.service.dto.CirbeDTO;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CirbeController {

    @Autowired
    private CirbeService cirbeService;

    @GetMapping("/cirbe")
    public ResponseEntity<List<CirbeDTO>> getAllUsers(){
        List<CirbeDTO> cirbeUsers = new ArrayList<CirbeDTO>();
        cirbeUsers = cirbeService.getCirbeUsuarios();
        return ResponseEntity.ok().body(cirbeUsers);
    }
    
}
