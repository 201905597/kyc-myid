package com.tfgkyc.kycid.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgkyc.kycid.model.DocTable;
import com.tfgkyc.kycid.repository.DocRepository;
import com.tfgkyc.kycid.service.DocService;
import com.tfgkyc.kycid.service.dto.DocDTO;

import java.util.List;
import java.util.stream.StreamSupport;

@Service
public class DocServiceImpl implements DocService{

    @Autowired
    private DocRepository docRepository;

    @Override
    public List<DocDTO> getDocs(){
        return StreamSupport.stream(docRepository.findAll().spliterator(),false)
                .map(obj -> new DocDTO(
                    obj.getId(),
                    obj.getDni(),
                    obj.getDocHash(),
                    obj.getDocumentData()))
                .toList();
    }

    @Override
    public DocTable insertDoc(DocTable docTable){
        DocTable docTable2 = new DocTable();
        docTable2.setDni(docTable.getDni());
        docTable2.setDocHash(docTable.getDocHash());
        docTable2.setDocumentData(docTable.getDocumentData());
        DocTable newDoc = docRepository.save(docTable2);
        return newDoc;
    }
    
}
