package com.tfgkyc.kycid.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tfgkyc.kycid.model.DocTable;
import com.tfgkyc.kycid.service.DocService;
import com.tfgkyc.kycid.service.dto.DocDTO;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class DocController {

    @Autowired
    private DocService docService;

    @GetMapping("/docs")
    public ResponseEntity<List<DocDTO>> getAllDocs(){
        List<DocDTO> docs = new ArrayList<DocDTO>();
        docs = docService.getDocs();
        return ResponseEntity.ok().body(docs);
    }

    @PostMapping("/docs")
    public ResponseEntity<DocTable> insertarDoc(@RequestBody DocTable doc){
        try{
            DocTable newDocu = docService.insertDoc(doc);
            return new ResponseEntity<>(newDocu, HttpStatus.CREATED);
        }catch(Exception e){
            System.out.println(e);
            return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}
