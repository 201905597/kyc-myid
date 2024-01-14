package com.tfgkyc.kycid.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgkyc.kycid.model.UsuarioTable;
import com.tfgkyc.kycid.repository.UsuarioRepository;
import com.tfgkyc.kycid.service.UsuarioService;
import com.tfgkyc.kycid.service.dto.UsuarioDTO;

import java.util.List;
import java.util.stream.StreamSupport;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     *
     * @return All usuarios from USUARIOS table
     */
    @Override
    public List<UsuarioDTO> getUsuarios() {
        return StreamSupport.stream(usuarioRepository.findAll().spliterator(),false)
                .map(obj -> new UsuarioDTO(
                        obj.getId(),
                        obj.getUserName(),
                        obj.getDni(),
                        obj.getUserData(),
                        obj.getUserPwd(),
                        obj.getUserEmail()))
                .toList();
    }

    /**
     * Dar de baja a un usuario
     * @param id ID del usuario que se quiere dar de baja
     */
    @Override
    public void deleteUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    /**
     * Actualizar los datos de un usuario
     * @param id ID del usuario que se quiere actualizar
     * @param usuario objeto del usuario con los cambios añadidos
     * @return usuario actualizado
     */
    @Override
    public UsuarioTable updateUsuario(Long id, UsuarioTable usuario) {
        if (usuarioRepository.existsById(id)){
            return usuarioRepository.save(usuario);
        }else{
            return null;
        }
    }

    /**
     * Añadir un nuevo usuario a la base de datos
     * @param usuarioTable nuevo usuario que se quiere añadir
     * @return usuario añadido
     */
    @Override
    public UsuarioTable insertUsuario(UsuarioTable usuarioTable) {
        UsuarioTable userTable= new UsuarioTable();
        // Como es un POST, no pasamos el ID (es un Long @Id, se autoincrementa solo)
        userTable.setUserData(usuarioTable.getUserData());
        userTable.setUserName(usuarioTable.getUserName());
        userTable.setUserPwd(usuarioTable.getUserPwd());
        userTable.setUserEmail(usuarioTable.getUserEmail());
        userTable.setDni(usuarioTable.getDni());
        UsuarioTable newUser = usuarioRepository.save(userTable);
        return newUser;
    }
}
