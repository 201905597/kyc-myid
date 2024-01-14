package com.tfgkyc.kycid.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("DOCUMENTOS")
public class DocTable {
    private @Column("ID") @Id Long id;
    private @Column("DNI") String dni;
    private @Column("DOCHASH") String docHash;
    private @Column("DOCUMENT_DATA") byte[] documentData;
}
