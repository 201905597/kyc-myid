package com.tfgkyc.kycid.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tfgkyc.kycid.model.OrganizacionTable;
import com.tfgkyc.kycid.service.OrganizacionService;
import com.tfgkyc.kycid.service.dto.OrganizacionDTO;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class OrganizacionController {
    
    @Autowired
    private OrganizacionService organizacionService;

    @GetMapping("/orgs")
    public ResponseEntity<List<OrganizacionDTO>> getAllOrgs(){
        List<OrganizacionDTO> orgs = new ArrayList<OrganizacionDTO>();
        orgs = organizacionService.getOrganizaciones();
        return ResponseEntity.ok().body(orgs);
    }

    @GetMapping("/orgs/{id}")
    public ResponseEntity<OrganizacionDTO> getOrgById(@PathVariable("id") long id){
        OrganizacionDTO orgEncontrada = null;
        List<OrganizacionDTO> orgs = new ArrayList<OrganizacionDTO>();
        orgs = organizacionService.getOrganizaciones();
        for (OrganizacionDTO org : orgs){
            if (org.getId() == id)
            orgEncontrada = org;
        }
        return ResponseEntity.ok().body(orgEncontrada);
    }

    @DeleteMapping("/orgs/{id}")
    public ResponseEntity<OrganizacionDTO> deleteOrgById(@PathVariable("id") long id){
        organizacionService.deleteOrg(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/orgs/{id}")
    public ResponseEntity<OrganizacionTable> updateOrg(@PathVariable Long id, @RequestBody OrganizacionTable organizacion){
        OrganizacionTable newOrg = organizacionService.updateOrg(id,organizacion);
        if (newOrg == null){
            return ResponseEntity.ok().body(null);
        }
        return ResponseEntity.ok().body(newOrg);
    }

    @PostMapping("/orgs")
    public ResponseEntity<OrganizacionTable> insertarOrg(@RequestBody OrganizacionTable organizacion){
        try{
            OrganizacionTable newOrg = organizacionService.insertOrg(organizacion);
            return new ResponseEntity<>(newOrg, HttpStatus.CREATED);
        }catch(Exception e){
            System.out.println(e);
            return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
