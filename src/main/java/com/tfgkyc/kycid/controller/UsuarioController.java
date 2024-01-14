package com.tfgkyc.kycid.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tfgkyc.kycid.model.UsuarioTable;
import com.tfgkyc.kycid.service.UsuarioService;
import com.tfgkyc.kycid.service.dto.UsuarioDTO;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> getAllUsuarios(){
        List<UsuarioDTO> usuarios = new ArrayList<UsuarioDTO>();
        usuarios = usuarioService.getUsuarios();
        return ResponseEntity.ok().body(usuarios);
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioById(@PathVariable("id") long id){
        UsuarioDTO usuarioEncontrado = null;
        List<UsuarioDTO> usuarios = new ArrayList<UsuarioDTO>();
        usuarios = usuarioService.getUsuarios();
        for (UsuarioDTO usuario : usuarios){
            if (usuario.getId() == id)
                usuarioEncontrado = usuario;
        }
        return ResponseEntity.ok().body(usuarioEncontrado);
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioDTO> deleteUsuarioById(@PathVariable("id") long id){
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioTable> updateUsuario(@PathVariable Long id, @RequestBody UsuarioTable usuario){
        UsuarioTable newUser = usuarioService.updateUsuario(id,usuario);
        if (newUser == null){
            return ResponseEntity.ok().body(null);
        }
        return ResponseEntity.ok().body(newUser);
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioTable> insertarUsuario(@RequestBody UsuarioTable usuario){
        try{
            UsuarioTable newUser = usuarioService.insertUsuario(usuario);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        }catch(Exception e){
            System.out.println(e);
            return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
