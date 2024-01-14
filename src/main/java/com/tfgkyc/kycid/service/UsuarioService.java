package com.tfgkyc.kycid.service;

import java.util.List;

import com.tfgkyc.kycid.model.UsuarioTable;
import com.tfgkyc.kycid.service.dto.UsuarioDTO;

public interface UsuarioService {

    //All data from Usuarios Table
    List<UsuarioDTO> getUsuarios();

    //Borrar Usuario
    void deleteUsuario(Long id);

    //Actualizar Usuario
    UsuarioTable updateUsuario(Long id, UsuarioTable usuario);

    //Insertar usuario
    UsuarioTable insertUsuario(UsuarioTable usuarioTable);
}
